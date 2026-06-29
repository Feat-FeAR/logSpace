---
title: "Metadata Finder"
weight: 100
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
customcss: "css/mdm.css"
---

# MetaDataFinder
Start by clicking `Search MDM Files`, then select a target folder.
The browser will recursively scan the selected folder and its subfolders for all `.json` files, but only files whose parsed JSON has the top-level `"generated_by": "MetaDataMaker"` field are kept.
The query rows support Key-Value and logical operators such as `AND`, `OR`, `NOT`, as well as `(` and `)` to define priorities.
The query is parsed with normal boolean precedence: `AND` before `OR`, and parentheses override precedence.
Empty Value in a Key-Value row means "key exists".
For string values, matching is case-insensitive and substring-based. For booleans and numbers, the code tries strict boolean/numeric matching first, then falls back to string matching.
Use `Apply Filter` to make filtered results to appear in the bottom inset window.

{{< MDM_MetaDataFinder >}}
