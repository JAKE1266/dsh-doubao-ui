# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.1.0] - 2026-11-09

### Added

- A second **component layer** on top of the CSS skin, registered through
  official `ctx.slots.inject` / `ctx.slots.register`:
  - `sidebar.brand.mark` / `sidebar.brand.name`: an original inline-SVG
    conversation-bubble mark + the "豆包" name, shadowing the official brand
    occupant with `priority:-1`.
  - `conversation.hero.brand.mark`: large mark on the new-conversation page.
  - `conversation.hero.options`: four quick-action pills using the copy measured
    from the official HTML — `AI 搜索 / 帮我写作 / 图像生成 / 翻译`.
    ("深度思考" does not appear on the current site and was deliberately not used.)
  - `settings.section`: an About page documenting capabilities, provenance and
    rollback.
- `src/artwork.mjs`: original inline SVG asset. **No asset is copied from the
  Doubao client** — the mark is a self-drawn conversation bubble that only
  borrows the blue + rounded visual language.
- Multi-module bundler: `scripts/build.mjs` now inlines four source modules
  (`tokens` / `artwork` / `components` / `client`) into the single committed
  `client/client.js`, passing host seed modules (`react`, `react/jsx-runtime`)
  through to the factory's `require`.
- Component-layer CSS (`.db-*` namespace) with idempotent injection and
  `ctx.effect` teardown, matching the skin layer convention.
- `dsh.client.inject` now preloads the official `ui-sidebar`, `ui-conversation`,
  `ui-settings` and `ui-brand-official` packages so slot declarations are always
  in place before this plugin activates.
- Verification suite grew from 10 to **15 checks**, including slot declarations,
  `priority:-1`, quick-action copy, component-style teardown and React-missing
  degradation.

### Fixed

- **Potential white-screen bug caught by the new tests:** the component module
  originally called `require('react')` at top level. Because the loader does not
  isolate entry factories, a missing React seed would throw outside the
  `probeComponents` try/catch and take down the whole Web shell. React is now
  bound lazily via `bindReact(requireFn)` at activation time; failure degrades
  the entire component layer to an inert no-op while the CSS skin stays intact.

### Changed

- `exports.inject` (client service injection) now declares `['slots']`.
- `SKIN_VERSION` bumped to `1.1.0` (observable on `<html data-dsh-doubao-skin>`).
- README rewritten around the two-layer architecture; added an English
  "What's new" section and expanded the conflict FAQ.

## [1.0.0] - 2026-11-08

### Added

- Initial release: a pure CSS-token skin for DeepSeek Harness Web.
- **200 semantic tokens** covering light and dark themes, with enforced key-set
  parity between the two palettes (`test/run-all.mjs` fails if a token is
  forgotten in dark mode).
- Color values derived from Doubao Web's shipped CSS bundle (measured): the
  `#0057FF` S-layer brand primary plus the `#0066FF` DBX/DBD fill blue, the
  `#F3F4F6` neutral ramp, dark three-tier backgrounds `#121317` / `#191C1F` /
  `#1E2123`, brand lifted to `#547CFF` in dark mode, functional colors, code /
  markdown fills, scrollbars and menus.
- Doubao geometry: 16px bubbles, 20px composer, 10px buttons, `9999px` pills,
  `--s-shadow-lv1/2/3` shadows, official font stack, `cubic-bezier` easings.
- Structural rules over measured host `data-*` anchors only: composer focus
  ring, brand-gradient send button, glassy shortcut pills, bubble radius,
  code-block radii. No CSS Module hash class names are targeted.
- `prefers-reduced-motion` support, zero-specificity font normalization,
  keyboard-only focus ring preserved.
- `<style data-plugin data-plugin-css>` injection following the DSH client
  plugin convention, owned by `ctx.effect` for clean teardown.
- Zero runtime and build dependencies; a 60-line bundler produces the committed
  `client/client.js`, so GitHub/npm installs need no `prepare` step.
- Self-contained verification suite (10 checks) and GitHub Actions CI.

### Design decisions

- Main brand primary is `#0057FF` (S layer, confirmed by the server-rendered HTML
  button), not `#0066FF`; both blues coexist in the official CSS and were not
  forcibly unified.
- Dark mode uses `body[data-ds-dark-theme]` — verified from the source of the
  installed and running `dsh-zcode-ui`, not assumed from a `data-theme`
  attribute (which DSH does not have).
- Font baseline is 15px, a compromise between DSH's 14px and Doubao's 16px, to
  avoid overflowing host sidebars and toolbars.
- Bubble rules unify radius only; they do not guess message roles, so the AI
  answer area is never accidentally recolored.

See [docs/DESIGN.md](docs/DESIGN.md) for the full provenance table.
