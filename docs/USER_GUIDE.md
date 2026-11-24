# User guide

## Getting started

Open `index.html` directly in a desktop browser. Paste text into Input; choose a format under **Choose an output format**; review the result in Output; click **Copy output**. You do **not** need to identify the input format beforehand. Automatic detection is convenient, not infallible: check the line below Input and use the **Auto detect** menu to override an incorrect guess. Your input is never sent to a server by the app.

## Examples

### Quoted values to plain lines

Input:

```text
"Apple", "Banana", "Cherry"
```

Choose **One per line**. Output:

```text
Apple
Banana
Cherry
```

### Plain lines to SQL IN

Input:

```text
00123
00456
```

Choose **SQL IN · text**. Output:

```sql
IN ('00123', '00456')
```

Use the numeric SQL variant only when numbers are intended; identifiers often have meaningful leading zeros.

### Excel to SQL INSERT — include a header row

Copy three columns and three rows from Excel (tabs between columns):

```text
ID	Name	State
101	Alice	NY
102	Bob	NJ
```

Choose **SQL INSERT**, check **First row contains headers**, and set SQL table to `Employees`. The SQL Server dialect generates:

```sql
INSERT INTO [Employees] ([ID], [Name], [State])
VALUES
  ('101', 'Alice', 'NY'),
  ('102', 'Bob', 'NJ');
```

**If you get “No data rows found”**, you likely checked **First row contains headers** but only pasted a single row. Uncheck the option, or include a header row plus at least one data row. Use the **Load SQL INSERT example** link in Format details for a known-good input. Pasting one column of plain values is valid too, but without a header the generated INSERT statement has no column list. Check your target table's column order.

### Excel to JSON objects

Use the same tab-separated table; choose **JSON objects** and check **First row contains headers**. The output is an array of objects with column names as keys. All values are strings, so identifiers and leading zeros are preserved.

### JSON to CSV

Paste a JSON array of flat objects, such as:

```json
[{"Name":"Alice","State":"NY"},{"Name":"Bob","State":"NJ"}]
```

Choose **CSV table**. The app uses object keys for the first row.

### Fix an ambiguous input

`New York, NY` could represent one item or two comma-separated items. Change the input override to **One per line** if it is a single value. The tool deliberately avoids guessing meaning beyond recognizable syntax.

## Cleanup controls

Trim whitespace, remove blank rows, deduplicate, sort, or change letter case. They modify the parsed values **before** output. If you manually edit Output, changing input/settings overwrites that manual edit with newly generated output.

## SQL and data safety

- SQL single quotes are escaped by doubling apostrophes (`O'Brien` → `'O''Brien'`).
- SQL INSERT emits **quoted text literals** rather than inferring numeric, date, or NULL types. Verify the result before executing it against a database.
- SQL Server INSERT with more than 1,000 VALUES rows is rejected; split into batches manually.
- Header names and table names must be simple identifier names (letters, numbers, underscores, not beginning with a number). Schema-qualified table names are allowed.
- Nested JSON structures and complex SQL statements are not supported. Nothing is executed against any database.

## Offline, clipboard, and sensitive data

All processing runs in the open browser tab. The file has no external scripts, fonts, analytics, backend or calls to network APIs. It does not persist pasted data to localStorage, cookies, or a database. Your browser or operating system may maintain clipboard history or other traces outside the app. Your employer's data handling policy governs whether particular information can be processed this way. If the browser blocks clipboard APIs, use **Ctrl+C** on selected output.
