// MetaDataFinder (MDF): query-builder UI, grammar, RPN compilation, validation,
// and evaluation. Load after the core and UI modules.

(function (global) {
    "use strict"; // to catch common mistakes early

    const MDMFinder = global.MDMFinder;
    if (!MDMFinder || !MDMFinder.core || !MDMFinder.ui) {
        throw new Error("MDM_metadata_finder_query.js requires the core and UI modules.");
    }

    const {
        constants,
        state,
        formatInteger,
        readableError,
        evaluateKeyValue,
        normalizeComparator,
        isRelationalComparator,
        requiresExplicitComparisonValue,
        parseComparableScalar
    } = MDMFinder.core;
    const { ANY_KEY, COMPARISON_OPERATORS } = constants;
    const {
        byId,
        clearElement,
        appendTextLine,
        setFilterStatus,
        setButtonEnabled,
        renderFilteredResults
    } = MDMFinder.ui;

    // -------------------------------------------------------------------------
    // Query UI model and rendering
    // -------------------------------------------------------------------------

    // Add a new query row of a requested kind.
    // kind must be one of: kv, and, or, xor, open, close.
    function addQueryElement(kind) {
        const normalizedKind = String(kind || "").toLowerCase();
        const allowedKinds = ["kv", "and", "or", "xor", "open", "close"];
        if (!allowedKinds.includes(normalizedKind)) return;

        // The button-shadowing system should already prevent invalid clicks.
        // This guard is still important because addQueryElement() is part of
        // the public MDMFinder API and could be called manually by the console.
        if (!canAddQueryElement(normalizedKind)) {
            setFilterStatus(
                "Cannot add " + queryKindLabel(normalizedKind) + " at this position in the query.",
                true
            );
            updateQueryBuilderButtonStates();
            return;
        }

        state.queryElements.push({
            id: state.nextQueryId++,
            kind: normalizedKind,
            key: "",
            comparator: "=",
            value: ""
        });

        renderQueryRows();
    }

    // Remove one query row by its unique id.
    function removeQueryElement(id) {
        state.queryElements = state.queryElements.filter(element => element.id !== Number(id));
        renderQueryRows();
    }

    // Remove all query rows and reset the filtered-results panel.
    function clearQuery() {
        state.queryElements = [];
        renderQueryRows();
        renderFilteredResults([], "No filter applied.");
        setFilterStatus("No filter applied.");
    }

    // Update one query row with a partial object, for example:
    //
    //   updateQueryElement(3, { key: "general.date" })
    //   updateQueryElement(3, { value: "2026" })
    function updateQueryElement(id, patch) {
        const element = state.queryElements.find(item => item.id === Number(id));
        if (!element) return;
        Object.assign(element, patch);
    }

    // Render all query rows inside the mdmfQueryRows container.
    function renderQueryRows() {
        const container = byId("mdmfQueryRows");
        if (!container) return;

        clearElement(container);

        if (state.queryElements.length === 0) {
            appendTextLine(container, "Add query elements with the buttons above.", "mdmfEmptyQuery stdMetaField");
            updateQueryBuilderButtonStates();
            return;
        }

        state.queryElements.forEach(element => {
            const row = document.createElement("div");
            row.className = "mdmfQueryRow stdMetaField";

            const deleteButton = document.createElement("button");
            deleteButton.className = "smallButton mdmfBinButton";
            deleteButton.type = "button";
            deleteButton.textContent = "[ × ]";
            deleteButton.title = "Delete this query element";
            deleteButton.addEventListener("click", () => removeQueryElement(element.id));
            row.appendChild(deleteButton);

            if (element.kind === "kv") {
                renderKeyValueQueryElement(row, element);
            } else {
                const token = document.createElement("div");
                token.className = "mdmfLogicalToken";
                token.textContent = queryKindLabel(element.kind);
                row.appendChild(token);
            }

            container.appendChild(row);
        });

        updateQueryBuilderButtonStates();
    }

    // Render a Key-Value row:
    //
    //   delete button + key input/datalist + comparison dropdown + value input
    //
    function renderKeyValueQueryElement(row, element) {
        //const label = document.createElement("label");
        //label.className = "metaLabel";
        //label.textContent = "Key-Value:";
        //row.appendChild(label);

        // Native <datalist> binds predefined suggestions (dropdown-style) to
        // a user-defined input via matching (i.e., autocomplete feature).
        const keyInput = document.createElement("input");
        const keyList = document.createElement("datalist");
        const keyListId = "mdmfKeyOptions_" + element.id;

        keyInput.className = "mdmfInput mdmfKeySelect";
        keyInput.type = "text";
        keyInput.value = element.key || "";
        keyInput.placeholder = state.keySet.size > 0
            ? "Type or choose metadata key"
            : "-- no keys available --";
        keyInput.setAttribute("list", keyListId);
        keyInput.autocomplete = "off";
        keyInput.disabled = state.keySet.size === 0;

        keyInput.addEventListener("input", () => {
            updateQueryElement(element.id, { key: keyInput.value.trim() });
        });

        keyInput.addEventListener("change", () => {
            updateQueryElement(element.id, { key: keyInput.value.trim() });
        });

        keyList.id = keyListId;
        populateKeyDatalist(keyList);

        row.appendChild(keyInput);
        row.appendChild(keyList);

        const comparatorSelect = document.createElement("select");
        comparatorSelect.className = "mdmfInput mdmfComparatorSelect";
        comparatorSelect.title = "Comparison operator";
        comparatorSelect.addEventListener("change", () => {
            updateQueryElement(element.id, { comparator: comparatorSelect.value });
        });
        populateComparatorSelect(comparatorSelect, element.comparator);
        row.appendChild(comparatorSelect);

        const valueInput = document.createElement("input");
        valueInput.className = "mdmfInput mdmfValueInput";
        valueInput.type = "text";
        valueInput.placeholder = "Value; empty with = means key exists";
        valueInput.value = element.value || "";
        valueInput.addEventListener("input", () => {
            updateQueryElement(element.id, { value: valueInput.value });
        });
        row.appendChild(valueInput);
    }

    // Fill the comparison dropdown for one Key-Value row.
    function populateComparatorSelect(select, selectedValue) {
        if (!select) return;

        clearElement(select);

        const selectedComparator = normalizeComparator(selectedValue);

        COMPARISON_OPERATORS.forEach(operator => {
            const option = document.createElement("option");
            option.value = operator.value;
            option.textContent = operator.label;

            if (operator.value === selectedComparator) {
                option.selected = true;
            }

            select.appendChild(option);
        });
    }

    // Convert internal query kinds to the labels shown in the UI.
    function queryKindLabel(kind) {
        switch (kind) {
            case "and":
                return "AND";
            case "or":
                return "OR";
            case "xor":
                return "XOR";
            case "open":
                return "(";
            case "close":
                return ")";
            default:
                return kind;
        }
    }

    // Fill a Key datalist with all paths discovered in the scanned MDM JSON
    // files. Native <datalist> binds predefined suggestions (dropdown-style)
    // to an input via matching. The field is disabled until keys are available.
    function populateKeyDatalist(datalist) {
        if (!datalist) return;

        clearElement(datalist);

        // Include the universal "any" key
        const anyOption = document.createElement("option");
        anyOption.value = ANY_KEY;
        anyOption.label = "[ ANY ] -> search all metadata fields";
        anyOption.textContent = "[ ANY ] -> search all metadata fields";
        datalist.appendChild(anyOption);

        const keys = Array.from(state.keySet).sort((a, b) => a.localeCompare(b));

        keys.forEach(key => {
            const option = document.createElement("option");
            option.value = key;
            datalist.appendChild(option);
        });
    }

    // -------------------------------------------------------------------------
    // Query-builder button availability (button-shadowing system)
    // -------------------------------------------------------------------------

    // The query UI is an infix boolean-expression builder. Not every token is
    // valid at every position. Here is the formal grammar:
    //  - Key-Value can be used only as first query item, after AND/OR/XOR, or
    //    after an open parenthesis "(";
    //  - AND/OR/XOR can only be used after a Key-Value item or after a closed
    //    parenthesis ")";
    //  - "(" can only be used as first item, after another open parenthesis "(",
    //    or after AND/OR/XOR;
    //  - ")" can only be used after a Key-Value element or after another ")",
    //    and only if there is an unmatched open parenthesis.
    function getQueryPrefixState() {
        let expectOperand = true;
        let openParentheses = 0;
        let invalidPrefix = false;

        state.queryElements.forEach(element => {
            if (invalidPrefix) return;

            if (element.kind === "kv") {
                if (!expectOperand) {
                    invalidPrefix = true;
                    return;
                }
                expectOperand = false;
                return;
            }

            if (element.kind === "open") {
                if (!expectOperand) {
                    invalidPrefix = true;
                    return;
                }
                openParentheses += 1;
                expectOperand = true;
                return;
            }

            if (element.kind === "close") {
                if (expectOperand || openParentheses === 0) {
                    invalidPrefix = true;
                    return;
                }
                openParentheses -= 1;
                expectOperand = false;
                return;
            }

            if (isLogicalOperatorKind(element.kind)) {
                if (expectOperand) {
                    invalidPrefix = true;
                    return;
                }
                expectOperand = true;
                return;
            }

            invalidPrefix = true;
        });

        return {
            expectOperand,
            openParentheses,
            invalidPrefix
        };
    }

    function isLogicalOperatorKind(kind) {
        return kind === "and" || kind === "or" || kind === "xor";
    }

    function canAddQueryElement(kind) {
        const prefix = getQueryPrefixState();
        if (prefix.invalidPrefix) return false;

        if (kind === "kv") {
            return prefix.expectOperand;
        }

        if (kind === "open") {
            return prefix.expectOperand;
        }

        if (isLogicalOperatorKind(kind)) {
            return !prefix.expectOperand;
        }

        if (kind === "close") {
            return !prefix.expectOperand && prefix.openParentheses > 0;
        }

        return false;
    }

    function updateQueryBuilderButtonStates() {
        const prefix = getQueryPrefixState();

        const canAddOperand = !prefix.invalidPrefix && prefix.expectOperand;
        const canAddOperator = !prefix.invalidPrefix && !prefix.expectOperand;
        const canAddClose = canAddOperator && prefix.openParentheses > 0;

        setButtonEnabled(
            "mdmfAddKvButton",
            canAddOperand,
            "Key-Value can be inserted only at the beginning, after AND/OR/XOR, or after '('."
        );

        setButtonEnabled(
            "mdmfAddAndButton",
            canAddOperator,
            "AND can be inserted only after a Key-Value row or after ')'."
        );

        setButtonEnabled(
            "mdmfAddOrButton",
            canAddOperator,
            "OR can be inserted only after a Key-Value row or after ')'."
        );

        setButtonEnabled(
            "mdmfAddXorButton",
            canAddOperator,
            "XOR can be inserted only after a Key-Value row or after ')'."
        );

        setButtonEnabled(
            "mdmfAddOpenButton",
            canAddOperand,
            "'(' can be inserted only at the beginning, after another '(', or after AND/OR/XOR."
        );

        setButtonEnabled(
            "mdmfAddCloseButton",
            canAddClose,
            "')' can be inserted only after a Key-Value row or after another ')', and only if there is an unmatched '('."
        );

        // Empty query remains valid because the current behavior is:
        // no query elements = show all MDM files.
        const canApply =
            !prefix.invalidPrefix &&
            (
                state.queryElements.length === 0 ||
                (!prefix.expectOperand && prefix.openParentheses === 0)
            );

        setButtonEnabled(
            "mdmfApplyFilterButton",
            canApply,
            "Complete the query before applying the filter."
        );
    }

    // -------------------------------------------------------------------------
    // Query compilation
    // -------------------------------------------------------------------------
    //
    // The user-created query rows are first validated and converted into Reverse
    // Polish Notation (RPN). RPN makes evaluation simple because it can be done
    // with a stack.
    //
    // Example normal query:
    //
    //   A AND (B OR C)
    //
    // Equivalent RPN:
    //
    //   A B C OR AND
    //
    // compileQuery() performs this conversion using the shunting-yard algorithm.

    // Called when the user clicks "Apply Filter".
    function applyFilter() {
        if (state.mdmFiles.length === 0) {
            setFilterStatus("No MDM files are available. Search a folder first.", true);
            renderFilteredResults([], "No filtered results.");
            return;
        }

        let compiled;
        try {
            compiled = compileQuery(state.queryElements);
        } catch (err) {
            setFilterStatus("Invalid query: " + readableError(err), true);
            renderFilteredResults([], "Invalid query. Fix the query rows and apply again.");
            return;
        }

        let matches;
        if (compiled.length === 0) {
            matches = state.mdmFiles.slice();
            setFilterStatus("No query elements: showing all " + formatInteger(matches.length) + " MDM files.");
        } else {
            matches = state.mdmFiles.filter(entry => evaluateCompiledQuery(compiled, entry.metadata));
            setFilterStatus(
                formatInteger(matches.length) +
                " of " +
                formatInteger(state.mdmFiles.length) +
                " MDM files match the query."
            );
        }

        renderFilteredResults(matches);
    }

    // Validate query rows and convert them to RPN.
    //
    // Also detects syntax errors such as:
    //   - two Key-Value rows without AND/OR/XOR between them
    //   - AND/OR/XOR at the beginning
    //   - unmatched parentheses
    //   - query ending with AND/OR/XOR/(
    //
    // Note that button shadowing is a preventive UI layer, not a replacement
    // for compileQuery(). Users can still create invalid expressions by
    // deleting intermediate rows. For example: "A AND B" then deleting AND
    // gives: "A B", which is an invalid expression.
    function compileQuery(elements) {
        if (!elements || elements.length === 0) return [];

        const output = [];
        const operators = [];
        let expectOperand = true;

        elements.forEach((element, index) => {
            const position = index + 1;

            if (element.kind === "kv") {
                if (!expectOperand) {
                    throw new Error("missing AND/OR/XOR before Key-Value at row " + position);
                }

                if (!element.key) {
                    throw new Error("missing key in Key-Value row " + position);
                }

                const comparator = normalizeComparator(element.comparator);
                const query = String(element.value || "").trim();

                // Relational comparisons require an actual comparison value.
                // Empty value is allowed only for "=", where it means:
                //    "the selected key exists"
                // For "!=", an empty value would be ambiguous: key != what?
                // For >, <, >=, <=, an empty value is also invalid.
                if (requiresExplicitComparisonValue(comparator) && query === "") {
                    throw new Error("missing comparison value in Key-Value row " + position);
                }

                if (isRelationalComparator(comparator)) {
                    if (parseComparableScalar(query) === null) {
                        throw new Error(
                            "comparison value in Key-Value row " +
                            position +
                            " must be a pure number, an ISO date such as 2026-06-30, " +
                            "or a semantic version such as 2.0.1"
                        );
                    }
                }

                // Store a normalized copy in the compiled query.
                // This means "≥" and ">=" are treated identically later.
                output.push(Object.assign({}, element, { comparator }));

                expectOperand = false;
                return;
            }

            if (element.kind === "open") {
                if (!expectOperand) {
                    throw new Error("missing AND/OR/XOR before '(' at row " + position);
                }

                operators.push(element);
                expectOperand = true;
                return;
            }

            if (element.kind === "close") {
                if (expectOperand) {
                    throw new Error("empty parentheses or missing Key-Value before ')' at row " + position);
                }

                let foundOpen = false;
                while (operators.length > 0) {
                    const top = operators.pop();
                    if (top.kind === "open") {
                        foundOpen = true;
                        break;
                    }
                    output.push(top);
                }

                if (!foundOpen) {
                    throw new Error("unmatched ')' at row " + position);
                }

                expectOperand = false;
                return;
            }

            if (isLogicalOperatorKind(element.kind)) {
                if (expectOperand) {
                    throw new Error("missing Key-Value before " + queryKindLabel(element.kind) + " at row " + position);
                }

                // Apply boolean precedence: AND > XOR > OR.
                while (operators.length > 0) {
                    const top = operators[operators.length - 1];
                    if (top.kind === "open") break;
                    if (operatorPrecedence(top.kind) >= operatorPrecedence(element.kind)) {
                        output.push(operators.pop());
                    } else {
                        break;
                    }
                }

                operators.push(element);
                expectOperand = true;
                return;
            }

            throw new Error("unknown query element at row " + position);
        });

        if (expectOperand) {
            throw new Error("query cannot end with AND, OR, XOR, or '('");
        }

        // Move remaining operators to output. Any remaining "open" parenthesis
        // indicates an unmatched "(".
        while (operators.length > 0) {
            const top = operators.pop();
            if (top.kind === "open") {
                throw new Error("unmatched '('");
            }
            output.push(top);
        }

        return output;
    }

    // Boolean operator precedence used by compileQuery().
    // The precedence of XOR is not universally standardized in every query
    // language. Here we choose the deterministic convention: AND > XOR > OR
    function operatorPrecedence(kind) {
        if (kind === "and") return 3;
        if (kind === "xor") return 2;
        if (kind === "or") return 1;
        return 0;
    }

    // Evaluate a compiled RPN query against one parsed metadata object.
    function evaluateCompiledQuery(compiled, metadata) {
        if (!compiled || compiled.length === 0) return true;

        const stack = [];

        compiled.forEach(token => {
            if (token.kind === "kv") {
                stack.push(evaluateKeyValue(metadata, token.key, token.value, token.comparator));
                return;
            }

            if (isLogicalOperatorKind(token.kind)) {
                const right = Boolean(stack.pop());
                const left = Boolean(stack.pop());

                if (token.kind === "and") {
                    stack.push(left && right);
                } else if (token.kind === "or") {
                    stack.push(left || right);
                } else if (token.kind === "xor") {
                    // Exclusive OR:
                    // true only when exactly one side is true.
                    stack.push(left !== right);
                }
            }
        });

        // A valid RPN boolean expression should leave exactly one final result.
        return stack.length === 1 ? Boolean(stack[0]) : false;
    }

    // -------------------------------------------------------------------------

    MDMFinder.query = Object.freeze({
        renderQueryRows,
        updateQueryBuilderButtonStates,
        compileQuery,
        evaluateCompiledQuery
    });

    // -------------------------------------------------------------------------
    
    Object.assign(MDMFinder, {
        addQueryElement,
        removeQueryElement,
        clearQuery,
        applyFilter
    });

})(window);
