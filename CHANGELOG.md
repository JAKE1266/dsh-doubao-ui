# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
