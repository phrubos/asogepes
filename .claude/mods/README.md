# Claude Code mods for this project

- `asogepes-qa`: status line (branch, commits not yet on `main`, dev server on :3000, last layout-check), `/ellenoriz` (tsc + layout-check + type-check + clip-check on the dev server, in the background), `/mehet` (fast-forward `main` to the working branch, push, switch back), and a reminder under the answer when a CSS module changed without a layout-check after it.
- `asogepes-elotte-utana`: `/elotte-utana` toggles a pane; while it is on, every `*.module.css` edit is measured on the dev server before and after (gutter, size, gap above/below, margin, padding at 390 and 1440 px; screenshots in `node_modules/.cache/elotte-utana`, opened by the pane's buttons). Uses `scripts/qa/snap.js`.

Load them in a session with `claude --plugin-dir .claude/mods/asogepes-qa --plugin-dir .claude/mods/asogepes-elotte-utana`.
