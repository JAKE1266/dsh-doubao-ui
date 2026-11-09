# Assets

本目录用于存放**可选的预览截图**。插件本身**不含任何图片素材** —— 所有视觉都
由 [`src/tokens.mjs`](../src/tokens.mjs) 的 CSS 自定义属性表达，品牌标记是
[`src/artwork.mjs`](../src/artwork.mjs) 里的原创内联 SVG。没有任何素材取自厂商客户端。

## 为什么仓库里还没有截图

DSH Web 的根路径返回 **401**（需要登录会话），headless 浏览器拿不到会话，
因此无法在 CI 或脚本里自动截图。截图必须在**已登录的真实界面**里手动完成。

## 手动截图步骤

1. 启用皮肤（同时只能启用一个换肤插件）：

   ```bash
   dsh plugin --profile desktop disable dsh-doubao-ui   # 若有其他皮肤先停用
   dsh plugin --profile desktop add github:JAKE1266/dsh-doubao-ui
   ```

2. **重启 DSH Web**，浏览器硬刷新（`Ctrl+Shift+R`）。
3. 确认生效：DevTools 里 `<html>` 应有 `data-dsh-doubao-skin="1.1.1"`，
   `<head>` 里应有两张 `<style data-plugin="dsh-doubao-ui" ...>`。
4. 新建一个**空白工作区**（避免截图里出现真实项目名 / 会话标题 / 余额）。
5. 截两张图：
   - 亮色：`assets/screenshot-light.png`
   - 暗色：设置 → 外观 → 切到暗色，再截 `assets/screenshot-dark.png`
6. 在 [`README.md`](../README.md) 顶部引用：

   ```markdown
   ![浅色主题](assets/screenshot-light.png)
   ![深色主题](assets/screenshot-dark.png)
   ```

## 可选：脚本截图

`scripts/screenshot.mjs` 用本机 Edge 的 headless 模式截图。**只有当你能提供
带鉴权的 URL 时才可用**：

```powershell
$env:DSH_URL = "http://127.0.0.1:50459/?token=<你的token>"
node scripts/screenshot.mjs            # 亮色
node scripts/screenshot.mjs --dark     # 暗色
```

若页面需要登录会话而 headless 拿不到，脚本会超时退出并提示改用手动方式。

## 注意事项

- **不要**提交含真实工作区名、会话标题、余额或其他个人数据的截图。
- 建议用 1440×900 或 1280×800，能同时看清侧栏与输入框。
- 截图前把窗口缩放到常规尺寸，避免截到调试面板。
