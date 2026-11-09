/* dsh-doubao-ui — 自动生成，请勿直接编辑。
 * 源码：src/tokens.mjs + src/artwork.mjs + src/components.mjs + src/client.mjs
 * 生成：node scripts/build.mjs
 */
window.__ModuleLoader__.load({
	id: 'dsh-doubao-ui',
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

		const __MOD_TOKENS__ = (() => {
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
		const SKIN_VERSION = '1.1.0'

		/** 标记属性，注入到 <html> 上，便于在 DevTools 里确认皮肤已激活。 */
		const SKIN_ATTRIBUTE = 'data-dsh-doubao-skin'

		/** 样式标签的稳定标识（去重 + 卸载时回收）。 */
		const STYLE_TAG_ID = 'dsh-doubao-ui/skin.css'

		/** 亮色令牌选择器：特异性 (0,2,1)。 */
		const LIGHT_SELECTOR = ':root:root body'

		/** 暗色令牌选择器：特异性 (0,3,1)。 */
		const DARK_SELECTOR = ':root:root body[data-ds-dark-theme]'

		/**
		 * 与主题无关的几何/排版令牌 —— 全部为豆包官方 CSS 实测值。
		 *
		 * 圆角刻度（--s-radius-* / --dbx-radius-* / --dbd-radius-* 三套，取合集）：
		 *   4 / 8 / 10 / 12 / 16 / 20 / 24 / 9999px
		 * 输入框容器 20px、气泡 16px、按钮 10px、内容区 900px、侧栏 280px、顶栏 60px。
		 * 阴影取 --s-shadow-lv1/lv2/lv3 与 --dbx-drop-shadow-lg 实测值。
		 */
		const STRUCTURAL = Object.freeze({
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
		const LIGHT = Object.freeze({
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
		const DARK = Object.freeze({
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
		const STRUCTURE_CSS = `
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
		}

		/* 代码块与引用块：统一大圆角、禁止横向溢出。 */
		[data-code-block-banner]{border-radius:var(--dsw-radius-lg) var(--dsw-radius-lg) 0 0!important}
		[data-conversation-scroll] pre,
		[data-conversation-scroll] blockquote{border-radius:var(--dsw-radius-lg)!important}

		/* 尊重系统的减少动效偏好。 */
		@media (prefers-reduced-motion: reduce){
		  [data-composer-card],[data-composer-chip]{transition:none!important}
		}
		`.trim()

		/** 把令牌映射渲染成 `selector{--a:b;--c:d}` 形式的 CSS 文本。 */
		function renderTokenBlock(selector, tokens) {
		  return `${selector}{${Object.entries(tokens)
		    .map(([name, value]) => `${name}:${value}`)
		    .join(';')}}`
		}

		/** 生成完整皮肤样式表。 */
		function renderSkinCss() {
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

		return { SKIN_VERSION, SKIN_ATTRIBUTE, STYLE_TAG_ID, LIGHT_SELECTOR, DARK_SELECTOR, STRUCTURAL, LIGHT, DARK, STRUCTURE_CSS, renderTokenBlock, renderSkinCss };
		})();

		const __MOD_ARTWORK__ = (() => {
		/**
		 * 原创图形资产 —— 纯内联 SVG 字符串，不含任何来自豆包客户端的图片。
		 *
		 * 合规说明：本插件不复制豆包图标、人物或任何受版权保护的素材。这里画的是
		 * 一个**自创的「对话气泡」标记**，只借用「蓝 + 圆润」的视觉语言（几何与配色
		 * 本身不受版权保护）。它故意不是豆包 logo 的临摹。
		 *
		 * 形状语言：两个交叠的圆角气泡 + 一个渐变高光，对应「对话」这一产品语义；
		 * 蓝取自实测主色 #0057ff → #0066ff。
		 */

		/** 侧栏 / hero 共用的方形标记（viewBox 0 0 48 48）。 */
		const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="">
		  <defs>
		    <linearGradient id="db-g" x1="0" y1="0" x2="1" y2="1">
		      <stop offset="0" stop-color="#75A4FF"/>
		      <stop offset="0.45" stop-color="#0057FF"/>
		      <stop offset="1" stop-color="#0066FF"/>
		    </linearGradient>
		  </defs>
		  <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#db-g)"/>
		  <path d="M12 18.5c0-3 2.5-5.5 5.5-5.5h13c3 0 5.5 2.5 5.5 5.5v8c0 3-2.5 5.5-5.5 5.5H22l-6.5 5v-5h-.5c-3 0-5.5-2.5-5.5-5.5z" fill="#fff" fill-opacity=".96"/>
		  <circle cx="20" cy="22" r="2.1" fill="#0057FF"/>
		  <circle cx="26" cy="22" r="2.1" fill="#0057FF"/>
		  <circle cx="32" cy="22" r="2.1" fill="#0057FF"/>
		</svg>`

		/** 作为 `<img src>` 使用的 data URL（UTF-8 → base64，构建期在浏览器侧用 btoa 生成）。 */
		function markDataUrl() {
		  // 浏览器环境：btoa 只吃 Latin-1，SVG 全为 ASCII，可直接编码。
		  try {
		    return 'data:image/svg+xml;base64,' + btoa(MARK_SVG)
		  } catch {
		    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(MARK_SVG)
		  }
		}

		return { MARK_SVG, markDataUrl };
		})();

		const __MOD_COMPONENTS__ = (() => {
		/**
		 * dsh-doubao-ui — React 组件层（源码）
		 *
		 * 这一层让皮肤从「只换颜色」升级为「真的像豆包」：
		 *   1. sidebar.brand.mark / sidebar.brand.name  → 自创对话气泡标记 + 名称
		 *   2. conversation.hero.brand.mark             → 首页大号标记
		 *   3. conversation.hero.options                → 快捷入口胶囊（AI 搜索 / 帮我写作 …）
		 *   4. settings.section                          → 「关于」页，说明来源与权限边界
		 *
		 * 全部通过官方 `ctx.slots.inject` / `ctx.slots.register` 声明式注册，
		 * 不直接改宿主 DOM（除了 CSS  Marker）、不碰会话数据、不注册工具、不联网。
		 *
		 * ── 安全纪律（与皮肤层一致，且这里更关键）──────────────────────────────
		 * DSH 客户端 Loader **不隔离 entry 工厂**：一个工厂抛异常会聚合成
		 * "entries did not activate"，把整个 Web 壳带崩。所以：
		 *   - react / react/jsx-runtime 全部用 try 包裹的探针获取，拿不到就整体降级
		 *     成「只注入 CSS、不注册任何组件」的哑模块；
		 *   - 每个 slots.inject 都单独 try/catch，某个插槽不存在/已声明不影响其余；
		 *   - 组件内部不访问可能为空的 ctx 服务，全部用可选链 + 默认值。
		 *
		 * 关于 priority：-1 是社区 dsh-theme-doubao 已验证的写法，用来盖掉
		 * 官方 dsh-client-ui-brand-official（默认优先级 0）的占位。
		 */

		/**
		 * ⚠️ 关键：模块顶层**绝不**调用 require('react')。
		 *
		 * 工厂一进入就会求值所有内联模块体；若此时 React 种子模块缺失，抛出的异常
		 * 发生在 `probeComponents` 的 try 之外，会直接把整个 Web 壳带崩（loader 不
		 * 隔离工厂）。因此 React 一律通过下面的惰性 getter 在**组件真正渲染时**才取，
		 * 拿不到就返回 null 让调用方降级。
		 */
		let __React = null
		let __jsx = null
		let __jsxs = null

		/** 惰性绑定 React 种子模块；成功返回 true，失败返回 false（绝不抛）。 */
		function bindReact(requireFn) {
		  try {
		    const React = requireFn('react')
		    const runtime = requireFn('react/jsx-runtime')
		    if (!React || !runtime || typeof runtime.jsx !== 'function') return false
		    __React = React
		    __jsx = runtime.jsx
		    __jsxs = runtime.jsxs ?? runtime.jsx
		    return true
		  } catch {
		    return false
		  }
		}

		/** 渲染助手：未绑定时返回一个空节点，不抛异常。 */
		const jsx = (...args) => (__jsx ? __jsx(...args) : null)
		const jsxs = (...args) => (__jsxs ? __jsxs(...args) : null)

		const { markDataUrl } = __MOD_ARTWORK__

		const PLUGIN_ID = 'dsh-doubao-ui'
		const NS = 'settings.doubaoUi'

		/** 官方 HTML 实测文案（「深度思考」0 次、「AI 搜索」2 次）。 */
		const QUICK_ACTIONS = [
		  { id: 'search', label: 'AI 搜索', prompt: '帮我搜索并总结：' },
		  { id: 'write', label: '帮我写作', prompt: '帮我写一段：' },
		  { id: 'image', label: '图像生成', prompt: '帮我生成一张图片，描述是：' },
		  { id: 'translate', label: '翻译', prompt: '请把下面内容翻译成中文：\n' },
		]

		/** 组件层样式，命名空间 .db-*，与皮肤层令牌解耦。 */
		const COMPONENT_CSS = `
		.db-mark{display:block;flex:none;border-radius:32%;user-select:none;-webkit-user-drag:none}
		.db-brand{display:inline-flex;align-items:center;gap:8px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:.02em;font-weight:600}
		.db-hero-mark{display:block;border-radius:34%;box-shadow:0 6px 18px rgba(0,87,255,.22)}
		.db-quick{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;width:100%;padding:2px 0 0;box-sizing:border-box}
		.db-chip{appearance:none;display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:0 14px;border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:9999px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-secondary,rgba(0,0,0,.85));font:inherit;font-size:13px;line-height:20px;cursor:pointer;transition:background-color var(--db-dur,.15s) var(--db-ease-out,cubic-bezier(0,0,.2,1)),border-color var(--db-dur,.15s) var(--db-ease-out,cubic-bezier(0,0,.2,1)),color var(--db-dur,.15s) var(--db-ease-out,cubic-bezier(0,0,.2,1)),transform var(--db-dur,.15s) var(--db-ease-out,cubic-bezier(0,0,.2,1))}
		.db-chip:hover{border-color:var(--db-primary-border,#0066ff66);color:var(--db-primary,#0057ff);background:var(--db-primary-soft,#0066ff0f);transform:translateY(-1px)}
		.db-chip:active{transform:translateY(0)}
		.db-chip:focus-visible{outline:2px solid var(--dsw-focus-ring-color,#0057ff);outline-offset:2px}
		.db-chip svg{width:14px;height:14px;flex:none}
		.db-about{max-width:760px;display:flex;flex-direction:column;gap:18px;color:var(--dsw-alias-label-primary,#000);font:14px/1.6 var(--dsw-font-family,system-ui)}
		.db-about h2{margin:0;font-size:20px;font-weight:600;line-height:28px}
		.db-about h3{margin:0 0 6px;font-size:15px;font-weight:600}
		.db-about p{margin:0;color:var(--dsw-alias-label-secondary,rgba(0,0,0,.85))}
		.db-about-card{border:1px solid var(--dsw-alias-border-l2,rgba(0,0,0,.12));border-radius:var(--dsw-radius-lg,16px);padding:16px;background:var(--dsw-alias-bg-layer-1,#fff);display:flex;flex-direction:column;gap:8px}
		.db-about-head{display:flex;align-items:center;gap:12px}
		.db-about-head img{width:40px;height:40px;border-radius:32%;flex:none}
		.db-about-badge{display:inline-flex;align-items:center;padding:2px 9px;border-radius:9999px;font-size:12px;line-height:18px;background:var(--db-primary-soft,#0066ff0f);color:var(--db-primary,#0057ff);border:1px solid var(--db-primary-border,#0066ff66)}
		.db-about-tip{margin:0;font-size:12.5px;color:var(--dsw-alias-label-tertiary,rgba(0,0,0,.5))}
		.db-about a{color:var(--db-primary,#0057ff);text-decoration:none}
		.db-about a:hover{text-decoration:underline}
		@media (prefers-reduced-motion: reduce){.db-chip{transition:none}}
		`.trim()

		/** 幂等安装组件层样式（与皮肤层同一约定，便于 HMR 回收）。 */
		function installComponentStyles(doc) {
		  if (typeof doc === 'undefined' || doc === null || doc.head == null) return () => {}
		  const id = 'dsh-doubao-ui/components.css'
		  let tag = doc.querySelector(`style[data-plugin-css="${id}"]`)
		  if (tag === null) {
		    tag = doc.createElement('style')
		    tag.dataset.plugin = PLUGIN_ID
		    tag.dataset.pluginCss = id
		    doc.head.appendChild(tag)
		  }
		  tag.textContent = COMPONENT_CSS
		  return () => {
		    try { tag?.remove() } catch { /* ignore */ }
		  }
		}

		/** 侧栏方形标记。props.size 由宿主传入（实测 24）。 */
		function BrandMark(props) {
		  const size = props && typeof props.size === 'number' ? props.size : 24
		  const src = markDataUrl()
		  return jsx('img', {
		    'data-doubao-mark': '',
		    className: 'db-mark',
		    src,
		    alt: '',
		    'aria-hidden': 'true',
		    draggable: false,
		    style: { width: `${size}px`, height: `${size}px` },
		  })
		}

		/** 侧栏名称。 */
		function BrandName() {
		  return jsx('span', { 'data-doubao-name': '', className: 'db-brand' }, '豆包')
		}

		/** 首页大号标记。props.size / props.className 由宿主传入（实测 34）。 */
		function HeroMark(props) {
		  const size = props && typeof props.size === 'number' ? props.size : 34
		  const cls = props && typeof props.className === 'string' ? props.className : ''
		  return jsx('img', {
		    'data-doubao-hero-mark': '',
		    className: `db-hero-mark ${cls}`.trim(),
		    src: markDataUrl(),
		    alt: '',
		    'aria-hidden': 'true',
		    draggable: false,
		    style: { width: `${size}px`, height: `${size}px` },
		  })
		}

		/**
		 * 派发 `input` 事件，让 React 的受控组件感知到值变化。
		 *
		 * 不直接用 `new Event(...)`：某些受限环境（测试桩、老 WebView、跨 realm）
		 * 里全局 `Event` 可能缺失。这里三级兜底，任何一级成功即可。
		 */
		function dispatchInput(el) {
		  try {
		    const view = el.ownerDocument?.defaultView
		    const Ctor = view?.Event ?? (typeof Event !== 'undefined' ? Event : null)
		    if (Ctor !== null && Ctor !== undefined) {
		      el.dispatchEvent(new Ctor('input', { bubbles: true }))
		      return
		    }
		  } catch { /* 落到下一级 */ }
		  try {
		    const ev = el.ownerDocument.createEvent('Event')
		    ev.initEvent('input', true, false)
		    el.dispatchEvent(ev)
		  } catch { /* 事件发不出就算了，值已经写进去了 */ }
		}

		/**
		 * 首页快捷入口胶囊。
		 *
		 * 点击行为：把预置提示词写进当前输入框。
		 *
		 * 为什么不用 `props.setDraft`：宿主不会给 `conversation.hero.options` 的注册
		 * 传这个 prop（该插槽只传空对象），所以那条路径是死代码。这里改用宿主公开的
		 * 稳定锚点 `[data-composer-input]`（已在本机 app.asar 字符串扫描中确认存在）
		 * 找到真实的输入元素，用原生 setter 写值并派发 input 事件 —— 这样 React 的
		 * 受控组件也能感知到变化。
		 *
		 * 找不到输入框时什么都不做（胶囊仍可点击，只是不写入），绝不抛异常。
		 */
		function insertDraft(text) {
		  try {
		    const doc = globalThis.document
		    if (doc === null || doc === undefined) return false
		    const candidates = [
		      '[data-composer-input] textarea',
		      '[data-composer-input] [contenteditable="true"]',
		      '[data-composer-card] textarea',
		      '[data-composer-card] [contenteditable="true"]',
		      '[data-input] textarea',
		      'textarea[data-input]',
		    ]
		    let el = null
		    for (const selector of candidates) {
		      el = doc.querySelector(selector)
		      if (el !== null) break
		    }
		    if (el === null) return false

		    const isEditable = el.getAttribute('contenteditable') === 'true'
		    if (isEditable) {
		      el.focus?.()
		      el.textContent = text
		      dispatchInput(el)
		      return true
		    }

		    // textarea / input：走原型上的原生 setter，绕过 React 的值追踪。
		    // 用 tagName 判断而不是 instanceof —— 后者在跨 realm（iframe / 测试桩）
		    // 场景下会误判。
		    const tag = String(el.tagName ?? '').toUpperCase()
		    const view = el.ownerDocument?.defaultView
		    const Ctor = tag === 'TEXTAREA'
		      ? view?.HTMLTextAreaElement
		      : view?.HTMLInputElement
		    let setter
		    try {
		      setter = Ctor ? Object.getOwnPropertyDescriptor(Ctor.prototype, 'value')?.set : undefined
		    } catch {
		      setter = undefined
		    }
		    el.focus?.()
		    if (typeof setter === 'function') setter.call(el, text)
		    else el.value = text
		    dispatchInput(el)
		    return true
		  } catch {
		    return false
		  }
		}

		/** 首页快捷入口胶囊：点击把预置提示词写进输入框。 */
		function QuickActions() {
		  return jsxs('div', {
		    className: 'db-quick',
		    'data-doubao-quick': '',
		    role: 'group',
		    'aria-label': '快捷入口',
		    children: QUICK_ACTIONS.map((action) =>
		      jsx('button', {
		        key: action.id,
		        type: 'button',
		        className: 'db-chip',
		        'data-doubao-chip': action.id,
		        onClick: () => { insertDraft(action.prompt) },
		        children: action.label,
		      }),
		    ),
		  })
		}

		/** 「关于」设置页：说明来源、权限边界与回滚方式。 */
		function AboutSection() {
		  return jsxs('div', {
		    className: 'db-about',
		    children: [
		      jsxs('div', { className: 'db-about-head', children: [
		        jsx('img', { src: markDataUrl(), alt: '', 'aria-hidden': 'true' }),
		        jsxs('div', { children: [
		          jsx('h2', { children: '豆包风格皮肤' }),
		          jsx('span', { className: 'db-about-badge', children: 'dsh-doubao-ui · v1.1.0' }),
		        ] }),
		      ] }),
		      jsxs('div', { className: 'db-about-card', children: [
		        jsx('h3', { children: '这是什么' }),
		        jsx('p', { children: '给 DeepSeek Harness Web 换一套豆包风格界面：实测色板驱动的蓝调主题、暖中性面与大圆角几何，外加品牌图标与首页快捷入口。明暗双主题跟随宿主设置。' }),
		      ] }),
		      jsxs('div', { className: 'db-about-card', children: [
		        jsx('h3', { children: '能力边界' }),
		        jsx('p', { children: '本插件只写一张样式表并注册几个界面插槽：不读写文件、不发起网络请求、不注册工具或服务、不写会话记录。停用或卸载后官方界面完整恢复。' }),
		      ] }),
		      jsxs('div', { className: 'db-about-card', children: [
		        jsx('h3', { children: '来源与声明' }),
		        jsx('p', { children: '配色与几何参照豆包 Web 公开 CSS 的实测设计令牌，按 DSH 语义重新映射；图标为本项目原创绘制，未复制任何豆包素材。这是个人维护的非官方插件，与字节跳动 / 豆包、DeepSeek 无隶属或背书关系。' }),
		        jsx('p', { className: 'db-about-tip', children: '完整令牌映射与逐项「实测 / 推导」标注见仓库 docs/DESIGN.md。' }),
		      ] }),
		    ],
		  })
		}

		/**
		 * 声明式注册所有插槽。
		 *
		 * 每个注册都独立 try/catch：某个插槽在当前宿主版本不存在、或已被别的插件
		 * 声明（slot already declared），就跳过它，其余照常工作。
		 * 用 generator 形式（yield）是官方与社区都验证过的「一次注入多个注册」写法。
		 */
		function registerSlots(ctx) {
		  const slots = ctx && ctx.slots
		  if (!slots || typeof slots.inject !== 'function' || typeof slots.register !== 'function') return

		  // 1. 侧栏品牌：盖掉官方 brand-official（priority -1）
		  try {
		    slots.inject('sidebar.brand.mark', () =>
		      slots.inject('sidebar.brand.name', function* () {
		        try { yield slots.register({ name: 'sidebar.brand.mark', priority: -1 }, BrandMark) } catch { /* slot taken */ }
		        try { yield slots.register({ name: 'sidebar.brand.name', priority: -1 }, BrandName) } catch { /* slot taken */ }
		      }),
		    )
		  } catch { /* 宿主无此插槽 */ }

		  // 2. 首页 hero 标记
		  try {
		    slots.inject('conversation.hero.brand.mark', () =>
		      slots.register({ name: 'conversation.hero.brand.mark', priority: -1 }, HeroMark),
		    )
		  } catch { /* 宿主无此插槽 */ }

		  // 3. 首页快捷胶囊（挂 options 列表插槽；若声明冲突则跳过）
		  try {
		    slots.inject('conversation.hero.options', () =>
		      slots.register({ name: 'conversation.hero.options', id: 'doubao-quick-actions', order: 80 }, QuickActions),
		    )
		  } catch { /* 宿主无此插槽 */ }

		  // 4. 设置页「关于」
		  try {
		    slots.inject('settings.section', () =>
		      slots.register({
		        name: 'settings.section',
		        id: 'doubao-ui',
		        order: 900,
		        label: () => '豆包皮肤',
		      }, AboutSection),
		    )
		  } catch { /* 宿主无此插槽 */ }
		}


		return { bindReact, installComponentStyles, registerSlots, insertDraft, BrandMark, BrandName, HeroMark, QuickActions, AboutSection, QUICK_ACTIONS, COMPONENT_CSS, NS };
		})();

		const __MOD_CLIENT__ = (() => {
		/**
		 * dsh-doubao-ui — 豆包风格皮肤 · 浏览器半（源码）
		 *
		 * 构建产物是 client/client.js：一个由 window.__ModuleLoader__.load 注册的
		 * 工厂式 CJS 模块（与官方 ui-* 包、dsh-zcode-ui 等第三方皮肤完全同一套机制）。
		 * 构建脚本 scripts/build.mjs 把 src/*.mjs 全部内联打包，因此本包**没有运行时
		 * 依赖、没有构建期框架依赖、不需要 pnpm install**。
		 *
		 * 两层贡献：
		 *   - 皮肤层（tokens.mjs）：纯 CSS 变量覆盖，换全站配色与几何。始终生效。
		 *   - 组件层（components.mjs）：React 插槽注册，换品牌图标、首页快捷入口、
		 *     设置页关于入口。宿主无 React / 无插槽时整体安全降级，皮肤层不受影响。
		 *
		 * ── 导出契约（v1.1.1 修正）──────────────────────────────────────────────
		 * 本文件**不使用** `module.exports = {...}`。原因：`module.exports = x` 会让
		 * `module.exports` 指向新对象，而工厂开头 `var exports = module.exports` 拿到的
		 * 是**旧对象**；后续任何 `exports.foo = ...` 都写在废弃对象上，静默丢失。
		 * 构建器对主模块做 IIFE 包装并 `return { ... }`，导出因此天然正确。
		 *
		 * ── require 的传递 ────────────────────────────────────────────────────
		 * `apply` 需要工厂的 `require` 来探测 React 种子模块。ESM 源码里没有 `require`
		 * 这个自由变量，所以由构建器在工厂作用域内注入一个 `__entryRequire` 绑定，
		 * 再由 `createApply()` 把它交给我们（见 scripts/build.mjs）。
		 *
		 * 设计原则（刻意保守，避免把宿主带崩）：
		 *   1. 不替换宿主业务组件、不注册工具、不碰会话数据、不发起网络请求。
		 *   2. 所有平台能力探测与样式注入都包在 try 里；任何一步失败都退化成
		 *      「隐形的哑模块」——绝不让 loader 的 entry 工厂抛异常（loader 不隔离
		 *      工厂：一个工厂抛异常会聚合成 "entries did not activate"，把整个 Web
		 *      壳带崩，这是社区插件最常见的白屏原因）。
		 *   3. 不依赖宿主的 CSS Module 哈希类名。所有选择器走 :root / body /
		 *      data-* 稳定锚点；找不到锚点时什么都不发生，皮肤其余部分不受影响。
		 *   4. 样式标签带 data-plugin / data-plugin-css，遵循 DSH 客户端插件约定，
		 *      让 HMR 驱动与卸载流程能正确回收它。
		 */

		const {
		  SKIN_VERSION,
		  SKIN_ATTRIBUTE,
		  STYLE_TAG_ID,
		  renderSkinCss,
		} = __MOD_TOKENS__

		const PLUGIN_ID = 'dsh-doubao-ui'

		/**
		 * 安全获取 React 组件层。
		 *
		 * `require('react')` / `require('react/jsx-runtime')` 是 DSH 客户端模块系统的
		 * **平台种子模块**（无需在 dsh.client.external 声明），但宿主版本差异或加载
		 * 顺序异常时仍可能抛错。这里把整个组件层的加载包在 try 里：拿不到就返回
		 * null，插件自动退化为「纯 CSS 皮肤」，绝不白屏。
		 *
		 * @param {((spec: string) => unknown) | undefined} requireFn 工厂的 require。
		 * @returns {object | null} 组件模块，或 null（降级）。
		 */
		function probeComponents(requireFn) {
		  if (typeof requireFn !== 'function') return null
		  try {
		    const components = __MOD_COMPONENTS__
		    if (!components || typeof components.bindReact !== 'function') return null
		    // 绑定失败（React 种子缺失）→ 整体降级为纯 CSS 皮肤。
		    if (!components.bindReact(requireFn)) return null
		    return components
		  } catch {
		    return null
		  }
		}

		/**
		 * 安装皮肤样式表。
		 *
		 * 幂等：同名标签已存在时只替换内容，不重复插入。
		 * 返回卸载函数，供 ctx.effect 在插件停用时回收（同时还原 <html> 标记）。
		 */
		function installSkin(doc) {
		  if (typeof doc === 'undefined' || doc === null || doc.head == null) return () => {}
		  let tag = doc.querySelector(`style[data-plugin-css="${STYLE_TAG_ID}"]`)
		  if (tag === null) {
		    tag = doc.createElement('style')
		    tag.dataset.plugin = PLUGIN_ID
		    tag.dataset.pluginCss = STYLE_TAG_ID
		    doc.head.appendChild(tag)
		  }
		  tag.textContent = renderSkinCss()

		  const root = doc.documentElement
		  const previous = root.getAttribute(SKIN_ATTRIBUTE)
		  root.setAttribute(SKIN_ATTRIBUTE, SKIN_VERSION)

		  return () => {
		    try {
		      tag?.remove()
		      if (previous === null) root.removeAttribute(SKIN_ATTRIBUTE)
		      else root.setAttribute(SKIN_ATTRIBUTE, previous)
		    } catch {
		      /* 卸载时 DOM 可能已经不在了，忽略 */
		    }
		  }
		}

		/**
		 * 在宿主侧栏/会话区打上 `data-doubao-*` 标记，供样式表作为稳定锚点。
		 *
		 * 为什么需要：DSH 的组件类名是 CSS Module 内容哈希（形如 `._8HJdBW_group`），
		 * 上游每次构建都会变。社区 dsh-theme-doubao 也采用同一策略：
		 * 「主题只能用 data-* 属性选择器，不能依赖宿主类名」。
		 *
		 * 这里用 MutationObserver 只做「加属性」这一件事，且带短路与节流，
		 * 不改动任何元素结构、不注入任何 DOM 节点、不监听业务事件。
		 * 观察失败（老浏览器、权限受限）时静默降级：皮肤的变量层依然完整生效。
		 */
		function markHostSurfaces(doc) {
		  if (typeof doc === 'undefined' || doc === null || doc.body == null) return () => {}

		  const ALIASES = [
		    ['[data-conversation-scroll]', 'data-doubao-conversation'],
		    ['[data-composer-card]', 'data-doubao-composer'],
		    ['[data-phase="hero"]', 'data-doubao-hero-phase'],
		  ]

		  const mark = (root) => {
		    try {
		      for (const [selector, attr] of ALIASES) {
		        const nodes = root.querySelectorAll?.(selector) ?? []
		        for (const node of nodes) {
		          if (!node.hasAttribute(attr)) node.setAttribute(attr, '')
		        }
		      }
		    } catch {
		      /* 单个节点失败不影响其余 */
		    }
		  }

		  mark(doc.body)

		  let observer = null
		  try {
		    if (typeof MutationObserver !== 'undefined') {
		      let frame = 0
		      observer = new MutationObserver(() => {
		        if (frame !== 0) return
		        frame = requestAnimationFrame(() => {
		          frame = 0
		          mark(doc.body)
		        })
		      })
		      observer.observe(doc.body, { childList: true, subtree: true })
		    }
		  } catch {
		    observer = null
		  }

		  return () => {
		    try { observer?.disconnect() } catch { /* ignore */ }
		  }
		}

		/**
		 * 客户端服务注入声明。
		 *
		 * `slots` 是唯一硬依赖：组件层的品牌/首页/设置页注册都需要它。
		 * 但注意 —— 即使宿主没有 slots 服务，`apply` 也会安全跳过组件层，
		 * CSS 皮肤照常工作。声明它只是让 Loader 在 slots 就绪后再激活本插件，
		 * 避免「插件先激活、插槽后声明」导致注册丢失（声明感知注入同理）。
		 */
		const inject = ['slots']

		/**
		 * 构造真正的 `apply(ctx)`。
		 *
		 * 为什么不直接导出 `apply(ctx, requireFn)`：Loader 只会用 `apply(ctx)` 调用，
		 * 第二个参数恒为 undefined，组件层会被永久静默禁用。因此必须把工厂的 require
		 * 在**闭包**里捕获，导出签名严格为 1 参。
		 *
		 * @param {((spec: string) => unknown) | undefined} requireFn 工厂的 require。
		 * @returns {(ctx: object) => void} Loader 可调用的 apply。
		 */
		function createApply(requireFn) {
		  return function apply(ctx) {
		    const undo = []
		    try {
		      const effect = typeof ctx?.effect === 'function' ? ctx.effect.bind(ctx) : null
		      const register = (fn, label) => {
		        if (effect !== null) {
		          try {
		            effect(fn, label)
		            return
		          } catch {
		            /* 某些宿主版本 effect 签名不同，退回直接调用 */
		          }
		        }
		        undo.push(fn())
		      }

		      const doc = globalThis.document

		      // 第一层：纯 CSS 皮肤，永远尝试，不依赖任何服务。
		      register(() => installSkin(doc), `${PLUGIN_ID}: skin stylesheet`)
		      register(() => markHostSurfaces(doc), `${PLUGIN_ID}: surface markers`)

		      // 第二层：React 组件。整体可选，失败只影响这一层。
		      try {
		        const components = probeComponents(requireFn)
		        if (components !== null) {
		          register(
		            () => components.installComponentStyles(doc),
		            `${PLUGIN_ID}: component stylesheet`,
		          )
		          components.registerSlots(ctx)
		        }
		      } catch (error) {
		        try { console.warn(`[${PLUGIN_ID}] 组件层降级：`, error && error.message) } catch { /* ignore */ }
		      }
		    } catch (error) {
		      try {
		        console.warn(`[${PLUGIN_ID}] 皮肤初始化失败，已安全降级：`, error && error.message)
		      } catch { /* console 不可用时彻底静默 */ }
		      for (const dispose of undo) {
		        try { dispose?.() } catch { /* ignore */ }
		      }
		    }
		  }
		}


		return { createApply, inject, installSkin, markHostSurfaces, probeComponents, PLUGIN_ID };
		})();

		// Loader 只用 apply(ctx) 一个参数调用，所以工厂的 require 必须在
		// 闭包里捕获后交给 createApply —— 否则组件层永远拿不到 React 种子模块。
		Object.assign(exports, __MOD_CLIENT__);
		exports.apply = __MOD_CLIENT__.createApply(require);
		return module.exports;
	}
});
