# dsh-doubao-ui

**给 [DeepSeek Harness](https://www.deepseek.com/harness/) Web 换一套豆包风格皮肤。**

> 皮肤为纯 CSS 令牌覆盖，仓库内不含任何图片素材。安装启用后欢迎按 [`assets/README.md`](assets/README.md) 的说明补一张亮/暗对比截图。

> [!IMPORTANT]
> **这是一个个人维护的非官方第三方插件。** 它不是字节跳动 / 豆包的产品，也不是 DeepSeek AI 的产品，没有得到任何一方的授权或背书。「豆包」「DeepSeek」等名称归各自权利人所有，此处仅用于说明视觉灵感的来源与兼容性。
>
> 本插件**只改界面颜色与几何**，不改模型、不改会话数据、不联网、不注册工具。

---

## 它做什么

| 方面 | 皮肤做了什么 |
| --- | --- |
| **配色** | 豆包蓝主色 + 中性灰面，覆盖 DSH 全部 `--dsw-alias-*` / `--dsw-static-*` 语义令牌（背景、文字、边框、品牌、按钮、菜单、状态色、代码块、滚动条…） |
| **明暗主题** | 跟随宿主主题设置（`body[data-ds-dark-theme]`），亮/暗两套完整色板，切换即时生效 |
| **几何** | 大圆角：气泡 20px、卡片/输入框 16–20px、按钮与快捷胶囊 999px，偏软的浮起阴影 |
| **输入框** | 豆包式大圆角输入卡 + focus 蓝色柔光环 + 发送键品牌渐变 |
| **快捷胶囊** | 「深度思考 / 联网搜索」等入口变成圆角药丸，hover 与选中态走品牌色 |
| **排版** | 15px 字号基线、CJK 无衬线字体栈前置，代码块/引用块统一圆角 |
| **字体归一** | 裸 button/input/select/textarea 跟随皮肤字体（零特异性 `:where()`，不覆盖任何插件的有意设定） |
| **可访问性** | 尊重 `prefers-reduced-motion`；不破坏 DSH 的「仅键盘显示焦点环」逻辑 |

### 与已有 `dsh-theme-doubao` 的关系

社区已有一个 [zdz6215591/dsh-theme-doubao](https://github.com/zdz6215591/dsh-theme-doubao)，它把**侧栏品牌图标 + 新会话页的豆包人物 / 点阵鲸鱼**换掉，做得很好，但**不改配色**。

本插件是互补的另一半：**全站配色 + 几何皮肤**，不替换任何 React 组件、不注入任何 DOM 节点、不带任何图片素材。两个插件可以同时安装，互不冲突（一个走插槽，一个走 CSS 变量）。

---

## 为什么是「纯 CSS 令牌覆盖」

DSH Web 的整站视觉由 `--dsw-alias-*` 变量在 `body` 上驱动，所有官方组件只消费这些变量。因此在**变量层**替换，就能在不触碰任何业务组件的前提下换掉全站外观。这带来几个很实在的好处：

- **零依赖**：没有 React、没有构建框架、没有运行时依赖，`npm install` 都不需要（`dsh.client.inject` 里那一个包名只是**模块图装载顺序前置声明**，不是 npm 依赖）。
- **升级友好**：不依赖宿主的 CSS Module 哈希类名（那些名字每次上游构建都会变）。所有选择器走 `:root` / `body` / `data-*` 稳定锚点。
- **停用即恢复**：样式由 `ctx.effect` 管理生命周期，停用或卸载插件后官方界面完整恢复。
- **不会白屏**：加载器不隔离 entry 工厂，一个工厂抛异常会带崩整个 Web 壳。本插件所有初始化都包在 try 里，任何一步失败都静默降级成「隐形的哑模块」。

选择器特异性也做了处理：官方主题插件用 `body` / `body[data-ds-dark-theme]` / `html[data-platform=darwin] body` 三档下发调色板，这里统一用 `:root:root` 前缀把亮/暗分别抬到 `(0,2,1)` / `(0,3,1)`，确定性胜出，不依赖样式表加载顺序。

---

## 安装

### 从 npm（发布后可用）

```bash
dsh plugin --profile desktop add dsh-doubao-ui
```

> 把 `desktop` 换成你实际运行 DSH Web 的 profile 名（可用 `dsh --profile desktop --dump-config` 确认）。

### 从 GitHub

```bash
dsh plugin --profile desktop add github:JAKE1266/dsh-doubao-ui
```

`client/client.js` 已随仓库提交，且本包**没有 `prepare` 脚本**，所以安装过程不会触发任何编译。

### 从本地源码

```powershell
git clone https://github.com/JAKE1266/dsh-doubao-ui.git
Set-Location .\dsh-doubao-ui
node scripts/build.mjs
node test/run-all.mjs
dsh plugin --profile desktop add link:<本目录绝对路径>
```

### 让智能体帮你装

把下面这段发给任何能执行终端命令的智能体：

```text
请把 DSH 插件 dsh-doubao-ui 装进我本地的 desktop profile：
dsh plugin --profile desktop add github:JAKE1266/dsh-doubao-ui
然后运行 dsh --profile desktop --dump-config，确认配置里出现 dsh-doubao-ui，
并告诉我怎么重载 DSH、怎么确认皮肤已生效。
```

### 生效

1. **重启 DSH Web**（新增 profile bundle 需要重启加载器）。
2. 在浏览器里硬刷新（`Ctrl+Shift+R` / `Cmd+Shift+R`）。
3. 打开 DevTools，若 `<html>` 上出现 `data-dsh-doubao-skin="1.0.0"`，且 `<head>` 里有 `<style data-plugin="dsh-doubao-ui" data-plugin-css="dsh-doubao-ui/skin.css">`，即表示皮肤已激活。

### 停用 / 卸载

```bash
# 停用（保留包，随时可再启用）
dsh plugin --profile desktop disable dsh-doubao-ui

# 卸载
dsh plugin --profile desktop remove dsh-doubao-ui
```

停用/卸载后硬刷新一次，官方界面即恢复，无需手工清理配置或样式。

---

## 改颜色

所有设计值集中在 [`src/tokens.mjs`](src/tokens.mjs)：

| 想改什么 | 改哪里 |
| --- | --- |
| 品牌主色 | `LIGHT['--dsw-alias-brand-primary']`、`DARK[...]`，以及 `--db-primary` / `--db-primary-hover` / `--db-primary-soft` |
| 页面/侧栏/卡片底色 | `--dsw-alias-bg-base`、`--dsw-alias-bg-layer-*` |
| 文字与边框 | `--dsw-alias-label-*`、`--dsw-alias-border-*` |
| 圆角 / 阴影 / 字号 | `STRUCTURAL` 里的 `--dsw-radius-*`、`--dsw-shadow-*`、`--dsw-font-size-*` |
| 输入框与胶囊形态 | `STRUCTURE_CSS` |
| 用户气泡底色 | `--dsw-specific-bubble`、`--db-user-bubble` |

改完必须重新构建（产物 `client/client.js` 随仓库提交）：

```bash
node scripts/build.mjs
node test/run-all.mjs
```

> `test/run-all.mjs` 会强制校验**亮/暗两套令牌的键集合完全一致**——这是防止「深色模式漏改某个变量」最有效的一道闸。

### 关于色值来源

本皮肤是 **inspired-by 再设计**，不是官方设计资产的逐像素复刻：

- 品牌色、中性色阶、圆角与输入框几何参照豆包 Web 公开界面的**实测 CSS 设计令牌**（`--s-color-brand-primary-default` / `--dbx-*` / `--dbd-*` 三层），并按 DSH 的 `--dsw-alias-*` 语义重新映射；
- 部分中间态、透明度、阴影为面向 WCAG 对比度与 DSH 宿主语义的**适配值**，并非官方逐值照搬；
- 本仓库**不包含**任何来自豆包客户端的图片、图标、字体或受版权保护的素材。

详见 [`docs/DESIGN.md`](docs/DESIGN.md) 的完整令牌映射表与来源标注（实测 / 推导）。

---

## 验证

```bash
node test/run-all.mjs
```

零依赖的自包含套件，覆盖：产物语法与工厂注册契约、CSS 双主题块与结构令牌、亮/暗键集合一致性、样式注入幂等与卸载回收、`apply` 在任何宿主异常下都不抛错、manifest 自洽。CI 在 push / PR 上跑同一套。

---

## 目录

```
client/client.js      构建产物（安装时真正被加载的文件）
src/tokens.mjs        全部设计令牌（唯一需要改的文件）
src/client.mjs        浏览器半：样式注入、宿主锚点标记、生命周期
lib/index.mjs         Host 半：空的 Loader 座位
scripts/build.mjs     零依赖打包器（src → client/client.js）
test/run-all.mjs      零依赖验证套件
cordis.patch.yml      profile bundle 挂载声明
docs/DESIGN.md        设计令牌映射与来源
.github/workflows/    CI
```

## 常见问题

**装完界面没变化？** 先确认装的 profile 就是正在运行 DSH Web 的那个，然后**重启 DSH Web** 并硬刷新浏览器。`dsh --profile desktop --dump-config` 的输出里应该能看到 `dsh-doubao-ui`。

**会不会动我的会话、工作区或文件？** 不会。本插件只写一张 `<style>` 到 `<head>`，并在少数宿主元素上加 `data-doubao-*` 标记属性；不读写任何文件、不发起网络请求、不注册任何工具或服务。

**能和别的皮肤插件一起用吗？** 与走插槽的品牌类插件（如 `dsh-theme-doubao`）可以共存。但**两个都改 `--dsw-*` 令牌的皮肤会互相覆盖**（后加载者胜出），因此不建议与 `dsh-zcode-ui` 之类的全站换肤插件同时启用。

**和 `dsh-zcode-ui` 冲突吗？** 会（两者都改令牌）。请只启用其中一个；另一个停用即可，硬刷新后生效。

---

## License

[MIT](LICENSE) — 代码部分。设计灵感与名称归各自权利人所有。
