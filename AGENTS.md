# Coding agent instructions

- Maintain `index.html` as a **fully self-contained** offline application (inline HTML/CSS/JavaScript, no imports, no bundler required).
- Do not add fetch, XHR, sockets, third-party scripts, styles, fonts, analytics, cookies, clipboard watchers, or storage of user-pasted data.
- Preserve identifiers and leading zeros; never silently coerce arbitrary input into numbers, dates, or SQL NULL.
- Every parser change should include synthetic edge-case test fixtures in `tests/test-cases.json`.
- Make input detection reversible/overridable; surface errors instead of silently dropping values.
- Avoid dangerously inserting clipboard contents into HTML; use `textContent` or form values.
- Keep the input/output UI clear and approachable. Output format examples and in-app SQL INSERT guidance are core UX, not optional embellishments.
- Test direct `file://` operation and manual copy fallback. Do not assume network connectivity or ability to install software.
- Never put real student names, patient data, customer IDs, production credentials, or other sensitive data in commits, examples, logs, or screenshots.
