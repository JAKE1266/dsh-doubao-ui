# 设计规格与来源

> 本文件是 `src/tokens.mjs` 的「为什么」。每一行色值的出处都可以在这里查到。
> 严格区分 **实测**（从豆包官方产物中读到）与 **推导**（为适配 DSH 语义所做的判断）。

## 0. 一句话结论

豆包 Web 官方 CSS 里 **三层令牌并存**，是历史演进叠加，本皮肤未强行统一：

| 层 | 命名空间 | 主色 | 用途 |
| --- | --- | --- | --- |
| S（Semi Design 血脉） | `--s-*` | `#0057FF` | 页面级品牌、背景、文字、边框、阴影 |
| DBX（新通用层） | `--dbx-*` | `#0066FF`（`#06f`） | 组件填充、hover、侧栏、气泡 |
| DBD（设计系统层） | `--dbd-*` | `#0066FF` | 空间、圆角、字阶、静态色阶、功能色 |

本皮肤**主色取 `#0057FF`**（S 层 `brand-primary-default`，且服务端 HTML 内联按钮实测就是它），把 `#0066FF` 作为次级/填充色（`button-info-fill` / `label-primary-bluish` / 渐变终点）。

## 1. 实测来源

| # | 来源 | 内容 |
| --- | --- | --- |
| A | `https://www.doubao.com/chat/`（301,183 B HTML） | meta 描述、内联 `#0057ff` 按钮（`100×38 / radius 10px / white / 14px`）、CSS bundle 链接、UI 文案计数 |
| B | `https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/chat/static/css/chat.73c59e003d.css`（500,439 B） | **全部令牌值**：1867 个自定义属性、6011 条规则、light/dark 两套主题块、渐变、几何、字阶、阴影、动效 |
| C | 本机 `app.asar`（213,202,918 B，字符串扫描） | DSH 侧 434 个 `--dsw-*` 令牌名、818 个 `data-*` 锚点名 |
| D | 本机 `dsh-zcode-ui@2.3.7` 源码（`lib/client.js`，已安装运行） | 确认 DSH 客户端插件的令牌覆盖机制、`:root:root` 特异性写法、`body[data-ds-dark-theme]` 暗色信号、`ctx.effect` 生命周期 |
| E | `zdz6215591/dsh-theme-doubao` 源码（GitHub Contents API） | 确认 `<style data-plugin data-plugin-css>` 注入约定、`slots.inject` 用法、CSS Module 哈希类名不可依赖 |

**失败 / 绕过的来源**：`web_search` 返回 401；`raw.githubusercontent.com` 与 `cdn.jsdelivr.net` 返回 502 / 连接关闭（GitHub 文件改走 `api.github.com/repos/<owner>/<repo>/contents/<path>` + base64 解码成功）；`doubao.com/` 跨域重定向（改用 `www.doubao.com/chat/`）。

**明确不可作依据的第三方克隆**：`Yjppj/doubao-ai-chat` 用 Tailwind 蓝 `#3B82F6`、`#f5f5f5` 背景，与官方 `#0057FF` 不符，仅作组件形态佐证，未采用其任何色值。`diana-doubao-theme` 的 228px 侧栏是覆盖值，非官方 280px，亦未采用。

## 2. 主色 / 品牌（实测）

### S 层
| 键 | light | dark |
| --- | --- | --- |
| `--s-color-brand-primary-default` | `#0057ff` | `#547cff` |
| `--s-color-brand-primary-hover` | `#004ad9` | `#4769d9` |
| `--s-color-brand-primary-pressed` | `#003db3` | `#3b57b3` |
| `--s-color-brand-primary-disable` | `rgba(0,87,255,.3)` | — |
| `--s-color-brand-primary-transparent-1/2/3` | `rgba(0,87,255,.06/.1/.15)` | `rgba(84,124,255,.12/.16/.2)` |

### DBX 层（节选）
`--dbx-brand-default:#06f`；`--dbx-fill-highlight:#06f` / dark `#378dff`；`--dbx-fill-highlight-hover:#4d8eff` / dark `#006ce0`；`--dbx-fill-highlight-trans-10:#0066ff0f` / dark `#ffffff12`；`--dbx-function-info:#0065fd` / dark `#378dff`；`--dbx-function-info-hover:#006ce0` / dark `#4d8eff`；`--dbx-line-highlight:#06f3` / dark `#77b0ff80`。

### 渐变（实测，逐字）
```
--s-color-ai-line:    linear-gradient(301deg,#75a4ff 23.93%,#0057ff 92.76%)
--s-color-ai-solid:   radial-gradient(125.81% 83.73% at 21.13% 50%,#0057ff 0%,#5a91fc 81.94%)
用户气泡：--dbd-theme-bubble-top #3888ff → --dbd-theme-bubble-bottom #06f（暗 #579aff → #3385ff），文字 #fff
```

## 3. 中性色（实测）

### light
```
--s-color-bg-primary #fff / --s-color-bg-secondary #f9fafb / --s-color-bg-tertiary #f3f4f6
--s-color-bg-quaternary #ebecef / --s-color-bg-base #f3f4f6 / --s-color-bg-body #fff
--s-color-bg-content-base #f9fafb / --s-color-bg-float #fff / --s-color-bg-disable #d9d9d9
--s-color-text-primary #000 / secondary rgba(0,0,0,.85) / tertiary rgba(0,0,0,.5)
--s-color-text-quaternary rgba(0,0,0,.3) / disable rgba(0,0,0,.15)
--s-color-border-primary rgba(0,0,0,.2) / secondary rgba(0,0,0,.12)
--s-color-border-tertiary rgba(0,0,0,.08) / quaternary rgba(0,0,0,.04) / card #ebebeb
--dbx-bg-base-web #f9f9f9 / --dbx-bg-base-2 #f4f4f4 / --dbx-bg-float #fff
--dbx-fill-chat-bubble-bg #f4f4f4 / -bg2 #e6f0ff
--dbx-line-7 #00000012 / -10 #0000001a / -15 #00000026 / divider-5 #0000000d
--dbx-fill-trans-10 #00000005 / -10-hover #0000000a / -20 #0000000a / -30 #0000000f
```

### dark
```
--s-color-bg-primary #232629 / secondary #191c1f / tertiary #121317 / quaternary #0c0c0e
--s-color-bg-base #121317 / --s-color-bg-body #191c1f / --s-color-bg-content-base #1e2123
--s-color-bg-float #181818 / --s-color-bg-disable #444749
--s-color-text-primary #fff / tertiary rgba(255,255,255,.55) / quaternary rgba(255,255,255,.35)
--s-color-border-primary hsla(0,0%,100%,.24) / secondary .16 / tertiary .12 / quaternary .08
--s-color-border-card #35373a
--dbx-bg-base-web #0f0f0f / --dbx-bg-base-2 #1a1a1a / --dbx-bg-float #181818
--dbx-fill-chat-bubble-bg #181818 / -bg2 #153453
--dbx-fill-trans-10-hover #ffffff14 / -20 #ffffff1a / -30-hover #ffffff24
--dbd-bg-subtle-1..5 = #000,#141414,#1f1f1f,#252525,#383838
```

功能色：`--dbx-function-danger #ff3b30` / dark `#ff453a`，`--dbx-function-success #34c759`，`--dbx-function-warning #ff9500` / dark `#ff9f0a`。

## 4. 几何（实测）

```
--content-max-width 900px      --sidebar-width 280px       --artifact-header-height 60px
--input-guidance-input-container-radius 20px / min-height 140px / max-height 360px / padding 12px
  / editor-min-height 56px / bottom-height 36px / border 1px solid rgba(0,0,0,.12)
--g-send-msg-bubble-radius 1rem (16px)；padding-x 12px / padding-y 16px
--dbd-radius-xs 4 / sm 6 / md 8 / lg 10 / xl 12 / 2xl 14 / full 9999px
--s-radius-xxs 4 / xxss 8 / xs 10 / s 12 / m 16 / l 20 / xl 24 / xxl 32
--dbd-space-1/2/4/8/12/16px
断点 xs 462 / sm 640 / md 868 / lg 1440px
```

阴影（实测）：`--s-shadow-lv1: 0 1px 2px rgba(0,0,0,.05), 0 0 1px rgba(0,0,0,.15)`，`lv2: 0 6px 10px rgba(0,0,0,.08), 0 0 1px rgba(0,0,0,.15)`，`lv3: 0 10px 20px rgba(0,0,0,.1), 0 0 1px rgba(0,0,0,.15)`；`--dbx-drop-shadow-lg: 0 2px 4px #00000005, 0 4px 16px #0000000a, 0 8px 32px #00000014`。

动效（实测）：`cubic-bezier(.2,0,0,1)` / `cubic-bezier(0,0,.2,1)` / `cubic-bezier(.4,0,.2,1)`；时长 `.1s / .15s / .2s / .3s / .4s`。

字体（实测）：`system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Helvetica,"Noto Sans",...,sans-serif`；S 层字阶 `base 400 16/24`、`small 400 14/22`、`pcbody 400 13/20`、`xs 400 12/18`。

## 5. 组件形态（实测 + 推导，逐项标注）

| 项 | 结论 | 来源 |
| --- | --- | --- |
| 用户气泡 | 官方 CSS 同时存在 3 种表示：默认 `#0000000a` 浅灰底 + `rgba(0,0,0,.85)` 字；「coco」`#06f` 蓝底白字；主题渐变 `#3888ff→#06f` 白字。三者共同：圆角 16px、padding 12/16px | **实测** |
| 用户气泡右对齐 | 官方 CSS 无显式 align token，由 `.g-send-msg-*` 命名与界面形态判定 | **推导** |
| AI 回答 | 官方 CSS 中**找不到** AI 回答专用背景令牌 → 无独立气泡底色、平铺、左对齐 | 无 token 为实测；形态为 **推导** |
| 输入框 | 卡片式，20px 圆角、白底、1px `rgba(0,0,0,.12)` 边框、min-height 140px、editor 56px、底部工具条 36px | **实测** |
| 快捷胶囊 | 官方用 `--capsule-bg` / `--capsule-hover-bg` / `--capsule-text` 等**运行时变量**（无静态字面值），配合半透明叠层 + 内描边；选中态 `#0066ff0f` 底 + `#0066ff66` 边 + `#06f` 字 | 变量与选中态为 **实测**；高 32–36px / 9999px 圆角为 **推导** |
| 快捷文案 | 服务端 HTML 实测：`AI 搜索`×2、`帮我写作`×3、`图像生成`×3、`翻译`×5；**`深度思考` = 0 次**，`联网搜索` = 0 次 | **实测** |
| 侧栏 | 宽 280px、padding 12px；会话项文字 `#000`、hover `#0000000a`、选中 `#0066ff0f`；折叠 `width .2s` | 令牌与动效 **实测**；归因到侧栏为 **推导** |
| 顶栏 | 高 60px、底边 1px | **实测** |

## 6. 豆包 → DSH 令牌映射（**设计建议，属推导**）

两套系统语义不同，不存在一一对应。下表是本皮肤采用的映射，右侧色值本身全部为实测：

| DSH alias | 采用值（light） | 实测来源 |
| --- | --- | --- |
| `--dsw-alias-brand-primary` / `brand-text` / `button-primary-fill` | `#0057FF` | `--s-color-brand-primary-default` / HTML 内联按钮 |
| `--dsw-alias-button-primary-hover` | `#004AD9` | `--s-color-brand-primary-hover` |
| `--dsw-alias-button-info-fill` / `-hover` | `#0065FD` / `#006CE0` | `--dbx-function-info*` |
| `--dsw-alias-label-primary-bluish` | `#0066FF` | `--dbd-theme-root` |
| `--dsw-alias-bg-base` / `bg-l1` / `bg-layer-1` | `#FFFFFF` | `--s-color-bg-body` |
| `--dsw-alias-bg-l2` / `bg-layer-2` | `#F9FAFB` | `--s-color-bg-secondary` |
| `--dsw-alias-bg-layer-3` / `-4` | `#F3F4F6` / `#EBECEF` | `--s-color-bg-tertiary` / `-quaternary` |
| `--dsw-alias-border-l1/l2/l3/l4` | `.2/.12/.08/.04` | `--s-color-border-*` |
| `--dsw-alias-label-primary/secondary/tertiary/quaternary` | `#000` / `.85` / `.5` / `.3` | `--s-color-text-*` |
| `--dsw-alias-interactive-bg-hover` | `#0000000A` | `--dbx-fill-trans-10-hover` |
| `--dsw-alias-interactive-bg-active` | `#0066FF0F` | `--dbx-fill-highlight-trans-10` |
| `--dsw-alias-markdown-code-block` / `-banner` | `#F4F4F4` / `#E6F0FF` | `--dbx-fill-chat-bubble-bg` / `-bg2` |
| `--dsw-alias-state-{success,error,warn}-primary` | `#34C759` / `#FF3B30` / `#FF9500` | `--dbx-function-*` |
| `--dsw-focus-ring-color` | `#0057FF` | 主色 |
| `--dsw-radius-full` | `9999px` | `--dbd-radius-full` |
| `--dsw-shadow-lv1/lv2/lv3` | lv1/lv2/lv3 原式 | `--s-shadow-lv1/2/3` |

### 关于 `--dsw-specific-*` 与静态色阶（重要）

从 `dsh-client-ui-theme/lib/client.js` 的 `body{}` / `body[data-ds-dark-theme]{}` 定义可见，DSH 的 alias **大量回落**到 `--dsw-static-neutral-bluish-*` 静态色阶（例如 `--dsw-alias-bg-base: var(--dsw-static-neutral-bluish-00)`，dark 为 `-950`）。因此只改 alias 不改 static 时，少数直接读 static 的组件不会跟着变。本皮肤**两层一起覆盖**（200 个语义令牌含 21 个静态阶 + 113 个 alias + 若干 specific/结构变量），与已运行的 `dsh-zcode-ui`（178 alias + 23 结构）同一策略。

另有一组官方组件专用变量 `--dsw-specific-*`，其中侧栏专用项必须一并覆盖，否则侧栏会残留官方蓝：

```
--dsw-specific-sidebar-fill                  → 亮 #F9F9F9 / 暗 #0F0F0F（--dbx-bg-base-web，实测）
--dsw-specific-sidebar-nav-item-active      → 亮 #0066FF0F / 暗 #FFFFFF12（实测）
--dsw-specific-sidebar-nav-item-active-accent → 亮 #0057FF / 暗 #547CFF（实测）
--dsw-specific-bubble / -highlight          → 用户气泡 / 高亮
--dsw-specific-input-major / -login-input   → 输入壳
--dsw-specific-menu / --dsw-menu-surface-fill → 菜单浮层
```

官方暗色信号也在此确认：`dsh-client-ui-theme/lib/index.js` 的 boot 首帧脚本写 `document.body.toggleAttribute('data-ds-dark-theme', dark)`，并定义 `LIGHT_BACKGROUND = "#fff"` / `DARK_BACKGROUND = "#151517"`。这正是本皮肤用 `body[data-ds-dark-theme]` 作为暗色选择器、且用 `:root:root` 提特异性的原因。

**本皮肤为适配 DSH 而做的额外判断（推导）**：
- 字号基线取 **15px** 折中（DSH 默认 14px、豆包正文 16px）。直接上 16px 会让 DSH 按 14px 排版的侧栏与工具栏溢出。
- mask 三档透明度取 `.2/.4/.6`（官方 `--dbx-bg-mask` 为 `#0003` / `#0009`，light/dark 归因未逐一确认）。
- 阴影在 `--dsw-shadow-lv1-blur` 上做了弱化，避免 DSH 密集面板叠加过重。
- 暗色 `--dsw-static-neutral-bluish-*` 阶梯按官方 dark 三级底 + DBD 静态阶重新排布。

## 7. 宿主锚点（实测存在，来自 app.asar 字符串扫描）

本皮肤 `STRUCTURE_CSS` 只使用下列**实测确认存在**的 `data-*` 锚点，绝不依赖 CSS Module 哈希类名：

```
data-composer-card          data-composer-chip        data-composer-chip-selected
data-composer-command       data-message-bubble       data-conversation-scroll
data-code-block-banner      data-phase                data-code-block-content
data-composer-input         data-input-trigger        data-sidebar-chat
```

**重要否定结论（实测）**：DSH 二进制里**没有** `data-theme` / `data-color-mode` / `data-dark` / `data-appearance` / `data-scheme`。因此 `:root[data-theme=dark]` 在 DSH 上不生效（那是豆包自己的机制）。本皮肤使用 **D 来源确认的 `body[data-ds-dark-theme]`** 作为暗色信号 —— 这是正在运行的 `dsh-zcode-ui` 源码中实际使用的写法，比字符串扫描更可靠。

**未在实时 DOM 验证的项**：各锚点的嵌套层级、`data-message-bubble` 是否同时覆盖用户与 AI 气泡。因此本皮肤**只对气泡统一圆角**，不猜测角色、不改底色与对齐 —— 猜错会伤到 AI 回答区。

## 8. 合规与声明

- 本皮肤是 **inspired-by 再设计**，不是官方设计资产的逐像素复刻。
- 本仓库**不含**任何来自豆包客户端的图片、图标、字体或其他受版权保护的素材；全部交付物为 CSS 变量声明与纯文本规则。
- 「豆包」「DeepSeek」「DeepSeek Harness」「ZCode」等名称归各自权利人所有，此处仅用于说明视觉灵感来源与兼容性。
- 本插件与字节跳动 / 豆包、深度求索 / DeepSeek 无任何隶属、授权或背书关系。
