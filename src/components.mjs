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
export function bindReact(requireFn) {
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

const { markDataUrl } = require('./artwork.mjs')

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

export {
  bindReact,
  installComponentStyles,
  registerSlots,
  insertDraft,
  BrandMark,
  BrandName,
  HeroMark,
  QuickActions,
  AboutSection,
  QUICK_ACTIONS,
  COMPONENT_CSS,
  NS,
}
