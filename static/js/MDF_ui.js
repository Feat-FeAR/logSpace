// MetaDataFinder (MDF): DOM helpers, statuses, and results rendering.
// Load after 'MDF_core.js'.

(function (global) {
    "use strict"; // to catch common mistakes early

    const MDMFinder = global.MDMFinder;
    if (!MDMFinder || !MDMFinder.core) {
        throw new Error("MDM_metadata_finder_ui.js requires the core module.");
    }

    const { state, formatInteger, getValuesAtPath, extractComparableValues } = MDMFinder.core;

    // -------------------------------------------------------------------------
    // Helper functions
    // -------------------------------------------------------------------------

    // Just a convenience wrapper around 'document.getElementById()'
    function byId(id) {
        return document.getElementById(id);
    }

    // Remove all children from an element.
    // Used before re-rendering result boxes or query rows.
    function clearElement(element) {
        if (!element) return;
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    // Append a single text line to a parent element.
    // textContent is used instead of innerHTML to avoid injecting HTML from
    // file names or metadata values.
    function appendTextLine(parent, text, className) {
        const line = document.createElement("div");
        if (className) line.className = className;
        line.textContent = text;
        parent.appendChild(line);
        return line;
    }

    // -------------------------------------------------------------------------
    // Search status and UI state
    // -------------------------------------------------------------------------
    
    // Enable/disable the main search button and show/hide the cancel button.
    // This prevents the user from launching two scans at the same time.
    function setSearchBusy(isBusy) {
        state.isSearching = isBusy;

        const searchButton = byId("mdmfSearchButton");
        const cancelButton = byId("mdmfCancelButton");

        if (searchButton) {
            searchButton.disabled = isBusy;
            searchButton.textContent = isBusy ? "Searching..." : "Search MDM Files";
        }

        if (cancelButton) {
            cancelButton.hidden = !isBusy;
        }
    }

    // Update the message near the folder-search controls.
    // isError toggles a CSS class so error messages can be styled differently.
    function setSearchStatus(text, isError = false) {
        const status = byId("mdmfSearchStatus");
        if (!status) return;

        status.textContent = text;
        status.classList.toggle("mdmfError", Boolean(isError));
    }

    // Update the message near the filter controls.
    function setFilterStatus(text, isError = false) {
        const status = byId("mdmfFilterStatus");
        if (!status) return;

        status.textContent = text;
        status.classList.toggle("mdmfError", Boolean(isError));
    }

    // -------------------------------------------------------------------------
    // Query-builder button availability (button-shadowing system)
    // -------------------------------------------------------------------------

    function setButtonEnabled(id, enabled, disabledTitle) {
        const button = byId(id);
        if (!button) return;

        button.disabled = !enabled;
        button.title = enabled ? "" : disabledTitle;
    }

    // -------------------------------------------------------------------------
    // Results rendering
    // -------------------------------------------------------------------------

    // Render the upper inset window: all MDM files found in the selected folder.
    function renderInitialResults() {
        const container = byId("mdmfInitialResults");
        if (!container) return;

        clearElement(container);

        if (state.mdmFiles.length === 0) {
            appendTextLine(container, "No MDM JSON files found yet.", "mdmfMutedLine");
            return;
        }

        appendTextLine(
            container,
            formatInteger(state.mdmFiles.length) +
            " MDM JSON files found; " +
            formatInteger(state.keySet.size) +
            " filterable metadata keys collected.",
            "mdmfSummaryLine"
        );
        appendTextLine(container, "Paths are shown relative to the selected folder.", "mdmfMutedLine");

        const list = document.createElement("div");
        list.className = "mdmfFileList";

        state.mdmFiles.forEach(entry => {
            appendFileLine(list, entry);
        });

        container.appendChild(list);
    }

    // Render the lower inset window: files matching the current filter query.
    function renderFilteredResults(matches, message) {
        const container = byId("mdmfFilteredResults");
        if (!container) return;

        clearElement(container);

        if (message) {
            appendTextLine(container, message, "mdmfMutedLine");
            return;
        }

        if (!matches || matches.length === 0) {
            appendTextLine(container, "No files match the current filter.", "mdmfMutedLine");
            return;
        }

        appendTextLine(container, formatInteger(matches.length) + " filtered files:", "mdmfSummaryLine");

        const list = document.createElement("div");
        list.className = "mdmfFileList";

        matches.forEach(entry => {
            appendFileLine(list, entry);
        });

        container.appendChild(list);
    }

    // Append one file entry line to a result list.
    function appendFileLine(parent, entry) {
        const line = document.createElement("div");
        line.className = "mdmfFileLine";

        const path = document.createElement("code");
        path.className = "mdmfFilePath";
        path.textContent = entry.path;
        line.appendChild(path);

        const meta = document.createElement("div");
        meta.className = "mdmfFileMeta";
        meta.textContent = makeEntrySummary(entry);
        line.appendChild(meta);

        parent.appendChild(line);
    }

    // Create a compact summary shown after each path in the results list.
    // This is optional display information; it does not affect filtering.
    function makeEntrySummary(entry) {
        const metadata = entry.metadata || {};
        const parts = [];

        const date = getFirstComparable(metadata, "general.date");
        const cellType = getFirstComparable(metadata, "cell_cultures.cell_type");
        const condition = getFirstComparable(metadata, "cell_cultures.experimental_condition");
        const configuration = getFirstComparable(metadata, "patch_clamp.configuration");

        if (date) parts.push("date: " + date);
        if (cellType) parts.push("cell: " + cellType);
        if (condition) parts.push("condition: " + condition);
        if (configuration) parts.push("configuration: " + configuration);

        return parts.length > 0 ? "[" + parts.join("; ") + "]" : "";
    }

    // Get the first non-empty comparable value for display summaries.
    function getFirstComparable(metadata, keyPath) {
        const raw = getValuesAtPath(metadata, keyPath);
        if (raw.length === 0) return "";

        const values = extractComparableValues(raw[0]).filter(value => {
            return value !== null && value !== undefined && String(value).trim() !== "";
        });

        return values.length > 0 ? String(values[0]) : "";
    }

    // -------------------------------------------------------------------------

    MDMFinder.ui = Object.freeze({
        byId,
        clearElement,
        appendTextLine,
        setSearchBusy,
        setSearchStatus,
        setFilterStatus,
        setButtonEnabled,
        renderInitialResults,
        renderFilteredResults
    });
    
})(window);
