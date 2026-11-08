# 发布到 GitHub / npm

> 本文件记录「从本地仓库到公开可用」的完整步骤。当前状态见文末「当前进度」。

## 0. 当前进度（2026-11-08）

| 项 | 状态 |
| --- | --- |
| Git 仓库 | ✅ 已初始化，`main` 分支，2 个提交，工作树干净 |
| Remote | ✅ 已配置 `https://github.com/JAKE1266/dsh-doubao-ui.git` |
| 构建产物 | ✅ `client/client.js` 已提交，重建无差异 |
| 验证 | ✅ `node test/run-all.mjs` 10/10 通过 |
| CI 配置 | ✅ `.github/workflows/ci.yml` 已提交 |
| GitHub 仓库 | ⛔ **尚未创建**（API 返回 404） |
| 推送凭据 | ⛔ **本机没有**（无 `GITHUB_TOKEN`/`GH_TOKEN`、无 credential helper、未装 `gh` CLI） |

**结论**：代码已 100% 就绪，只差「创建远端仓库 + 认证推送」这一步，需要你本人完成或授权。

---

## 1. 创建 GitHub 仓库（二选一）

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
- CI 会自动跑（`.github/workflows/ci.yml`）：重建 → 校验产物无差异 → 10 项验证
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
