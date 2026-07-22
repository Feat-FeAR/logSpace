// MetaDataFinder (MDF): folder selection, recursive scanning, cancellation, and
// application startup. Load last, after core, UI, and query modules.

(function (global) {
    "use strict"; // to catch common mistakes early

    const MDMFinder = global.MDMFinder;
    if (!MDMFinder || !MDMFinder.core || !MDMFinder.ui || !MDMFinder.query) {
        throw new Error("MDM_metadata_finder_scan.js requires core, UI, and query modules.");
    }

    const {
        constants,
        state,
        yieldToBrowser,
        isJsonFileName,
        formatInteger,
        isMdmMetadata,
        readableError,
        collectFilterablePaths
    } = MDMFinder.core;

    // During a long scan, the UI status is updated every N filesystem
    // entries. This avoids refreshing the page text after every single
    // file, which would be unnecessarily expensive for large folders.
    const { STATUS_UPDATE_INTERVAL } = constants;
    const {
        byId,
        setSearchBusy,
        setSearchStatus,
        renderInitialResults,
        renderFilteredResults
    } = MDMFinder.ui;
    const { renderQueryRows, updateQueryBuilderButtonStates } = MDMFinder.query;

    // -------------------------------------------------------------------------
    // Search status and UI state
    // -------------------------------------------------------------------------
    
    // Reset all scan results and query rows before starting a new search.
    function resetSearchState() {
        state.selectedRootLabel = "";
        state.scannedEntries = 0;
        state.jsonFilesSeen = 0;
        state.mdmFiles = [];
        state.parseErrors = [];
        state.skippedEntries = [];
        state.keySet = new Set();
        state.searchCancelRequested = false;
        state.queryElements = [];
        state.nextQueryId = 1;

        renderQueryRows();
        renderInitialResults();
        renderFilteredResults([], "No filter applied.");
    }

    // Show live progress while the scan is still running.
    function updateScanStatus() {
        setSearchStatus(
            "Scanning " +
            formatInteger(state.scannedEntries) +
            " filesystem entries; " +
            formatInteger(state.jsonFilesSeen) +
            " JSON files inspected; " +
            formatInteger(state.mdmFiles.length) +
            " MDM files found."
        );
    }

    // Show final scan summary when the scan finishes or is cancelled.
    function finishScanStatus() {
        const cancelled = state.searchCancelRequested ? " Search cancelled." : " Search complete.";
        const errorSummary = state.parseErrors.length > 0
            ? " " + formatInteger(state.parseErrors.length) + " JSON parse/read errors."
            : "";
        const skippedSummary = state.skippedEntries.length > 0
            ? " " + formatInteger(state.skippedEntries.length) + " entries skipped."
            : "";

        setSearchStatus(
            formatInteger(state.mdmFiles.length) +
            " MDM files found in " +
            formatInteger(state.jsonFilesSeen) +
            " JSON files inspected." +
            cancelled +
            errorSummary +
            skippedSummary
        );
    }

    // -------------------------------------------------------------------------
    // Search entry point
    // -------------------------------------------------------------------------

    // Called when the user clicks "Search MDM Files".
    // It first tries the modern File System Access API. If that is unavailable
    // or fails for compatibility reasons, it falls back to the hidden
    // <input type="file" webkitdirectory> element.
    async function searchMdmFiles() {
        resetSearchState();
        setSearchBusy(true);
        setSearchStatus("Choose a folder to scan...");

        try {
            let usedModernPicker = false;

            // Modern Chromium-like browsers may provide showDirectoryPicker().
            // This provides a directory handle that can be recursively iterated.
            if ("showDirectoryPicker" in window) {
                usedModernPicker = await scanWithDirectoryPicker();
            }

            // Fallback path for browsers where showDirectoryPicker() is not
            // available or not usable. The hidden input is expected to exist in
            // MDM_MetaDataFinder.html.
            if (!usedModernPicker) {
                const fallbackInput = byId("mdmfFolderInput");
                if (fallbackInput) {
                    setSearchBusy(false);
                    setSearchStatus("Choose a folder using the fallback file picker...");
                    fallbackInput.click();
                    return;
                }

                setSearchStatus("No supported folder picker is available in this browser.", true);
            }
        } catch (err) {
            console.error("MetaDataFinder search failed:", err);
            setSearchStatus("Search failed: " + readableError(err), true);
        } finally {
            // If a modern-picker scan completed normally, the busy state is
            // still true here and must be cleared. In the fallback path, busy
            // was already cleared before opening the file picker.
            if (state.isSearching) {
                setSearchBusy(false);
            }
        }
    }

    // Modern folder picker scan.
    // Ask the user to choose a folder with showDirectoryPicker(), then scan it
    // recursively through FileSystemDirectoryHandle entries.
    async function scanWithDirectoryPicker() {
        let rootHandle;

        try {
            rootHandle = await window.showDirectoryPicker({ mode: "read" });
        } catch (err) {
            // User clicked Cancel. This is not an error and should not trigger
            // the fallback input immediately.
            if (err && err.name === "AbortError") {
                setSearchStatus("Folder selection cancelled.");
                return true;
            }

            // Some browsers may expose the method but fail due to context,
            // permissions, or implementation details. In that case, fallback.
            console.warn("showDirectoryPicker() failed; falling back to file input.", err);
            return false;
        }

        // Selected folder name, not an absolute filesystem path.
        state.selectedRootLabel = rootHandle.name || "selected-folder";

        // Recursive scan starts here.
        await walkDirectoryHandle(rootHandle, state.selectedRootLabel);

        // Sort results alphabetically by displayed path for stable UI output.
        state.mdmFiles.sort((a, b) => a.path.localeCompare(b.path));
        
        renderInitialResults();
        renderQueryRows();
        finishScanStatus();
        return true;
    }

    // Recursively walk a FileSystemDirectoryHandle.
    // directoryHandle: browser handle for the current folder.
    // displayPrefix: selected-folder-relative path shown in the UI.
    async function walkDirectoryHandle(directoryHandle, displayPrefix) {
        try {
            for await (const [name, handle] of directoryHandle.entries()) {
                if (state.searchCancelRequested) return;

                const displayPath = displayPrefix ? displayPrefix + "/" + name : name;
                state.scannedEntries++;

                if (handle.kind === "directory") {
                    // Recurse into subfolder.
                    await walkDirectoryHandle(handle, displayPath);
                } else if (handle.kind === "file" && isJsonFileName(name)) {
                    // Read and inspect JSON files only.
                    try {
                        const file = await handle.getFile();
                        await inspectJsonFile(file, displayPath);
                    } catch (err) {
                        state.parseErrors.push({ path: displayPath, error: readableError(err) });
                    }
                }

                // Periodically update status and yield to the UI.
                if (state.scannedEntries % STATUS_UPDATE_INTERVAL === 0) {
                    updateScanStatus();
                    await yieldToBrowser();
                }
            }
        } catch (err) {
            // Directory iteration can fail for permission or OS-level reasons.
            // The scan records the skipped folder and continues elsewhere.
            state.skippedEntries.push({ path: displayPrefix, error: readableError(err) });
        }
    }

    // Fallback folder-input scan.
    // Called by the hidden folder input when the user selects a directory.
    // The file input provides a flat FileList, usually with each file carrying
    // a webkitRelativePath that preserves the selected directory hierarchy.
    async function handleFolderInput(fileList) {
        resetSearchState();
        setSearchBusy(true);

        try {
            const files = Array.from(fileList || []);
            if (files.length === 0) {
                setSearchStatus("Folder selection cancelled.");
                return;
            }

            state.selectedRootLabel = inferRootLabelFromFiles(files);

            for (let i = 0; i < files.length; i++) {
                if (state.searchCancelRequested) break;

                const file = files[i];
                const displayPath = file.webkitRelativePath || file.name;
                state.scannedEntries++;

                if (isJsonFileName(file.name)) {
                    await inspectJsonFile(file, displayPath);
                }

                if (state.scannedEntries % STATUS_UPDATE_INTERVAL === 0) {
                    updateScanStatus();
                    await yieldToBrowser();
                }
            }

            state.mdmFiles.sort((a, b) => a.path.localeCompare(b.path));
            renderInitialResults();
            renderQueryRows();
            finishScanStatus();
        } catch (err) {
            console.error("MetaDataFinder fallback scan failed:", err);
            setSearchStatus("Search failed: " + readableError(err), true);
        } finally {
            setSearchBusy(false);

            // Resetting the input value allows the user to select the same
            // folder again and still trigger a change event.
            const fallbackInput = byId("mdmfFolderInput");
            if (fallbackInput) {
                fallbackInput.value = "";
            }
        }
    }

    // Infer a readable root label from the first file path returned by the
    // fallback picker. Example:
    //
    //   ExperimentFolder/subfolder/file.json -> ExperimentFolder
    function inferRootLabelFromFiles(files) {
        const firstPath = files[0]?.webkitRelativePath || "";
        if (!firstPath) return "selected-files";
        return firstPath.split("/")[0] || "selected-folder";
    }

    // -------------------------------------------------------------------------
    // JSON inspection
    // -------------------------------------------------------------------------

    // Read one File object, parse it as JSON, and keep it only if it is an MDM
    // metadata file.
    async function inspectJsonFile(file, displayPath) {
        state.jsonFilesSeen++;

        try {
            const text = await file.text();
            const metadata = JSON.parse(text);

            if (isMdmMetadata(metadata)) {
                const entry = {
                    name: file.name,
                    path: displayPath,
                    size: file.size,
                    lastModified: file.lastModified || null,
                    metadata
                };

                state.mdmFiles.push(entry);

                // Add all metadata paths found in this file to the global key
                // set used by the Key dropdown menu.
                collectFilterablePaths(metadata, "", state.keySet);
            }
        } catch (err) {
            // Malformed JSON or read errors are recorded but do not stop the
            // whole folder scan.
            state.parseErrors.push({ path: displayPath, error: readableError(err) });
        }
    }

    // -------------------------------------------------------------------------
    // Initialization
    // -------------------------------------------------------------------------

    // Request cancellation. The scan checks this flag between files/folders.
    // It cannot interrupt the exact instant of a file read, but it stops soon
    // afterward.
    function cancelSearch() {
        state.searchCancelRequested = true;
        setSearchStatus("Cancelling search after the current file/folder finishes...");
    }

    // Initialize the empty UI once the HTML document is ready.
    document.addEventListener("DOMContentLoaded", function () {
        renderInitialResults();
        renderQueryRows();
        updateQueryBuilderButtonStates();
        renderFilteredResults([], "Filtered MDM JSON files will be listed here.");
    });

    // -------------------------------------------------------------------------
    
    Object.assign(MDMFinder, {
        searchMdmFiles,
        cancelSearch,
        handleFolderInput
    });

})(window);
