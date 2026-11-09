# 发布到 GitHub / npm

> 本文件记录「从本地仓库到公开可用」的完整步骤。当前状态见文末「当前进度」。

## 0. 当前进度（2026-11-09 更新）

| 项 | 状态 |
| --- | --- |
| Git 仓库 | ✅ `main` 分支，工作树干净 |
| Remote | ✅ `https://github.com/JAKE1266/dsh-doubao-ui.git` |
| GitHub 仓库 | ✅ **已发布** <https://github.com/JAKE1266/dsh-doubao-ui>（Public） |
| 推送 | ✅ `main` 已推送；CI 运行 `completed/success` |
| 仓库元数据 | ✅ 描述、homepage、7 个 topics（`dsh-plugin`/`deepseek-harness`/`doubao`/`theme`/`skin`/`css-variables`/`dsh`） |
| 构建产物 | ✅ `client/client.js` 已提交，重建无差异 |
| 验证 | ✅ `node test/run-all.mjs` **19/19** 通过 |
| 当前版本 | **1.1.1**（修复组件层静默失效 + 版本漂移） |
| npm 发布 | ⛔ 尚未发布（非必需，GitHub 安装已够用） |

## 0.1 版本三处一致（硬性要求）

| 位置 | 说明 |
| --- | --- |
| `package.json` → `version` | npm / 插件市场读取 |
| `src/tokens.mjs` → `SKIN_VERSION` | 注入 `<html data-dsh-doubao-skin>`，用于排查浏览器里挂着的旧样式 |
| `client/client.js` | 构建产物内嵌值；必须与上面一致（否则说明忘了重建） |

`test/run-all.mjs` 会同时校验这三处 + `CHANGELOG.md` 是否有对应条目。
**这条校验是补上的** —— v1.1.1 的修复提交曾经在 `package.json` 仍是 `1.1.0`
的情况下推送出去，版本漂移没有测试拦着。

**推送方式备忘（本机）**：Windows 凭据管理器里存着 `GitHub - https://api.github.com/JAKE1266` 的 OAuth token（`gho_` 前缀，权限 `repo, user, workflow`，凭据 blob 是 **ASCII** 编码，不是 Unicode）。可以用一次性带 token 的 URL 推送，token 不写入任何文件：

```powershell
$env:GIT_TERMINAL_PROMPT = "0"
git push "https://JAKE1266:${env:GITHUB_TOKEN}@github.com/JAKE1266/dsh-doubao-ui.git" main
```

---

## 1. 创建 GitHub 仓库（已完成，此节留作重建/迁移参考）

> 仓库已于 2026-11-09 创建并发布。若需要迁移到另一个账号或重建，按下面二选一。

### A. 网页（最简单）

1. 打开 <https://github.com/new>
2. Repository name 填 `dsh-doubao-ui`
3. Description 可填：`豆包风格皮肤 for DeepSeek Harness Web · Doubao-inspired skin for DSH Web`
4. 选 **Public**，**不要**勾选 "Add a README file" / ".gitignore" / "license"（本地已有，勾了会冲突）
5. 点 **Create repository**

### B. 用 Personal Access Token（可全自动）

1. <https://github.com/settings/tokens/new> → 生成 **classic** token，勾选 `repo` scope（私有仓库也够用；若要自动建仓库需额外 `public_repo` 或 admin 权限）
2. 复制 token（只显示一次），在本机 PowerShell 里：

```powershell
$env:GITHUB_TOKEN = "ghp_你的token"
# 创建空仓库
$body = @{ name="dsh-doubao-ui"; description="豆包风格皮肤 for DeepSeek Harness Web"; private=$false; has_issues=$true; has_wiki=$false } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "https://api.github.com/user/repos" `
  -Headers @{ Authorization="Bearer $env:GITHUB_TOKEN"; "User-Agent"="dsh-agent"; Accept="application/vnd.github+json" } `
  -ContentType "application/json" -Body $body
```

> ⚠️ 不要把 token 写进任何文件、不要提交、不要发到聊天里给我看。只放在当前 PowerShell 会话的环境变量中。

## 2. 推送

```powershell
Set-Location "C:\Users\lenovo\Documents\deepseek-harness\default-workspace\dsh-doubao-ui"

# 方式 1：把 token 嵌进本次推送的 URL（不写入 .git/config，用完即弃）
git push "https://JAKE1266:${env:GITHUB_TOKEN}@github.com/JAKE1266/dsh-doubao-ui.git" main

# 方式 2：配置本机 git 凭据后正常推送
git config --global credential.helper manager
git push -u origin main        # 首次会弹浏览器让你登录 GitHub
```

推送成功后：

- 仓库地址 <https://github.com/JAKE1266/dsh-doubao-ui>
- CI 会自动跑（`.github/workflows/ci.yml`）：重建 → 校验产物无差异 → **19 项验证**
- 别人即可用 `dsh plugin --profile desktop add github:JAKE1266/dsh-doubao-ui` 安装

## 3. 发布到 npm（可选，让安装命令更短）

```powershell
Set-Location "C:\Users\lenovo\Documents\deepseek-harness\default-workspace\dsh-doubao-ui"

npm login                 # 按提示登录 npmjs.com
npm publish --access public
```

`prepublishOnly` 会自动执行 `build` + `test`，产物不干净会直接拒绝发布。

发布后安装命令变成：

```bash
dsh plugin --profile desktop add dsh-doubao-ui
```

### 发版检查清单

- [ ] `node scripts/build.mjs && node test/run-all.mjs` 全绿
- [ ] `git status --porcelain` 为空（产物已重新提交）
- [ ] `CHANGELOG.md` 已更新版本号与日期
- [ ] `package.json` 的 `version` 已递增
- [ ] `README.md` / `README.en.md` 的安装命令与仓库地址正确
- [ ] 若有视觉改动，补 `assets/screenshot-light.png` / `screenshot-dark.png`（别带真实工作区数据）

## 4. 让别人也能装上（README 里的安装段）

```bash
# GitHub（无需 npm 账号）
dsh plugin --profile desktop add github:JAKE1266/dsh-doubao-ui

# npm（发布后）
dsh plugin --profile desktop add dsh-doubao-ui
```

## 5. 回滚 / 卸载（给使用者）

```bash
dsh plugin --profile desktop disable dsh-doubao-ui   # 停用，硬刷新即恢复官方界面
dsh plugin --profile desktop remove dsh-doubao-ui    # 卸载
```
