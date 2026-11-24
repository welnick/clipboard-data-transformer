# Clipboard Data Transformer

A free, small, privacy-first formatting utility for people working with spreadsheets, SQL, and text. Paste values or a table, choose the output format, and copy the result.

**No install. No server. No account. No data uploads.** The entire application is one self-contained HTML file.

## Use it offline

1. Download [`index.html`](index.html).
2. Open it in a modern browser (Chrome or Edge recommended).
3. Paste data into **Input**.
4. Choose a **format card**, review **Output**, and select **Copy output**.

The app runs without an internet connection. If clipboard access is restricted, select the output and use **Ctrl+C**.

## Quick examples

**Quoted list → one value per line**

Input: `"Apple", "Banana", "Cherry"` → choose **One per line**.

**IDs → SQL IN clause**

Input (one value per line):

```text
00123
00456
00789
```

Choose **SQL IN · text** to retain the leading zeroes.

**Excel table → SQL INSERT**

Copy a rectangular selection from Excel, including the header row:

```text
ID	Name	State
101	Alice	NY
102	Bob	NJ
```

Choose **SQL INSERT**, check **First row contains headers**, and set the SQL table name. If your paste has *only data rows*, leave the header checkbox unchecked. The **How to use** panel has a working example you can load in one click.

## Supported formats

- Lines, comma-separated, tab-separated, single- and double-quoted lists
- SQL IN text and numeric literals, SQL VALUES, SQL INSERT
- JSON arrays, arrays of flat objects, CSV tables, Markdown tables
- Trim, remove blank rows, deduplicate, sort, and change case
- Automatic source detection plus a manual interpretation override

**Important:** SQL INSERT defaults to quoted text literals, not inferred database types. Verify syntax and types for your destination table before executing SQL. This is a formatter, not a database client.

## Privacy

The app has no external dependencies, does not send network requests, and does not store input/output in browser storage. Its local processing is not a substitute for organizational approval to handle sensitive data. Device monitoring, browser extensions, operating-system clipboard history, and employer requirements remain relevant.

## Project files

- `index.html` — complete standalone application
- `docs/USER_GUIDE.md` — examples, troubleshooting, limitations
- `docs/DESIGN_DECISIONS.md` — rationale and scope
- `docs/ROADMAP.md` — proposed improvements
- `tests/test-cases.json` — synthetic regression fixtures
- `AGENTS.md` — coding agent instructions

## Contributing

Issues, feedback, and pull requests are welcome. Keep the offline, dependency-free architecture. Never commit real student, patient, employee, or other sensitive data; use synthetic test fixtures.

## License

MIT. See [LICENSE](LICENSE).
