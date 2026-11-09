# dsh-doubao-ui

**给 [DeepSeek Harness](https://www.deepseek.com/harness/) Web 换一套豆包风格皮肤。**

> 皮肤为纯 CSS 令牌覆盖 + 声明式插槽注入，仓库内不含任何图片素材。安装启用后欢迎按 [`assets/README.md`](assets/README.md) 的说明补一张亮/暗对比截图。

> [!IMPORTANT]
> **这是一个个人维护的非官方第三方插件。** 它不是字节跳动 / 豆包的产品，也不是 DeepSeek AI 的产品，没有得到任何一方的授权或背书。「豆包」「DeepSeek」等名称归各自权利人所有，此处仅用于说明视觉灵感的来源与兼容性。
>
> 本插件**只改界面**：不碰模型、不碰会话数据、不联网、不注册工具、不读写文件。

---

## 它做什么

v1.1.0 起是**两层架构**：

### 第一层 · 皮肤（纯 CSS 令牌覆盖）

| 方面 | 皮肤做了什么 |
| --- | --- |
| **配色** | 豆包蓝主色 + 中性灰面，覆盖 DSH 全部 `--dsw-alias-*` / `--dsw-static-*` / `--dsw-specific-*` 语义令牌（背景、文字、边框、品牌、按钮、菜单、状态色、代码块、滚动条…） |
| **明暗主题** | 跟随宿主主题设置（`body[data-ds-dark-theme]`），亮/暗两套完整色板，切换即时生效 |
| **几何** | 大圆角：气泡 16px、卡片/输入框 20px、按钮 10px、快捷胶囊 9999px，偏软的浮起阴影 |
| **输入框** | 豆包式大圆角输入卡 + focus 蓝色柔光环 + 发送键品牌渐变 |
| **快捷胶囊** | 「AI 搜索 / 帮我写作 / 图像生成 / 翻译」变成圆角药丸，hover 与选中态走品牌色 |
| **排版** | 15px 字号基线、官方字体栈、CJK 回退族前置，代码块/引用块统一圆角 |
| **字体归一** | 裸 button/input/select/textarea 跟随皮肤字体（零特异性 `:where()`，不覆盖任何插件的有意设定） |
| **可访问性** | 尊重 `prefers-reduced-motion`；不破坏 DSH 的「仅键盘显示焦点环」逻辑 |

### 第二层 · 组件（声明式 React 插槽）

| 插槽 | 贡献 |
| --- | --- |
| `sidebar.brand.mark` / `sidebar.brand.name` | 自创对话气泡标记 + 「豆包」名称（`priority:-1` 盖掉官方品牌占位） |
| `conversation.hero.brand.mark` | 新会话首页的大号标记 |
| `conversation.hero.options` | 4 个快捷入口胶囊，文案取自官方 HTML 实测（「AI 搜索」，**不是**「深度思考」） |
| `settings.section` | 「关于」页：能力边界、来源声明、回滚方式 |

> 图标是**本项目原创绘制的内联 SVG**（一个交叠对话气泡），只借用「蓝 + 圆润」的视觉语言，**没有复制任何豆包素材**。

### 与已有 `dsh-theme-doubao` 的关系

社区已有一个 [zdz6215591/dsh-theme-doubao](https://github.com/zdz6215591/dsh-theme-doubao)，它把**侧栏品牌图标 + 新会话页的豆包人物 / 点阵鲸鱼**换掉，做得很好，但**不改配色**。

本插件是更完整的另一半：**全站配色 + 几何 + 品牌 + 快捷入口**。两个插件的侧栏品牌插槽会互相覆盖，因此**不建议同时启用**。

---

## 为什么主体是「CSS 变量覆盖」

DSH Web 的整站视觉由 `--dsw-alias-*` 变量在 `body` 上驱动，所有官方组件只消费这些变量。因此在**变量层**替换，就能在不触碰任何业务组件的前提下换掉全站外观。好处：

- **零依赖**：没有构建框架、没有运行时依赖，`npm install` 都不需要（`dsh.client.inject` 里那几个包名只是**模块图装载顺序前置声明**，不是 npm 依赖；React 由宿主种子模块提供）。
- **升级友好**：不依赖宿主的 CSS Module 哈希类名。所有选择器走 `:root` / `body` / 实测 `data-*` 稳定锚点。
- **停用即恢复**：样式与组件注册都由 `ctx.effect` 管理生命周期，停用或卸载后官方界面完整恢复。
- **不会白屏**：加载器不隔离 entry 工厂，一个工厂抛异常会带崩整个 Web 壳。本插件所有初始化都包在 try 里；**组件层连模块顶层都不调用 `require('react')`**（改成惰性绑定），React 缺失时整体降级为纯 CSS 皮肤。

选择器特异性：官方主题插件用 `body` / `body[data-ds-dark-theme]` / `html[data-platform=darwin] body` 三档下发调色板，这里统一用 `:root:root` 前缀把亮/暗分别抬到 `(0,2,1)` / `(0,3,1)`，确定性胜出。

---

## 安装

### 从 GitHub（推荐）

```bash
dsh plugin --profile desktop add github:JAKE1266/dsh-doubao-ui
```

`client/client.js` 已随仓库提交，且本包**没有 `prepare` 脚本**，所以安装过程不会触发任何编译。

> 把 `desktop` 换成你实际运行 DSH Web 的 profile 名（可用 `dsh --profile desktop --dump-config` 确认）。

### 从 npm（发布后可用）

```bash
dsh plugin --profile desktop add dsh-doubao-ui
```

### 从本地源码

```powershell
git clone https://github.com/JAKE1266/dsh-doubao-ui.git
Set-Location .\dsh-doubao-ui
node scripts/build.mjs
node test/run-all.mjs
dsh plugin --profile desktop add link:<本目录绝对路径>
```

### 生效

1. **重启 DSH Web**（新增 profile bundle 需要重启加载器）。
2. 在浏览器里硬刷新（`Ctrl+Shift+R` / `Cmd+Shift+R`）。
3. 打开 DevTools，若 `<html>` 上出现 `data-dsh-doubao-skin="1.1.0"`，且 `<head>` 里有 `<style data-plugin="dsh-doubao-ui" data-plugin-css="dsh-doubao-ui/skin.css">` 与 `.../components.css"`，即表示两层都已激活。

### 停用 / 卸载

```bash
dsh plugin --profile desktop disable dsh-doubao-ui   # 停用（保留包）
dsh plugin --profile desktop remove dsh-doubao-ui    # 卸载
```

停用/卸载后硬刷新一次，官方界面即恢复，无需手工清理配置或样式。

---

## 改颜色 / 改组件

所有设计值集中在 [`src/tokens.mjs`](src/tokens.mjs)，组件在 [`src/components.mjs`](src/components.mjs)：

| 想改什么 | 改哪里 |
| --- | --- |
| 品牌主色 | `LIGHT/DARK['--dsw-alias-brand-primary']` 及 `--db-*` 私有变量 |
| 页面/侧栏/卡片底色 | `--dsw-alias-bg-*` |
| 圆角 / 阴影 / 字号 | `STRUCTURAL` |
| 输入框与胶囊形态 | `STRUCTURE_CSS` |
| 快捷入口文案与预置提示词 | `QUICK_ACTIONS` |
| 品牌图标 | `src/artwork.mjs` 的 `MARK_SVG` |
| 组件样式 | `COMPONENT_CSS` |

改完必须重新构建（产物随仓库提交）：

```bash
node scripts/build.mjs
node test/run-all.mjs
```

> `test/run-all.mjs` 会强制校验**亮/暗两套令牌的键集合完全一致**，以及 **React 缺失时组件层能整体降级** —— 后者是防止白屏最关键的一道闸。

### 关于色值来源

本皮肤是 **inspired-by 再设计**，不是官方设计资产的逐像素复刻：

- 品牌色、中性色阶、圆角与输入框几何参照豆包 Web 公开界面的**实测 CSS 设计令牌**（`--s-*` / `--dbx-*` / `--dbd-*` 三层），并按 DSH 的 `--dsw-alias-*` 语义重新映射；
- 部分中间态、透明度、阴影为面向 WCAG 对比度与 DSH 宿主语义的**适配值**；
- 本仓库**不包含**任何来自豆包客户端的图片、图标、字体或受版权保护的素材。

详见 [`docs/DESIGN.md`](docs/DESIGN.md) 的完整令牌映射表与来源标注（实测 / 推导）。

---

## 验证

```bash
node test/run-all.mjs
```

零依赖的自包含套件，**15 项检查**，覆盖：产物语法与工厂注册契约、4 个模块内联、CSS 双主题块与结构令牌、亮/暗键集合一致性（208 个令牌）、样式注入幂等与卸载回收、`apply` 在任何宿主异常下都不抛错、组件层插槽声明与 React 缺失降级、组件样式回收、manifest 自洽。CI 在 push / PR 上跑同一套。

---

## 目录

```
client/client.js      构建产物（安装时真正被加载的文件）
src/tokens.mjs        全部设计令牌（唯一需要改的配色文件）
src/client.mjs        浏览器半：样式注入、表面标记、组件层接线、容错降级
src/components.mjs    React 组件层：品牌 / 首页快捷入口 / 关于页 / 组件 CSS
src/artwork.mjs       原创内联 SVG 标记
lib/index.mjs         Host 半：空的 Loader 座位
scripts/build.mjs     零依赖多模块打包器（src → client/client.js）
test/run-all.mjs      零依赖验证套件
cordis.patch.yml      profile bundle 挂载声明
docs/DESIGN.md        设计令牌映射与来源
docs/PUBLISHING.md    GitHub / npm 发布指引
.github/workflows/    CI
```

## 常见问题

**装完界面没变化？** 先确认装的 profile 就是正在运行 DSH Web 的那个，然后**重启 DSH Web** 并硬刷新浏览器。`dsh --profile desktop --dump-config` 的输出里应该能看到 `dsh-doubao-ui`。

**会不会动我的会话、工作区或文件？** 不会。本插件只写两张 `<style>` 到 `<head>`、在少数宿主元素上加 `data-doubao-*` 标记属性、注册几个界面插槽组件；不读写任何文件、不发起网络请求、不注册任何工具或服务。

**和别的皮肤冲突吗？** 两个都改 `--dsw-*` 令牌的皮肤会互相覆盖（后加载者胜出），因此**不建议与 `dsh-zcode-ui`、`dsh-wechat-ui` 等全站换肤插件同时启用**。停用其中一个即可，硬刷新后生效。与走插槽的品牌类插件（如 `dsh-theme-doubao`）也会争抢侧栏品牌插槽，同样建议二选一。

**图标是豆包官方的吗？** 不是。是本项目原创绘制的对话气泡 SVG，见 `src/artwork.mjs`。

---

## License

[MIT](LICENSE) — 代码部分。设计灵感与名称归各自权利人所有。
