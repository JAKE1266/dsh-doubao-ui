# Contributing

Thanks for taking the time. This plugin is deliberately small; the main rule is
**don't make it depend on anything**.

## Setup

```bash
git clone https://github.com/JAKE1266/dsh-doubao-ui.git
cd dsh-doubao-ui
node scripts/build.mjs
node test/run-all.mjs
```

No `npm install`. The project has zero dependencies and the built artifact
`client/client.js` is committed, so a fresh clone is ready to install as a DSH
plugin immediately.

## The one workflow rule

`src/tokens.mjs` and `src/client.mjs` are the **source**. `client/client.js` is
**generated**. After any change to `src/`, always run:

```bash
node scripts/build.mjs && node test/run-all.mjs
```

CI rejects a PR where the committed `client/client.js` differs from a fresh
build, so never edit the generated file by hand.

## Changing colors

Everything lives in `src/tokens.mjs`:

| Want to change | Edit |
| --- | --- |
| Brand primary | `LIGHT['--dsw-alias-brand-primary']` + `DARK[...]`, plus the `--db-*` private vars |
| Page / sidebar / card backgrounds | `--dsw-alias-bg-*` |
| Text and borders | `--dsw-alias-label-*` / `--dsw-alias-border-*` |
| Radii, shadows, font sizes | `STRUCTURAL` |
| Composer / pill / bubble shape | `STRUCTURE_CSS` |

**Hard requirement:** the light and dark palettes must have **identical key
sets**. `test/run-all.mjs` enforces this. If you add a token to `LIGHT`, add the
dark-mode value to `DARK` too — this is the guard that prevents a half-migrated
dark theme.

If you introduce a value measured from the Doubao Web CSS bundle, add its source
token name to `docs/DESIGN.md` and label it 实测 (measured). If you adapted it
for DSH, label it 推导 (derived). Please keep that distinction honest; it is the
main reason the design doc is useful.

## Rules for selectors

1. **Never target a DSH CSS Module hash class name.** Those change on every
   upstream build. Use `:root`, `body`, or a `data-*` anchor.
2. Only use anchors listed as measured in `docs/DESIGN.md` §7. If you need a new
   one, verify it exists in the host first (scan `app.asar` or check the live
   DOM) and document the evidence.
3. Keep structural rules minimal. Prefer a token override over an element rule:
   a token changes every consumer at once and cannot break on an upstream
   refactor.
4. Do not override `:focus-visible` outlines. DSH uses
   `--dsw-focus-ring-color` to implement keyboard-only rings; overriding the
   outline directly is an accessibility regression.
5. Never guess message roles (user vs AI). `data-message-bubble` is not known to
   carry a role discriminator. Rules that assume one will damage the AI answer
   area.

## Safety

The DSH client loader does not isolate entry factories: one throwing factory can
aggregate into "entries did not activate" and white-screen the whole Web shell.
Therefore:

- Keep every initialization path inside `try`.
- Any missing host capability must degrade to an inert module, not throw.
- `ctx.effect` must always return a teardown function that removes the style
  tag and restores `<html>` attributes.

## Tests

Add a check to `test/run-all.mjs` for any new invariant. The suite must stay
dependency-free (only `node:assert`, `node:fs`, `node:path`, `node:vm`).

## Commit / PR

- Describe what changed and why in the CHANGELOG under `Unreleased`.
- Run `node test/run-all.mjs` locally; CI runs the same command.
- Screenshots of light and dark mode are very welcome for visual changes.
