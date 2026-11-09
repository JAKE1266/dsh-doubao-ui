/**
 * dsh-doubao-ui — 豆包风格主题令牌
 *
 * 这一层是皮肤的全部「设计值」。DSH Web 的所有官方区域（标题栏、侧栏、会话列、
 * 按钮、菜单、输入框、气泡、代码块）都只消费 `--dsw-alias-*` / `--dsw-static-*`
 * 变量。在变量层替换，等于在不触碰任何业务组件的前提下换掉全站外观 ——
 * 这也是本插件零依赖、不碰会话数据、不注册任何工具的原因。
 *
 * 明暗判定：DSH 用 `body[data-ds-dark-theme]` 表达暗色（宿主自身的主题设置）。
 * 这一点从本机已安装并运行的 dsh-zcode-ui 源码中直接确认（其 zcode-skin.ts
 * 与 zcode-theme.ts 均以该属性为唯一主题信号），比字符串扫描更可靠。
 * 选择器优先级：官方主题插件用 body / body[data-ds-dark-theme] /
 * html[data-platform=darwin] body 三档下发调色板，特异性递增；这里统一用
 * `:root:root` 前缀把亮/暗分别抬到 (0,2,1)/(0,3,1)，确定性胜出。
 *
 * ── 色值来源（严格区分实测 / 推导）────────────────────────────────────────
 * 【实测】主色、中性面、文字/边框透明度、功能色、圆角几何、阴影、字体栈、
 *   渐变、用户气泡渐变，全部来自豆包 Web 官方 CSS bundle：
 *   https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/chat/static/css/chat.73c59e003d.css
 *   （500,439 B，含 1867 个自定义属性、light/dark 两套主题块）
 *   以及 https://www.doubao.com/chat/ 的服务端 HTML（内联 `#0057ff` 按钮）。
 *   官方三套令牌并存，未强行统一：
 *     --s-color-brand-primary-default  #0057ff  （S 层，页面级主品牌，本皮肤主色）
 *     --dbx-brand-default             #0066ff  （DBX 层，组件填充）
 *     --dbd-theme-root                #0066ff  （DBD 层，设计系统主题色）
 * 【实测】DSH 侧 434 个 --dsw-* 令牌名来自本机 app.asar 字符串扫描。
 * 【推导】豆包令牌 → DSH alias 的**对应关系**是设计建议（两套系统语义不同，
 *   不存在一一对应）；部分中间态、mask 透明度、阴影在 DSH 语境下做了适配；
 *   字号基线取 15px 折中（DSH 默认 14px、豆包正文 16px），避免宿主布局溢出。
 * 【声明】本皮肤是 inspired-by 再设计，不是官方资产的逐像素复刻；本仓库不含
 *   任何来自豆包客户端的图片、图标或字体。商标与名称归各自权利人所有，
 *   本插件与字节跳动 / 豆包、DeepSeek 无任何隶属或背书关系。
 *
 * 完整映射表与逐项来源标注见 docs/DESIGN.md。
 */

/** 皮肤版本：改动令牌口径时递增，便于排查浏览器里挂着的旧样式。 */
export const SKIN_VERSION = '1.2.0'

/** 标记属性，注入到 <html> 上，便于在 DevTools 里确认皮肤已激活。 */
export const SKIN_ATTRIBUTE = 'data-dsh-doubao-skin'

/** 样式标签的稳定标识（去重 + 卸载时回收）。 */
export const STYLE_TAG_ID = 'dsh-doubao-ui/skin.css'

/** 亮色令牌选择器：特异性 (0,2,1)。 */
export const LIGHT_SELECTOR = ':root:root body'

/** 暗色令牌选择器：特异性 (0,3,1)。 */
export const DARK_SELECTOR = ':root:root body[data-ds-dark-theme]'

/**
 * 与主题无关的几何/排版令牌 —— 全部为豆包官方 CSS 实测值。
 *
 * 圆角刻度（--s-radius-* / --dbx-radius-* / --dbd-radius-* 三套，取合集）：
 *   4 / 8 / 10 / 12 / 16 / 20 / 24 / 9999px
 * 输入框容器 20px、气泡 16px、按钮 10px、内容区 900px、侧栏 280px、顶栏 60px。
 * 阴影取 --s-shadow-lv1/lv2/lv3 与 --dbx-drop-shadow-lg 实测值。
 */
export const STRUCTURAL = Object.freeze({
  '--dsw-radius-xs': '4px',
  '--dsw-radius-sm': '8px',
  '--dsw-radius-md': '12px',
  '--dsw-radius-lg': '16px',
  '--dsw-radius-xl': '20px',
  '--dsw-radius-panel': '20px',
  '--dsw-radius-2xl': '24px',
  '--dsw-radius-full': '9999px',
  '--dsw-shadow-lv1': '0 1px 2px rgba(0,0,0,.05), 0 0 1px rgba(0,0,0,.15)',
  '--dsw-shadow-lv1-blur': '0 2px 4px rgba(0,0,0,.02), 0 4px 10px rgba(0,0,0,.02)',
  '--dsw-shadow-lv2': '0 6px 10px rgba(0,0,0,.08), 0 0 1px rgba(0,0,0,.15)',
  '--dsw-shadow-lv3': '0 10px 20px rgba(0,0,0,.1), 0 0 1px rgba(0,0,0,.15)',
  '--dsw-elevation-soft': '0 1px 2px rgba(0,0,0,.05), 0 0 1px rgba(0,0,0,.15)',
  '--dsw-elevation-panel': '0 6px 10px rgba(0,0,0,.08), 0 0 1px rgba(0,0,0,.15)',
  '--dsw-elevation-prominent': '0 10px 20px rgba(0,0,0,.1), 0 0 1px rgba(0,0,0,.15)',
  '--dsw-elevation-stroke-color': 'rgba(0,0,0,.12)',
  '--dsw-corner-shape': '16px',
  // 官方字体栈（--dbx-font-sans-serif / --s-font-family），CJK 回退族前置以适配中文界面。
  '--dsw-font-family':
    'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, "Noto Sans", "PingFang SC", "Microsoft YaHei UI", "Microsoft YaHei", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
  '--dsh-font-family-code-default':
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  // 字号基线取 15px 折中：DSH 默认 14px、豆包 --s-font-base 为 16px/24px。
  // 直接用 16px 会让 DSH 按 14px 排版的侧栏与工具栏溢出，故取中间值（推导）。
  '--dsw-font-size-base': '15px',
  '--dsw-font-size-display': 'calc(var(--dsw-font-size-base) + 20px)',
  '--dsw-font-size-headline': 'calc(var(--dsw-font-size-base) + 8px)',
  '--dsw-font-size-title': 'calc(var(--dsw-font-size-base) + 6px)',
  '--dsw-font-size-xl': 'calc(var(--dsw-font-size-base) + 4px)',
  '--dsw-font-size-lg': 'calc(var(--dsw-font-size-base) + 2px)',
  '--dsw-font-size-caption': 'calc(var(--dsw-font-size-base) - 1px)',
  '--dsw-font-size-sm': 'calc(var(--dsw-font-size-base) - 2px)',
  '--dsw-font-size-xs': 'calc(var(--dsw-font-size-base) - 4px)',
  '--dsw-font-size-2xs': 'calc(var(--dsw-font-size-base) - 5px)',
  '--dsh-scrollbar-width': '7px',
  '--dsh-scrollbar-thumb-border': '2px',
  '--dsw-focus-ring-width': '2px',
  // 豆包私有语义变量：供 STRUCTURE_CSS 消费，也方便用户二次调色。
  // 全部为官方实测值（两套蓝并存，不强行统一）。
  '--db-primary': '#0057ff',
  '--db-primary-hover': '#004ad9',
  '--db-primary-active': '#003db3',
  '--db-primary-fill': '#0066ff',
  '--db-primary-soft': '#0066ff0f',
  '--db-primary-border': '#0066ff66',
  '--db-gradient': 'linear-gradient(301deg,#75a4ff 23.93%,#0057ff 92.76%)',
  '--db-gradient-button': 'radial-gradient(125.81% 83.73% at 21.13% 50%,#0057ff 0%,#5a91fc 81.94%)',
  '--db-bubble-gradient': 'linear-gradient(180deg,#3888ff 0%,#0066ff 100%)',
  '--db-user-bubble': '#0000000a',
  '--db-ai-fill': '#f4f4f4',
  '--db-ai-fill-blue': '#e6f0ff',
  '--db-composer-radius': '20px',
  '--db-composer-shadow': '0 2px 4px #00000005, 0 4px 16px #0000000a, 0 8px 32px #00000014',
  '--db-content-max-width': '900px',
  '--db-sidebar-width': '280px',
  '--db-ease': 'cubic-bezier(.2,0,0,1)',
  '--db-ease-out': 'cubic-bezier(0,0,.2,1)',
  '--db-dur': '.15s',
  '--db-dur-mid': '.2s',
})

/**
 * 亮色（豆包默认）色板。
 * 键集合必须与 DARK 完全一致 —— test/run-all.mjs 会强制校验，防止深色漏改。
 */
export const LIGHT = Object.freeze({
  // ── 静态中性阶梯（官方 --dbd-* 静态色阶，冷灰） ──
  '--dsw-static-neutral-bluish-950': '#FFFFFF',
  '--dsw-static-neutral-bluish-875': '#FAFAFB',
  '--dsw-static-neutral-bluish-850': '#F9FAFB',
  '--dsw-static-neutral-bluish-800': '#F3F4F6',
  '--dsw-static-neutral-bluish-750': '#EBECEF',
  '--dsw-static-neutral-bluish-700': '#D9D9D9',
  '--dsw-static-neutral-bluish-600': '#BABABA',
  '--dsw-static-neutral-bluish-500': '#999999',
  '--dsw-static-neutral-bluish-400': '#666666',
  '--dsw-static-neutral-bluish-300': '#4D4D4D',
  '--dsw-static-neutral-bluish-200': '#333333',
  '--dsw-static-neutral-bluish-150': '#EBECEF',
  '--dsw-static-neutral-bluish-100': '#D9D9D9',
  '--dsw-static-neutral-bluish-75': '#F3F4F6',
  '--dsw-static-neutral-bluish-60': '#F3F4F6',
  '--dsw-static-neutral-bluish-50': '#F9FAFB',
  '--dsw-static-neutral-bluish-00': '#000000',
  '--dsw-static-neutral-bluish-1000': '#000000',

  // ── 背景（--s-color-bg-* 实测） ──
  '--dsw-alias-bg-base': '#FFFFFF',
  '--dsw-alias-bg-layer-1': '#FFFFFF',
  '--dsw-alias-bg-layer-2': '#F9FAFB',
  '--dsw-alias-bg-layer-3': '#F3F4F6',
  '--dsw-alias-bg-layer-4': '#EBECEF',
  '--dsw-alias-bg-overlay': '#FFFFFF',
  '--dsw-alias-bg-module-platform': '#F9F9F9',
  '--dsw-alias-bg-multi-select': '#E6F0FF',
  '--dsw-alias-bg-l1': '#FFFFFF',
  '--dsw-alias-bg-l2': '#F9FAFB',
  '--dsw-alias-background-secondary': '#F9FAFB',
  '--dsw-alias-bg-document-preview': '#F9FAFB',
  '--dsw-alias-bg-document-selection': 'rgba(0,102,255,.2)',
  '--dsw-alias-bg-skeleton': '#F4F4F4',
  '--dsw-alias-bg-mask-1': 'rgba(0,0,0,.2)',
  '--dsw-alias-bg-mask-2': 'rgba(0,0,0,.4)',
  '--dsw-alias-bg-mask-3': 'rgba(0,0,0,.6)',
  '--dsw-alias-bg-mask-photo': 'rgba(0,0,0,.88)',
  '--dsw-alias-bg-mask-drop': 'rgba(255,255,255,.72)',

  // ── 边框（--s-color-border-* / --dbx-line-* 实测） ──
  '--dsw-alias-border-l1': 'rgba(0,0,0,.2)',
  '--dsw-alias-border-l2': 'rgba(0,0,0,.12)',
  '--dsw-alias-border-subtle': 'rgba(0,0,0,.12)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(0,0,0,.08)',
  '--dsw-alias-border-l3': 'rgba(0,0,0,.08)',
  '--dsw-alias-border-l4': 'rgba(0,0,0,.04)',
  '--dsw-alias-border-inverted': 'rgba(0,0,0,.04)',
  '--dsw-alias-border-inverted2': 'rgba(0,0,0,.12)',
  '--dsw-alias-separator-primary': '#0000000d',

  // ── 文字（--s-color-text-* 实测） ──
  '--dsw-alias-label-primary': '#000000',
  '--dsw-alias-label-primary-foreground': '#FFFFFF',
  '--dsw-alias-label-primary-inverted': '#FFFFFF',
  '--dsw-alias-label-primary-dimmed': 'rgba(0,0,0,.6)',
  '--dsw-alias-label-primary-bluish': '#0066FF',
  '--dsw-alias-label-secondary': 'rgba(0,0,0,.85)',
  '--dsw-alias-label-tertiary': 'rgba(0,0,0,.5)',
  '--dsw-alias-label-caption': 'rgba(0,0,0,.3)',
  '--dsw-alias-label-dimmed': 'rgba(0,0,0,.15)',
  '--dsw-alias-label-quaternary': 'rgba(0,0,0,.3)',
  '--dsw-alias-label-error': '#FF3B30',
  '--dsw-alias-label-shimmer': 'rgba(0,0,0,.28)',
  '--dsw-alias-label-document-preview': '#666666',
  '--dsw-alias-menu-icon': 'rgba(0,0,0,.85)',

  // ── 品牌 / 主色（两套蓝并存，实测） ──
  '--dsw-alias-brand-primary': '#0057FF',
  '--dsw-alias-brand-primary-invert': '#FFFFFF',
  '--dsw-alias-brand-text': '#0057FF',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': '#0057FF',
  '--dsw-alias-state-business-primary': '#0057FF',
  '--dsw-alias-state-business-tertiary': '#0066FF0F',
  '--dsw-alias-button-primary-fill': '#0057FF',
  '--dsw-alias-button-primary-hover': '#004AD9',
  '--dsw-alias-button-primary-dimmed': 'rgba(0,87,255,.3)',
  '--dsw-alias-button-contrast-fill': '#000000',
  '--dsw-alias-button-elevated-fill': '#FFFFFF',
  '--dsw-alias-button-floating-fill': '#FFFFFF',
  '--dsw-alias-button-floating-hover': '#F5F5F5',
  '--dsw-alias-button-ghost-active-fill': '#0066FF0F',
  '--dsw-alias-button-ghost-active-hover': '#0066FF1A',
  '--dsw-alias-button-ghost-active-border': '#0066FF66',
  '--dsw-alias-button-info-fill': '#0065FD',
  '--dsw-alias-button-info-hover': '#006CE0',
  '--dsw-alias-button-tool-bar-fill': 'rgba(0,0,0,.45)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(0,0,0,.32)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(0,0,0,.6)',

  // ── 交互态（--dbx-fill-trans-* / highlight-trans-10 实测） ──
  '--dsw-alias-interactive-bg-hover': '#0000000A',
  '--dsw-alias-interactive-bg-hover-solid': '#F4F4F4',
  '--dsw-alias-interactive-bg-active': '#0066FF0F',
  '--dsw-alias-interactive-bg-hover-accent': '#0066FF0F',
  '--dsw-alias-interactive-bg-hover-danger': '#FFECEB',
  '--dsw-alias-fill-l1': '#F4F4F4',
  '--dsw-alias-fill-l2': '#EBECEF',
  '--dsw-alias-fill-tertiary': '#F3F4F6',
  '--dsw-alias-fill-tsp-secondary': '#00000005',

  // ── 状态色（--dbx-function-* / --dbd-support-* 实测） ──
  '--dsw-static-green-500': '#34C759',
  '--dsw-static-green-400': '#34C759',
  '--dsw-static-green-100': '#E8F8E8',
  '--dsw-static-green-900': '#E8F8E8',
  '--dsw-static-green-500-a08': 'rgba(52,199,89,.08)',
  '--dsw-static-green-500-a12': 'rgba(52,199,89,.12)',
  '--dsw-static-red-600': '#FF3B30',
  '--dsw-static-red-500': '#FF3B30',
  '--dsw-static-red-400': '#FF3B30',
  '--dsw-static-red-100': '#FFECEB',
  '--dsw-static-red-900': '#FFECEB',
  '--dsw-static-red-400-a12': 'rgba(255,59,48,.12)',
  '--dsw-static-red-600-a08': 'rgba(255,59,48,.08)',
  '--dsw-static-amber-500': '#FF9500',
  '--dsw-static-amber-400': '#FF9500',
  '--dsw-static-amber-600': '#FF9500',
  '--dsw-static-amber-100': '#FFF3E6',
  '--dsw-static-amber-900': '#FFF3E6',
  '--dsw-alias-state-success-primary': '#34C759',
  '--dsw-alias-state-success-secondary': '#E8F8E8',
  '--dsw-alias-state-success-tertiary': '#E8F8E8',
  '--dsw-alias-state-error-primary': '#FF3B30',
  '--dsw-alias-state-error-secondary': '#FFECEB',
  '--dsw-alias-state-warn-primary': '#FF9500',
  '--dsw-alias-state-warning-primary': '#FF9500',
  '--dsw-alias-state-warn-secondary': '#FFF3E6',
  '--dsw-alias-state-warn-label': '#FF9500',
  '--dsw-alias-state-warn-tertiary': '#FFF3E6',
  '--dsw-alias-state-idle-primary': '#999999',

  // ── 蓝 / 链接（统一为豆包蓝，消除 DeepSeek 蓝残留） ──
  '--dsw-static-deepseek-500': '#0057FF',
  '--dsw-static-deepseek-450': '#0057FF',
  '--dsw-static-deepseek-400': '#0057FF',
  '--dsw-static-deepseek-600': '#004AD9',
  '--dsw-static-deepseek-800': 'rgba(0,87,255,.15)',
  '--dsw-static-deepseek-100': 'rgba(0,102,255,.06)',
  '--dsw-static-deepseek-50': 'rgba(0,102,255,.06)',
  '--dsw-static-deepseek-200': 'rgba(0,102,255,.1)',
  '--dsw-static-deepseek-300': 'rgba(0,102,255,.15)',
  '--dsw-alias-link': '#0057FF',
  '--dsw-alias-label-deep-diving': '#0066FF',
  '--dsw-alias-label-deep-diving-shimmer': 'rgba(0,102,255,.3)',
  '--dsw-static-blue-500': '#0066FF',
  '--dsw-static-blue-450': '#0065FD',
  '--dsw-static-blue-400': '#4D8EFF',
  '--dsw-static-blue-300': '#84B1FF',
  '--dsw-static-blue-100': '#EBF2FF',

  // ── Markdown / 代码（--dbx-fill-chat-bubble-* / --dbd-code-* 实测） ──
  '--dsw-alias-markdown-code-block': '#F4F4F4',
  '--dsw-alias-markdown-code-block-banner': '#E6F0FF',
  '--dsw-alias-markdown-inline-code': '#F3F4F6',
  '--dsw-alias-markdown-code-editor-bg': '#000000',
  '--dsw-alias-markdown-code-editor-fg': '#FFFFFF',
  '--dsw-alias-markdown-tag': '#EBECEF',
  '--dsw-alias-markdown-citation': '#E6F0FF',
  '--dsw-alias-markdown-placeholder': '#F9FAFB',
  '--dsw-alias-markdown-code-segment-selected': '#FFFFFF',
  '--dsw-alias-markdown-code-segment-unselected': '#F3F4F6',
  '--dsw-alias-turn-trigger-bg': '#F4F4F4',
  '--dsw-alias-turn-trigger-bg-hover': 'rgba(0,0,0,.04)',
  '--dsw-alias-code-diff-added': '#E8F8E8',
  '--dsw-alias-code-diff-deleted': '#FFECEB',
  '--dsw-alias-file-diff-added-bg': '#E8F8E8',
  '--dsw-alias-file-diff-added-gutter': '#E8F8E8',
  '--dsw-alias-file-diff-added-marker': '#2AA048',
  '--dsw-alias-file-diff-deleted-bg': '#FFECEB',
  '--dsw-alias-file-diff-deleted-gutter': '#FFECEB',
  '--dsw-alias-file-diff-deleted-marker': '#FF3B30',

  // ── 滚动条 / 浮层 / 表单 ──
  '--dsw-alias-scrollbar-bg-l1': '#0000001A',
  '--dsw-alias-scrollbar-bg-l2': '#0000001A',
  '--dsw-alias-scrollbar-hover-l1': '#00000080',
  '--dsw-alias-scrollbar-hover-l2': '#00000080',
  '--dsw-alias-toast-bg': '#181818',
  '--dsw-alias-toast-label': '#FFFFFF',
  '--dsw-alias-tooltip-bg': '#000000',
  '--dsw-alias-tooltip-label': '#FFFFFF',
  '--dsw-alias-tooltip-key-bg': '#333333',
  '--dsw-alias-menu-group-header-fill': '#F7F7F7',
  '--dsw-alias-switch-thumb': '#FFFFFF',
  '--dsw-alias-settings-card-fill': '#FFFFFF',
  '--dsw-alias-settings-card-stroke': '#EBEBEB',
  '--dsw-alias-onboarding-accent': '#0057FF',
  '--dsw-alias-onboarding-card-fill': '#FFFFFF',
  '--dsw-alias-onboarding-secondary-fill': '#F3F4F6',
  '--dsw-alias-onboarding-checkbox-border': 'rgba(0,0,0,.2)',
  '--dsw-focus-ring-color': '#0057FF',
  '--dsw-alias-icon-blue': '#0066FF',

  // ── 特定表面（DSH 官方 --dsw-specific-* 组件专用，换肤必改）──
  // 侧栏列/标题行底色：官方 light 为 --dsw-static-neutral-bluish-50，
  // 这里取豆包 --dbx-bg-base-web #f9f9f9（实测）。
  '--dsw-specific-sidebar-fill': '#F9F9F9',
  '--dsw-specific-sidebar-nav-item-active': '#0066FF0F',
  '--dsw-specific-sidebar-nav-item-active-accent': '#0057FF',
  // 用户气泡默认浅灰底（--dbx-fill-trans-20 实测）；宿主自己消费这个令牌。
  '--dsw-specific-bubble': '#0000000A',
  '--dsw-specific-bubble-highlight': '#E6F0FF',
  '--dsw-specific-input-major': '#FFFFFF',
  '--dsw-specific-login-input': '#FFFFFF',
  '--dsw-specific-selector': '#0057FF',
  '--dsw-specific-tip': '#F3F4F6',
  '--dsw-specific-menu-item-hover': '#F4F4F4',
  '--dsw-specific-menu': '#FFFFFF',
  '--dsw-menu-surface-fill': '#FCFDFEB3',
  '--dsw-menu-backdrop-filter': 'blur(18px)',

  // ── 豆包私有：亮色（键集合必须与 DARK 完全一致，test 会校验） ──
  '--db-primary': '#0057FF',
  '--db-primary-hover': '#004AD9',
  '--db-primary-active': '#003DB3',
  '--db-primary-fill': '#0066FF',
  '--db-primary-soft': '#0066FF0F',
  '--db-primary-border': '#0066FF66',
  '--db-gradient': 'linear-gradient(301deg,#75a4ff 23.93%,#0057ff 92.76%)',
  '--db-gradient-button': 'radial-gradient(125.81% 83.73% at 21.13% 50%,#0057ff 0%,#5a91fc 81.94%)',
  '--db-bubble-gradient': 'linear-gradient(180deg,#3888ff 0%,#0066ff 100%)',
  '--db-user-bubble': '#0000000A',
  '--db-ai-fill': '#F4F4F4',
  '--db-ai-fill-blue': '#E6F0FF',
  '--db-composer-radius': '20px',
  '--db-composer-shadow': '0 2px 4px #00000005, 0 4px 16px #0000000a, 0 8px 32px #00000014',
  '--db-content-max-width': '900px',
  '--db-sidebar-width': '280px',
  '--db-ease': 'cubic-bezier(.2,0,0,1)',
  '--db-ease-out': 'cubic-bezier(0,0,.2,1)',
  '--db-dur': '.15s',
  '--db-dur-mid': '.2s',
})

/**
 * 暗色色板 —— 全部为官方实测值，不是简单反色。
 * 三级底：#121317（base）/ #191C1F（body）/ #1E2123（content），
 * 主色提亮为 #547CFF（--s-color-brand-primary-default dark）。
 */
export const DARK = Object.freeze({
  '--dsw-static-neutral-bluish-950': '#191C1F',
  '--dsw-static-neutral-bluish-875': '#1E2123',
  '--dsw-static-neutral-bluish-850': '#1E2123',
  '--dsw-static-neutral-bluish-800': '#232629',
  '--dsw-static-neutral-bluish-750': '#2A2D31',
  '--dsw-static-neutral-bluish-700': '#35373A',
  '--dsw-static-neutral-bluish-600': '#444749',
  '--dsw-static-neutral-bluish-500': '#666666',
  '--dsw-static-neutral-bluish-400': '#8A8A8A',
  '--dsw-static-neutral-bluish-300': '#BABABA',
  '--dsw-static-neutral-bluish-200': '#D9D9D9',
  '--dsw-static-neutral-bluish-150': '#35373A',
  '--dsw-static-neutral-bluish-100': '#444749',
  '--dsw-static-neutral-bluish-75': '#232629',
  '--dsw-static-neutral-bluish-60': '#232629',
  '--dsw-static-neutral-bluish-50': '#FFFFFF',
  '--dsw-static-neutral-bluish-00': '#000000',
  '--dsw-static-neutral-bluish-1000': '#0C0C0E',

  '--dsw-alias-bg-base': '#191C1F',
  '--dsw-alias-bg-layer-1': '#191C1F',
  '--dsw-alias-bg-layer-2': '#1E2123',
  '--dsw-alias-bg-layer-3': '#232629',
  '--dsw-alias-bg-layer-4': '#0C0C0E',
  '--dsw-alias-bg-overlay': '#181818',
  '--dsw-alias-bg-module-platform': '#0F0F0F',
  '--dsw-alias-bg-multi-select': '#153453',
  '--dsw-alias-bg-l1': '#191C1F',
  '--dsw-alias-bg-l2': '#1E2123',
  '--dsw-alias-background-secondary': '#1E2123',
  '--dsw-alias-bg-document-preview': '#1E2123',
  '--dsw-alias-bg-document-selection': 'rgba(84,124,255,.36)',
  '--dsw-alias-bg-skeleton': '#1A1A1A',
  '--dsw-alias-bg-mask-1': 'rgba(0,0,0,.5)',
  '--dsw-alias-bg-mask-2': 'rgba(0,0,0,.3)',
  '--dsw-alias-bg-mask-3': 'rgba(0,0,0,.6)',
  '--dsw-alias-bg-mask-photo': 'rgba(0,0,0,.88)',
  '--dsw-alias-bg-mask-drop': 'rgba(24,24,24,.72)',

  '--dsw-alias-border-l1': 'hsla(0,0%,100%,.24)',
  '--dsw-alias-border-l2': 'hsla(0,0%,100%,.16)',
  '--dsw-alias-border-subtle': 'hsla(0,0%,100%,.16)',
  '--dsw-alias-border-l2-darkmode-thin': 'hsla(0,0%,100%,.12)',
  '--dsw-alias-border-l3': 'hsla(0,0%,100%,.12)',
  '--dsw-alias-border-l4': 'hsla(0,0%,100%,.08)',
  '--dsw-alias-border-inverted': 'hsla(0,0%,100%,.08)',
  '--dsw-alias-border-inverted2': 'hsla(0,0%,100%,.16)',
  '--dsw-alias-separator-primary': '#FFFFFF0D',

  '--dsw-alias-label-primary': '#FFFFFF',
  '--dsw-alias-label-primary-foreground': '#000000',
  '--dsw-alias-label-primary-inverted': '#000000',
  '--dsw-alias-label-primary-dimmed': 'rgba(255,255,255,.6)',
  '--dsw-alias-label-primary-bluish': '#3385FF',
  '--dsw-alias-label-secondary': 'rgba(255,255,255,.85)',
  '--dsw-alias-label-tertiary': 'rgba(255,255,255,.55)',
  '--dsw-alias-label-caption': 'rgba(255,255,255,.35)',
  '--dsw-alias-label-dimmed': 'rgba(255,255,255,.15)',
  '--dsw-alias-label-quaternary': 'rgba(255,255,255,.35)',
  '--dsw-alias-label-error': '#FF453A',
  '--dsw-alias-label-shimmer': 'rgba(255,255,255,.42)',
  '--dsw-alias-label-document-preview': '#BABABA',
  '--dsw-alias-menu-icon': 'rgba(255,255,255,.85)',

  '--dsw-alias-brand-primary': '#547CFF',
  '--dsw-alias-brand-primary-invert': '#000000',
  '--dsw-alias-brand-text': '#547CFF',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': '#547CFF',
  '--dsw-alias-state-business-primary': '#547CFF',
  '--dsw-alias-state-business-tertiary': '#66A4FF1F',
  '--dsw-alias-button-primary-fill': '#547CFF',
  '--dsw-alias-button-primary-hover': '#4769D9',
  '--dsw-alias-button-primary-dimmed': 'rgba(84,124,255,.3)',
  '--dsw-alias-button-contrast-fill': '#FFFFFF',
  '--dsw-alias-button-elevated-fill': '#181818',
  '--dsw-alias-button-floating-fill': '#181818',
  '--dsw-alias-button-floating-hover': 'hsla(0,0%,100%,.06)',
  '--dsw-alias-button-ghost-active-fill': '#FFFFFF12',
  '--dsw-alias-button-ghost-active-hover': '#FFFFFF1A',
  '--dsw-alias-button-ghost-active-border': '#77B0FF80',
  '--dsw-alias-button-info-fill': '#378DFF',
  '--dsw-alias-button-info-hover': '#4D8EFF',
  '--dsw-alias-button-tool-bar-fill': 'rgba(150,150,150,.5)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(100,100,100,.36)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(150,150,150,.62)',

  '--dsw-alias-interactive-bg-hover': '#FFFFFF14',
  '--dsw-alias-interactive-bg-hover-solid': '#1A1A1A',
  '--dsw-alias-interactive-bg-active': '#FFFFFF12',
  '--dsw-alias-interactive-bg-hover-accent': '#66A4FF1F',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(255,69,58,.12)',
  '--dsw-alias-fill-l1': '#181818',
  '--dsw-alias-fill-l2': '#232629',
  '--dsw-alias-fill-tertiary': '#1E2123',
  '--dsw-alias-fill-tsp-secondary': '#FFFFFF0A',

  '--dsw-static-green-500': '#34C759',
  '--dsw-static-green-400': '#34C759',
  '--dsw-static-green-100': '#214521',
  '--dsw-static-green-900': '#214521',
  '--dsw-static-green-500-a08': 'rgba(52,199,89,.08)',
  '--dsw-static-green-500-a12': 'rgba(52,199,89,.12)',
  '--dsw-static-red-600': '#FF453A',
  '--dsw-static-red-500': '#FF453A',
  '--dsw-static-red-400': '#FF453A',
  '--dsw-static-red-100': '#3E1F1E',
  '--dsw-static-red-900': '#3E1F1E',
  '--dsw-static-red-400-a12': 'rgba(255,69,58,.12)',
  '--dsw-static-red-600-a08': 'rgba(255,69,58,.08)',
  '--dsw-static-amber-500': '#FF9F0A',
  '--dsw-static-amber-400': '#FF9F0A',
  '--dsw-static-amber-600': '#FF9F0A',
  '--dsw-static-amber-100': '#3A2A10',
  '--dsw-static-amber-900': '#3A2A10',
  '--dsw-alias-state-success-primary': '#34C759',
  '--dsw-alias-state-success-secondary': '#214521',
  '--dsw-alias-state-success-tertiary': '#214521',
  '--dsw-alias-state-error-primary': '#FF453A',
  '--dsw-alias-state-error-secondary': '#3E1F1E',
  '--dsw-alias-state-warn-primary': '#FF9F0A',
  '--dsw-alias-state-warning-primary': '#FF9F0A',
  '--dsw-alias-state-warn-secondary': '#3A2A10',
  '--dsw-alias-state-warn-label': '#FF9F0A',
  '--dsw-alias-state-warn-tertiary': '#3A2A10',
  '--dsw-alias-state-idle-primary': '#666666',

  '--dsw-static-deepseek-500': '#547CFF',
  '--dsw-static-deepseek-450': '#547CFF',
  '--dsw-static-deepseek-400': '#547CFF',
  '--dsw-static-deepseek-600': '#4769D9',
  '--dsw-static-deepseek-800': 'rgba(84,124,255,.2)',
  '--dsw-static-deepseek-100': 'rgba(84,124,255,.12)',
  '--dsw-static-deepseek-50': 'rgba(84,124,255,.08)',
  '--dsw-static-deepseek-200': 'rgba(84,124,255,.16)',
  '--dsw-static-deepseek-300': 'rgba(84,124,255,.24)',
  '--dsw-alias-link': '#547CFF',
  '--dsw-alias-label-deep-diving': '#3385FF',
  '--dsw-alias-label-deep-diving-shimmer': 'rgba(84,124,255,.3)',
  '--dsw-static-blue-500': '#378DFF',
  '--dsw-static-blue-450': '#0065FD',
  '--dsw-static-blue-400': '#006CE0',
  '--dsw-static-blue-300': '#4D8EFF',
  '--dsw-static-blue-100': '#002658',

  '--dsw-alias-markdown-code-block': '#181818',
  '--dsw-alias-markdown-code-block-banner': '#153453',
  '--dsw-alias-markdown-inline-code': '#232629',
  '--dsw-alias-markdown-code-editor-bg': '#000000',
  '--dsw-alias-markdown-code-editor-fg': '#FFFFFF',
  '--dsw-alias-markdown-tag': '#232629',
  '--dsw-alias-markdown-citation': '#153453',
  '--dsw-alias-markdown-placeholder': '#1E2123',
  '--dsw-alias-markdown-code-segment-selected': '#181818',
  '--dsw-alias-markdown-code-segment-unselected': '#121317',
  '--dsw-alias-turn-trigger-bg': '#1E2123',
  '--dsw-alias-turn-trigger-bg-hover': 'rgba(255,255,255,.05)',
  '--dsw-alias-code-diff-added': '#214521',
  '--dsw-alias-code-diff-deleted': '#3E1F1E',
  '--dsw-alias-file-diff-added-bg': '#214521',
  '--dsw-alias-file-diff-added-gutter': '#214521',
  '--dsw-alias-file-diff-added-marker': '#55E170',
  '--dsw-alias-file-diff-deleted-bg': '#3E1F1E',
  '--dsw-alias-file-diff-deleted-gutter': '#3E1F1E',
  '--dsw-alias-file-diff-deleted-marker': '#FF3B30',

  '--dsw-alias-scrollbar-bg-l1': '#FFFFFF1A',
  '--dsw-alias-scrollbar-bg-l2': '#FFFFFF1A',
  '--dsw-alias-scrollbar-hover-l1': '#FFFFFF4D',
  '--dsw-alias-scrollbar-hover-l2': '#FFFFFF4D',
  '--dsw-alias-toast-bg': '#232629',
  '--dsw-alias-toast-label': '#FFFFFF',
  '--dsw-alias-tooltip-bg': '#35373A',
  '--dsw-alias-tooltip-label': '#FFFFFF',
  '--dsw-alias-tooltip-key-bg': '#444749',
  '--dsw-alias-menu-group-header-fill': '#141414',
  '--dsw-alias-switch-thumb': '#FFFFFF',
  '--dsw-alias-settings-card-fill': '#1E2123',
  '--dsw-alias-settings-card-stroke': '#35373A',
  '--dsw-alias-onboarding-accent': '#547CFF',
  '--dsw-alias-onboarding-card-fill': '#1E2123',
  '--dsw-alias-onboarding-secondary-fill': '#232629',
  '--dsw-alias-onboarding-checkbox-border': 'hsla(0,0%,100%,.24)',
  '--dsw-focus-ring-color': '#547CFF',
  '--dsw-alias-icon-blue': '#378DFF',

  '--dsw-specific-sidebar-fill': '#0F0F0F',
  '--dsw-specific-sidebar-nav-item-active': '#FFFFFF12',
  '--dsw-specific-sidebar-nav-item-active-accent': '#547CFF',
  '--dsw-specific-bubble': '#FFFFFF14',
  '--dsw-specific-bubble-highlight': '#153453',
  '--dsw-specific-input-major': '#181818',
  '--dsw-specific-login-input': '#181818',
  '--dsw-specific-selector': '#547CFF',
  '--dsw-specific-tip': '#232629',
  '--dsw-specific-menu-item-hover': '#232629',
  '--dsw-specific-menu': '#181818',
  '--dsw-menu-surface-fill': '#303136A3',
  '--dsw-menu-backdrop-filter': 'blur(18px)',

  '--db-primary': '#547CFF',
  '--db-primary-hover': '#4769D9',
  '--db-primary-active': '#3B57B3',
  '--db-primary-fill': '#378DFF',
  '--db-primary-soft': 'rgba(84,124,255,.12)',
  '--db-primary-border': '#77B0FF80',
  '--db-gradient': 'linear-gradient(301deg,#75a4ff 23.93%,#547cff 92.76%)',
  '--db-gradient-button': 'radial-gradient(125.81% 83.73% at 21.13% 50%,#547cff 0%,#5a91fc 81.94%)',
  '--db-bubble-gradient': 'linear-gradient(180deg,#579aff 0%,#3385ff 100%)',
  '--db-user-bubble': '#FFFFFF14',
  '--db-ai-fill': '#181818',
  '--db-ai-fill-blue': '#153453',
  '--db-composer-radius': '20px',
  '--db-composer-shadow': 'inset 0 0 0 0.5px rgba(255,255,255,.05), 0 8px 32px 0 rgba(255,255,255,.08)',
  '--db-content-max-width': '900px',
  '--db-sidebar-width': '280px',
  '--db-ease': 'cubic-bezier(.2,0,0,1)',
  '--db-ease-out': 'cubic-bezier(0,0,.2,1)',
  '--db-dur': '.15s',
  '--db-dur-mid': '.2s',
})

/**
 * 令牌之外的少量结构修正。
 *
 * 纪律：**不针对 DSH 的 CSS Module 哈希类名写规则**（那些名字在上游重新构建
 * 时就会变，属于「看着能用、升级即坏」）。所有选择器只使用经本机 app.asar
 * 字符串扫描实测确认存在的宿主 `data-*` 稳定锚点：
 *   data-composer-card / data-composer-chip / data-composer-chip-selected
 *   data-composer-command / data-message-bubble / data-conversation-scroll
 *   data-code-block-banner / data-phase（hero）
 * 匹配不到时什么都不发生，皮肤的变量层依然完整生效。
 *
 * 字体归一用 `:where()` 把特异性压到 0：任何作者样式都能覆盖我们，只有 UA
 * 样式表会被压过，因此不会「修复」别的插件有意设定的字体。
 *
 * 刻意不覆盖 `:focus-visible` 的 outline：DSH 用
 * `html[data-input-modality=pointer] body :focus-visible{outline-color:#0000}`
 * 实现「仅键盘才显示焦点环」。直接写 outline 会连鼠标点击也画出焦点环，
 * 属于可访问性回退；正确做法是只覆盖它消费的 --dsw-focus-ring-color。
 */
export const STRUCTURE_CSS = `
/* 原生控件跟随皮肤而不是跟随操作系统。 */
:root:root body{color-scheme:light}
:root:root body[data-ds-dark-theme]{color-scheme:dark}

/* 字体归一：零特异性，只压过 UA 默认值，不覆盖任何作者样式。 */
:where(body){font-family:var(--dsw-font-family);font-variant-numeric:tabular-nums}
:where(button,input,select,textarea){font-family:inherit}

/* 输入框外壳：豆包实测 20px 圆角 / 1px rgba(0,0,0,.12) 边框 / 浮起阴影。 */
[data-composer-card]{
  border-radius:var(--db-composer-radius)!important;
  box-shadow:var(--db-composer-shadow)!important;
  border:1px solid var(--dsw-alias-border-l2)!important;
  transition:box-shadow var(--db-dur-mid) var(--db-ease),border-color var(--db-dur) var(--db-ease-out)!important;
}
[data-composer-card]:focus-within{
  border-color:var(--db-primary)!important;
  box-shadow:0 0 0 3px var(--db-primary-soft),var(--db-composer-shadow)!important;
}

/* 消息气泡：官方 --g-send-msg-bubble-radius = 16px。
   只统一圆角，不改底色/对齐 —— 宿主没有角色区分属性，猜错会伤到 AI 回答。 */
[data-message-bubble]{border-radius:var(--dsw-radius-lg)!important}

/* 快捷胶囊（AI 搜索 / 帮我写作 / 图像生成 …）：豆包式圆角药丸 + 半透明玻璃质感。
   官方 --capsule-* 为运行时变量，官方选中态为 #0066ff0f 底 + #0066ff66 边 + #06f 字。 */
[data-composer-chip]{
  border-radius:var(--dsw-radius-full)!important;
  border:1px solid var(--dsw-alias-border-l2)!important;
  background:var(--dsw-alias-bg-layer-1)!important;
  transition:background-color var(--db-dur) var(--db-ease-out),border-color var(--db-dur) var(--db-ease-out),color var(--db-dur) var(--db-ease-out)!important;
}
[data-composer-chip]:hover{
  border-color:var(--db-primary-border)!important;
  color:var(--db-primary)!important;
  background:var(--db-primary-soft)!important;
}
[data-composer-chip][data-composer-chip-selected],
[data-composer-chip][aria-pressed=true]{
  border-color:var(--db-primary-border)!important;
  color:var(--db-primary)!important;
  background:var(--db-primary-soft)!important;
}

/* 主按钮（发送键）：豆包实测径向渐变。用 [class*="primary"] 宽松匹配，
   找不到就什么都不发生；同时给实测锚点 data-composer-command 一份兜底。 */
[data-composer-card] button[class*="primary"],
[data-composer-card] [data-composer-command]{
  background:var(--db-gradient-button)!important;
  color:#fff!important;
  border:0!important;
  border-radius:var(--dsw-radius-sm)!important;
  box-shadow:0 3px 12px var(--db-primary-soft)!important;
  transition:transform var(--db-dur) var(--db-ease-out),box-shadow var(--db-dur) var(--db-ease-out)!important;
}
[data-composer-card] button[class*="primary"]:hover,
[data-composer-card] [data-composer-command]:hover{
  transform:translateY(-1px)!important;
  box-shadow:0 5px 18px var(--db-primary-border)!important;
}

/* 代码块与引用块：统一大圆角；引用块用品牌色左边框（豆包蓝的辨识点）。 */
[data-code-block-banner]{border-radius:var(--dsw-radius-lg) var(--dsw-radius-lg) 0 0!important}
[data-conversation-scroll] pre,
[data-conversation-scroll] blockquote{border-radius:var(--dsw-radius-lg)!important}
[data-conversation-scroll] blockquote{
  border-left:3px solid var(--db-primary)!important;
  background:var(--db-primary-soft)!important;
  padding-left:16px!important;
}

/* 滚动条：细、圆、半透明（跟随主题令牌）。 */
:root:root ::-webkit-scrollbar{width:var(--dsh-scrollbar-width);height:var(--dsh-scrollbar-width)}
:root:root ::-webkit-scrollbar-thumb{
  background:var(--dsw-alias-scrollbar-bg-l1);
  border-radius:9999px;
  border:var(--dsh-scrollbar-thumb-border) solid transparent;
  background-clip:padding-box;
}
:root:root ::-webkit-scrollbar-thumb:hover{
  background:var(--dsw-alias-scrollbar-hover-l1);
  background-clip:padding-box;
}
:root:root ::-webkit-scrollbar-track{background:transparent}

/* 焦点环与选中文本：品牌色。 */
:root:root body :focus-visible{outline-color:var(--dsw-focus-ring-color)}
:root:root body ::selection{
  background:var(--db-primary-soft);
  color:var(--dsw-alias-label-primary);
}

/* 浮层：菜单与上下文菜单用品牌描边 + 中等阴影。 */
[data-menu-field],[data-context-menu]{
  border:1px solid var(--dsw-alias-border-l2)!important;
  box-shadow:var(--dsw-shadow-lv2)!important;
}

/* 尊重系统的减少动效偏好。 */
@media (prefers-reduced-motion: reduce){
  [data-composer-card],[data-composer-chip],
  [data-composer-card] button[class*="primary"]{transition:none!important;transform:none!important}
}
`.trim()

/** 把令牌映射渲染成 `selector{--a:b;--c:d}` 形式的 CSS 文本。 */
export function renderTokenBlock(selector, tokens) {
  return `${selector}{${Object.entries(tokens)
    .map(([name, value]) => `${name}:${value}`)
    .join(';')}}`
}

/** 生成完整皮肤样式表。 */
export function renderSkinCss() {
  const structural = [
    renderTokenBlock(':root:root', STRUCTURAL),
    renderTokenBlock(':root:root body', STRUCTURAL),
  ].join('')
  return [
    `/* dsh-doubao-ui — 豆包风格皮肤 v${SKIN_VERSION} · inspired-by, 非官方 */`,
    `/* 色值来源：豆包 Web 官方 CSS bundle（实测）；映射关系为设计建议（推导）。详见 docs/DESIGN.md */`,
    renderTokenBlock(LIGHT_SELECTOR, LIGHT),
    renderTokenBlock(DARK_SELECTOR, DARK),
    structural,
    STRUCTURE_CSS,
  ].join('\n')
}
