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
} = require('./tokens.mjs')

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
    const components = require('./components.mjs')
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
export function createApply(requireFn) {
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

export {
  inject,
  installSkin,
  markHostSurfaces,
  probeComponents,
  PLUGIN_ID,
}
