# Clipboard Data Transformer — Design decisions

**Status:** Offline-first UX revision · **Date:** November 23, 2026

## Product goal

A tiny, reliable utility for analysts and other desktop users who routinely transform pasted Excel, SQL, and text data. It should be useful even for data that users cannot send to online AI services. The goal is a quick, deterministic tool, **not** an AI replacement for every unusual data-cleaning task.

## Decisions made

| Topic | Decision | Rationale |
| --- | --- | --- |
| Primary platform | Desktop browser (especially Chrome / Edge on Windows) | Often used at work where software installation is restricted. Phone support is secondary. |
| Distribution | **One self-contained `index.html` file** | Double-click to open; portable; no build step, server, dependency installation, or internet connection. |
| Project files | A self-contained `index.html` plus documentation, tests, and repository metadata | Only the HTML file is required to run the app. |
| Layout | Google Translate-inspired: input on left, output on right | Fast, familiar, visual, and easy to understand. Responsive stacking on narrow screens. |
| Source format | **Automatically detect** common input formats | Users shouldn't have to select how their pasted data is represented. |
| Detection override | Small **Interpret as** selector | Commas and quotes can be ambiguous; users must be able to override a wrong guess. |
| Target format | Select a card with a name and a small example | One selection describes the desired *result*, avoiding separate “add quotes” and “remove quotes” actions. |
| Transformations | Bidirectional where the syntax supports it | Quoted lists to lines and lines to quoted lists are the same engine with different targets. |
| Data cleanup | Separate optional operations | Trim, remove blanks, deduplicate, sort, and change case without proliferating output formats. |
| Output | Auto-generated, editable, with a Copy button | Allows an occasional manual finishing touch. A subsequent change to input/settings regenerates it. |
| Shortcuts | **No global hotkeys required** | Avoid AutoHotkey/EXE requirements and admin-policy complications. |
| Hosting | **Not required** | Same static HTML could be hosted later if desired, but local/offline use is the initial design. |
| Accounts / cloud / AI | **None** | Privacy, simplicity, speed, low ongoing cost and maintenance. |
| Business model | Personal productivity tool first | Validate real-world usage before considering branding, monetization, or promotion. |

## Included features in the initial HTML

- Automatic recognition of line-separated text, comma-separated/CSV data, tab-separated Excel data, SQL single-quoted values, `IN (...)` clauses, and JSON arrays (including arrays of flat objects).
- Format cards with examples for lines, comma-separated, single/double-quoted lists, tab-separated, SQL IN (text and numeric), SQL VALUES, SQL INSERT, JSON array, JSON objects, CSV table, and Markdown table.
- SQL Server, Snowflake, and PostgreSQL identifier quoting for `INSERT` output; SQL string escaping (apostrophes doubled).
- Optional trimming, empty-row filtering, deduplication, sorting, and case conversion.
- Visible, unchecked-by-default first-row-as-headers option for structured output, configurable SQL table name, output editing, example data, Clear all, and “Use output as input.”
- Copy button with a fallback to manually selecting output and using Ctrl+C if browser clipboard permissions disallow programmatic copying.
- Zero external dependencies, zero network requests, no analytics, no storage of pasted content, no local/cloud database, and a restrictive Content Security Policy.

## Privacy and security requirements

1. **Everything must run locally** in browser memory. Do not add third-party scripts, externally hosted CSS/fonts, analytics, fetch/XHR, or any backend endpoints.
2. Do **not** persist input, output, histories, presets, or identifiable data in local storage, cookies, or IndexedDB.
3. A complete Clear all control must empty input and output.
4. Do not insert user-provided text using HTML interpretation; use plain-text textarea values and safe DOM text operations.
5. Explain limits clearly: no network requests **by this page** is not equivalent to employer approval for handling student, patient, employee, or other sensitive records. Browser extensions, device monitoring, OS clipboard history and company policies are outside this file's control.
6. For particularly sensitive use, open the standalone file locally and follow applicable workplace privacy/security rules. Using a hosted copy may create ordinary hosting/access logs, even if the transformed data never leaves the browser.

## Parsing and correctness principles

- Preserve values as **strings by default**: `00123` must not silently become `123`.
- Escape quotes appropriately for CSV, JSON, and SQL. SQL text output must not interpolate unescaped string values.
- Respect Excel's tabs/newlines, standard CSV double-quote escaping, and embedded quoted newlines.
- **Never silently assume ambiguous input is certain.** Display the detected format and permit manual selection.
- Keep operations deterministic. A malformed input or unsupported representation should show an error rather than invent values.
- Multiple-column input can be output as a table; list outputs intentionally flatten cells and show a warning.
- `SQL IN · numbers` checks numeric syntax rather than attempting unsafe automatic number conversion.
- SQL INSERT uses quoted text literals by default. Database type awareness, `NULL` interpretation, vendor-specific data types, and multiline batch generation are **not** part of this release.
- This is a formatter, not a SQL parser, CSV spreadsheet application, or security sanitization service.

## UX refinements

- Reduced visual noise with restrained neutral palette, clearer typography, simplified two-panel workspace, and aligned formatting controls.
- Removed the green status-style "offline" pill, because green can imply connected/online. Local processing is explained in neutral text.
- Added an in-app **How to use** dialog, sample conversions, a prominent SQL INSERT helper, and `docs/USER_GUIDE.md`.
- **First row contains headers** defaults to off: a single pasted row can therefore produce SQL INSERT output instead of a misleading "no data rows" response. When enabled, a header-only input produces an actionable error and a link to a working example.
- Repository is public, MIT-licensed by user choice, and offline deployment takes precedence over GitHub Pages.

## Known limitations and potential improvements

- Automatic detection cannot know if `New York, NY` represents one value or two. Use the source override.
- SQL input recognition is for simple literal lists/IN clauses; complex expressions, nested data, NULL semantics and other SQL fragments are outside scope.
- Type inference intentionally is not automatic. Structured JSON output preserves values as strings.
- CSV with irregular quoting or nonstandard dialects may need correction/override.
- SQL INSERT supports one statement, with the SQL Server 1,000-VALUES-row limit guarded. No schema inspection or bulk upload.
- Case conversion is basic; full locale-aware title-casing is not included.
- More customization (prefix/suffix templates, transformation chains, named presets, column mapping, SQL `NULL`, safe numeric JSON typing) can be explored **if actual usage justifies it**.
- Opening as `file://` can have browser-specific clipboard restrictions, so the manual Ctrl+C fallback must remain available.
- There is no service worker, installation, automatic updating, cross-device sync, or global keyboard shortcut.

## Manual acceptance checks

1. Paste `Apple` on one line and `Banana` on the next; choose Double-quoted → `"Apple", "Banana"`.
2. Paste `"Apple", "Banana"`; choose One per line → two plain lines.
3. Paste `'O''Brien', 'Smith'`; choose SQL IN · text → `IN ('O''Brien', 'Smith')`.
4. Paste `00123` and `00456`; choose JSON array → strings retaining leading zeros. SQL IN · numbers must not strip them either (consider text output for identifiers).
5. Paste `Name<TAB>State<NEWLINE>Alice<TAB>NY`; choose JSON objects with headers enabled → `[ {"Name":"Alice","State":"NY"} ]`.
6. Paste a CSV record with a quoted comma and escaped double quote; verify the parsed contents remain correct in JSON.
7. Paste invalid numeric text; choose SQL IN · numbers → visible validation error.
8. Paste duplicate rows with extra whitespace; test Trim and Remove duplicates.
9. Try Copy in local Chrome/Edge; if blocked, select the output and use Ctrl+C.
10. Disconnect Wi-Fi and load `index.html`; all features must work without network or external resource requests.
11. Manually edit output; verify copying retains the edit, and changing a transformation regenerates output.
12. Verify the page never writes source data to storage or sends it over the network.

## Repository structure

```text
clipboard-data-transformer/
├── index.html
├── README.md
├── LICENSE
├── .gitignore
├── AGENTS.md
├── docs/
│   ├── DESIGN_DECISIONS.md
│   ├── USER_GUIDE.md
│   └── ROADMAP.md
└── tests/
    ├── test-cases.json
    └── run-tests.cjs
```

The app itself always remains one file. Other files are for GitHub users, maintainers, coding agents, and safe synthetic regression tests. MIT permits commercial redistribution; that tradeoff was explicitly accepted in exchange for frictionless sharing and forks. Online access through GitHub Pages can be enabled later, but is not necessary for offline use.
