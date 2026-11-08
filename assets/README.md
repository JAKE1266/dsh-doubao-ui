# Assets

This directory is reserved for **optional preview screenshots** of the skin.

The plugin itself ships **no images, icons or fonts** — every visual is expressed
as a CSS custom property in [`src/tokens.mjs`](../src/tokens.mjs). That is a
deliberate compliance decision: no asset is copied from the Doubao client.

To add your own screenshots after installing and activating the skin:

```bash
# light
assets/screenshot-light.png
# dark  (switch the host theme in Settings → Appearance, then re-capture)
assets/screenshot-dark.png
```

Then reference them from the top of [`README.md`](../README.md):

```markdown
![浅色主题](assets/screenshot-light.png)
![深色主题](assets/screenshot-dark.png)
```

Please do not commit screenshots containing real workspace names, session
titles, balances or any other personal data — use a throwaway workspace.
