# Roadmap

The tool is intentionally small and offline-first. Only prioritize features that reduce real user friction.

## Release checklist

- [x] Standalone, no-dependency HTML application
- [x] Clear, focused side-by-side input/output layout
- [x] Local processing messaging (without a misleading green online-status dot)
- [x] Help panel and concrete SQL INSERT example
- [x] Automatic detection with manual override
- [x] SQL / JSON / CSV / tabular and list output options
- [ ] Browser-based automated end-to-end regression test runner
- [ ] Accessibility review with keyboard and screen reader
- [ ] Real-world trial with synthetic data across Chrome and Edge

## Consider after real usage

- Custom prefix / suffix / separator templates
- Download formatted results as files
- Column selection/mapping for wide input tables
- SQL INSERT batch output, optional typed literals, explicit NULL handling
- User-chosen favorite format cards, saved **settings only** (never pasted data)
- GitHub Pages online availability using the same HTML file

## Out of scope

AI integration, servers, sign-ins, telemetry, clipboard history, global hotkeys, auto-updating installer.
