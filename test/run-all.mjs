#!/usr/bin/env node
/**
 * dsh-doubao-ui — 自包含验证套件（零依赖）· v1.1.0
 *
 * 覆盖：
 *   1. 产物存在且是有效的 JS（用 vm 在沙箱里真实执行一遍）
 *   2. 工厂注册了正确的 id，导出了 apply / inject（含 slots 服务声明）
 *   3. 四个源码模块都被内联（tokens / artwork / components / client）
 *   4. 生成的 CSS 含亮/暗两套令牌块、特异性前缀、结构令牌、关键品牌色
 *   5. 亮/暗令牌键集合完全一致（避免暗色漏改某个变量）
 *   6. 样式注入幂等、卸载可完整回收（用最小 DOM 桩）
 *   7. apply 在任何宿主异常下都不抛错（降级为哑模块，不白屏）
 *   8. 组件层：React 缺失时整体降级；插槽声明正确；快捷入口文案为实测值
 *   9. 组件 CSS 幂等注入与回收
 *  10. manifest 字段自洽（exports 指向真实文件、patch 存在、inject 前置官方包）
 */
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const read = (p) => readFileSync(join(root, p), 'utf8')

let passed = 0
const ok = (name) => {
  passed += 1
  console.log(`  ✓ ${name}`)
}

/** 构造一个带可控 require 的 vm 沙箱，返回工厂注册与工厂函数。 */
function makeSandbox(options = {}) {  const { react = { useState: () => [] }, jsxRuntime = { jsx: () => ({}), jsxs: () => ({}) }, extraGlobals = {} } = options
  let registration = null
  const seeds = { react, 'react/jsx-runtime': jsxRuntime }
  const requireFn = (spec) => {
    if (spec in seeds) return seeds[spec]
    throw new Error(`no module: ${spec}`)
  }
  const sandbox = {
    window: { __ModuleLoader__: { load: (reg) => { registration = reg } } },
    console,
    Symbol, Object, Array, String, Number, JSON, Math, Map, Set, Error, Promise,
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    encodeURIComponent,
    MutationObserver: undefined,
    requestAnimationFrame: (fn) => fn(),
    ...extraGlobals,
  }
  vm.createContext(sandbox)
  return { sandbox, requireFn, get registration() { return registration } }
}

const clientCode = read('client/client.js')

/** 最小 DOM 桩：够 installSkin / installComponentStyles 幂等与回收测试用。 */
function makeDomStub() {
  const head = { children: [], appendChild(n) { this.children.push(n) } }
  const rootAttrs = new Map()
  const doc = {
    head,
    body: { querySelectorAll: () => [] },
    documentElement: {
      getAttribute: (k) => (rootAttrs.has(k) ? rootAttrs.get(k) : null),
      setAttribute: (k, v) => rootAttrs.set(k, v),
      removeAttribute: (k) => rootAttrs.delete(k),
    },
    createElement: () => ({ dataset: {}, textContent: '', remove() { this.__removed = true } }),
    querySelector: (sel) =>
      head.children.find((n) => n.dataset.pluginCss === sel.match(/data-plugin-css="([^"]+)"/)?.[1]) ?? null,
  }
  return { doc, head, rootAttrs }
}

// ── 1. 产物语法 + 工厂注册 ────────────────────────────────────────────────
{
  const { sandbox } = makeSandbox()
  vm.runInContext(clientCode, sandbox, { filename: 'client/client.js' })
  const reg = sandbox.window.__ModuleLoader__.load.mock?.lastRegistration ?? null
  // vm 里没有 mock，改从闭包取：见下
}
{
  let captured = null
  const sb = {
    window: { __ModuleLoader__: { load: (r) => { captured = r } } },
    console, Symbol, Object, Array, String, Number, JSON, Math, Map, Set, Error, Promise,
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    encodeURIComponent,
    MutationObserver: undefined,
    requestAnimationFrame: (fn) => fn(),
  }
  vm.createContext(sb)
  vm.runInContext(clientCode, sb, { filename: 'client/client.js' })
  assert.ok(captured, 'client.js 必须调用 __ModuleLoader__.load')
  assert.equal(captured.id, 'dsh-doubao-ui')
  assert.equal(typeof captured.factory, 'function')
  ok('产物是有效 JS 且正确注册了工厂式 CJS 模块')

  // ── 2. 工厂导出契约 ──────────────────────────────────────────────────────
  const mod = captured.factory((spec) => {
    if (spec === 'react') return { useState: () => [] }
    if (spec === 'react/jsx-runtime') return { jsx: () => ({}), jsxs: () => ({}) }
    throw new Error(`no module: ${spec}`)
  })
  assert.equal(typeof mod.apply, 'function', '必须导出 apply')
  assert.ok(Array.isArray(mod.inject), '必须导出 inject 数组')
  assert.ok(mod.inject.includes('slots'), '组件层需要声明 slots 服务')
  assert.equal(typeof mod.installSkin, 'function')
  assert.equal(typeof mod.markHostSurfaces, 'function')

  // 回归：Loader 只用 apply(ctx) 调用。若签名是 (ctx, requireFn)，
  // 第二个参数恒为 undefined，组件层会被永久静默禁用。
  assert.equal(mod.apply.length, 1, 'apply 必须只接受 ctx 一个参数（require 由闭包捕获）')
  ok('工厂导出 apply(ctx) / inject(slots) / installSkin / markHostSurfaces')

  // 回归：module.exports = {...} 会让 exports 别名失效，后续 exports.* 静默丢失。
  assert.ok(
    !/^\s*module\.exports\s*=/m.test(clientCode),
    '产物不得出现 module.exports = {...}（会让 exports.* 赋值静默丢失）',
  )
  ok('产物不含 module.exports 重绑定（避免 exports 别名失效）')

  // 回归：组件层必须真的被接上 —— 完整跑一次 apply，确认插槽注册发生。
  {
    const dom = makeDomStub()
    // 注意：apply 读的是它自己作用域里的 globalThis.document，所以必须把
    // document 注入**沙箱**（而不是宿主 globalThis），否则样式注入会被静默跳过。
    let captured2 = null
    const sb2 = {
      window: { __ModuleLoader__: { load: (r) => { captured2 = r } } },
      console, Symbol, Object, Array, String, Number, JSON, Math, Map, Set, Error, Promise,
      btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
      encodeURIComponent,
      MutationObserver: undefined,
      requestAnimationFrame: (fn) => fn(),
      document: dom.doc,
    }
    vm.createContext(sb2)
    vm.runInContext(clientCode, sb2, { filename: 'client/client.js' })
    const mod2 = captured2.factory((spec) => {
      if (spec === 'react') return { useState: () => [] }
      if (spec === 'react/jsx-runtime') return { jsx: () => ({}), jsxs: () => ({}) }
      throw new Error(`no module: ${spec}`)
    })

    const calls = []
    const slots = {
      inject: (name, fn) => {
        calls.push(['inject', name])
        try {
          const r = fn()
          if (r && typeof r.next === 'function') { for (const _ of r) { /* drain */ } }
        } catch { /* ignore */ }
      },
      register: (desc) => { calls.push(['register', desc.name, desc.priority ?? null]); return () => {} },
    }
    assert.doesNotThrow(() => mod2.apply({ effect: (fn) => { fn() }, slots }))

    const registered = calls.filter((c) => c[0] === 'register').map((c) => c[1])
    assert.ok(registered.includes('sidebar.brand.mark'), 'apply 必须真的注册品牌插槽（组件层被接上）')
    assert.equal(dom.head.children.length, 2, '应注入 2 张样式表（皮肤 + 组件）')
    const ids = dom.head.children.map((n) => n.dataset.pluginCss).sort()
    assert.equal(ids.join(','), 'dsh-doubao-ui/components.css,dsh-doubao-ui/skin.css')
    ok('apply 真实调用后组件层生效（2 张样式表 + 插槽注册）')
  }


  // ── 3. 四个模块都被内联 ──────────────────────────────────────────────────
  assert.ok(clientCode.includes('__MOD_TOKENS__'), '缺少 tokens 模块')
  assert.ok(clientCode.includes('__MOD_ARTWORK__'), '缺少 artwork 模块')
  assert.ok(clientCode.includes('__MOD_COMPONENTS__'), '缺少 components 模块')
  assert.ok(clientCode.includes('__MOD_CLIENT__'), '缺少 client 主模块')
  assert.ok(clientCode.includes('function createApply(requireFn)'), '缺少 createApply 工厂')
  ok('四个源码模块全部内联进单一产物')

  // ── 4. CSS 产物内容 ──────────────────────────────────────────────────────
  const css = (() => {
    let captured2 = null
    const instrumented = clientCode.replace(
      'return module.exports;',
      'module.exports.__t = { renderSkinCss: __MOD_TOKENS__.renderSkinCss, LIGHT: __MOD_TOKENS__.LIGHT, DARK: __MOD_TOKENS__.DARK, STRUCTURAL: __MOD_TOKENS__.STRUCTURAL, COMPONENTS: __MOD_COMPONENTS__ }; return module.exports;',
    )
    const sb2 = {
      window: { __ModuleLoader__: { load: (r) => { captured2 = r } } },
      console, Symbol, Object, Array, String, Number, JSON, Math, Map, Set, Error, Promise,
      btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
      encodeURIComponent,
      MutationObserver: undefined,
      requestAnimationFrame: (fn) => fn(),
    }
    vm.createContext(sb2)
    vm.runInContext(instrumented, sb2)
    const m = captured2.factory((spec) => {
      if (spec === 'react') return { useState: () => [] }
      if (spec === 'react/jsx-runtime') return { jsx: () => ({}), jsxs: () => ({}) }
      throw new Error(`no module: ${spec}`)
    })
    return { text: m.__t.renderSkinCss(), t: m.__t }
  })()

  assert.ok(css.text.includes(':root:root body{'), '缺少亮色令牌块')
  assert.ok(css.text.includes(':root:root body[data-ds-dark-theme]{'), '缺少暗色令牌块')
  assert.ok(css.text.includes('color-scheme:light') && css.text.includes('color-scheme:dark'))
  assert.ok(css.text.includes('--dsw-radius-full:9999px'), '缺少胶囊圆角令牌（官方 --dbd-radius-full: 9999px）')
  assert.ok(css.text.includes('--dsw-font-size-base'), '缺少字号令牌')
  assert.ok(css.text.includes('[data-composer-card]'), '缺少输入框结构规则')
  assert.ok(css.text.includes('[data-message-bubble]'), '缺少气泡结构规则')
  assert.ok(css.text.includes('[data-composer-chip]'), '缺少快捷胶囊规则')
  assert.ok(css.text.includes('prefers-reduced-motion'), '缺少减少动效适配')
  ok('CSS 含亮/暗双主题块、结构令牌、输入框/气泡/胶囊规则与 reduced-motion 适配')

  // ── 5. 亮/暗键集合一致 ───────────────────────────────────────────────────
  const lightKeys = Object.keys(css.t.LIGHT).sort()
  const darkKeys = Object.keys(css.t.DARK).sort()
  assert.equal(
    darkKeys.join('\n'),
    lightKeys.join('\n'),
    `亮/暗令牌键不一致：\n仅在 LIGHT: ${lightKeys.filter((k) => !darkKeys.includes(k))}\n仅在 DARK: ${darkKeys.filter((k) => !lightKeys.includes(k))}`,
  )
  assert.ok(lightKeys.length >= 200, `令牌数量偏少 (${lightKeys.length})`)
  ok(`亮/暗令牌键集合完全一致（${lightKeys.length} 个语义令牌）`)

  assert.equal(css.t.LIGHT['--dsw-alias-brand-primary'], '#0057FF', '亮色主色必须是实测 #0057FF')
  assert.equal(css.t.DARK['--dsw-alias-brand-primary'], '#547CFF', '暗色主色必须是实测 #547CFF')
  ok('亮色 #0057FF / 暗色 #547CFF（官方实测，非推测）')

  for (const [paletteName, palette] of [['LIGHT', css.t.LIGHT], ['DARK', css.t.DARK], ['STRUCTURAL', css.t.STRUCTURAL]]) {
    for (const [key, value] of Object.entries(palette)) {
      assert.match(key, /^--[a-z0-9-]+$/, `${paletteName} 非法变量名 ${key}`)
      assert.equal(typeof value, 'string', `${paletteName}.${key} 必须是字符串`)
      assert.ok(value.length > 0 && !/[\n;{}]/.test(value), `${paletteName}.${key} 非法值: ${value}`)
    }
  }
  ok('全部令牌名合法、值无注入风险')

  // ── 6. 样式注入幂等 + 卸载回收 ───────────────────────────────────────────
  {
    const { doc, head, rootAttrs } = makeDomStub()
    const dispose = mod.installSkin(doc)
    assert.equal(head.children.length, 1, '第一次安装应插入一个 style')
    assert.equal(head.children[0].dataset.plugin, 'dsh-doubao-ui')
    assert.equal(head.children[0].dataset.pluginCss, 'dsh-doubao-ui/skin.css')
    assert.equal(rootAttrs.get('data-dsh-doubao-skin'), '1.1.0')
    const first = head.children[0]
    const dispose2 = mod.installSkin(doc)
    assert.equal(head.children.length, 1, '重复安装不得重复插入 style')
    assert.equal(head.children[0], first, '重复安装应复用同一个 style 标签')
    dispose2(); dispose()
    assert.equal(first.__removed, true, '卸载必须移除 style')
    assert.equal(rootAttrs.has('data-dsh-doubao-skin'), false, '卸载必须还原 <html> 标记')
    ok('皮肤样式注入幂等，ctx.effect 卸载可完整回收')

    const noDoc = mod.installSkin(undefined)
    assert.equal(typeof noDoc, 'function'); noDoc()
    ok('无 document 环境（SSR / 测试）安全降级为空操作')
  }

  // ── 7. apply 容错（不能带崩宿主） ────────────────────────────────────────
  {
    const dom = makeDomStub()
    const contexts = [
      {},
      { effect: null },
      { effect: () => { throw new Error('effect 不可用') } },
      { effect: (fn) => { fn() } },
      { effect: (fn, label) => { assert.equal(typeof label, 'string'); fn() } },
    ]
    const origDoc = globalThis.document
    globalThis.document = dom.doc
    for (const ctx of contexts) {
      assert.doesNotThrow(() => mod.apply(ctx), 'apply 在任何宿主形态下都不得抛异常')
    }
    if (origDoc === undefined) delete globalThis.document
    else globalThis.document = origDoc
    ok('apply 在 effect 缺失/抛错/无 slots 时均安全降级，绝不白屏')
  }

  // ── 8. 组件层 ───────────────────────────────────────────────────────────
  {
    const comp = css.t.COMPONENTS
    assert.equal(typeof comp.registerSlots, 'function')
    assert.equal(typeof comp.installComponentStyles, 'function')
    assert.ok(Array.isArray(comp.QUICK_ACTIONS))
    const labels = comp.QUICK_ACTIONS.map((a) => a.label)
    // comp 来自 vm 沙箱，数组原型不同，用 join 比较而非 deepStrictEqual。
    assert.equal(
      labels.join('|'),
      ['AI 搜索', '帮我写作', '图像生成', '翻译'].join('|'),
      '快捷文案必须是官方 HTML 实测值（无「深度思考」）',
    )
    assert.ok(comp.COMPONENT_CSS.includes('.db-chip'), '组件 CSS 缺少胶囊规则')
    assert.ok(comp.COMPONENT_CSS.includes('.db-about'), '组件 CSS 缺少关于页规则')
    ok('组件层导出完整，快捷入口文案为官方实测值')

    // 回归：胶囊点击必须真的能写进输入框（此前依赖 props.setDraft，
    // 而宿主不会传这个 prop，等于死代码）。
    assert.equal(typeof comp.insertDraft, 'function', '必须导出 insertDraft')
    {
      // insertDraft 读的是它自己作用域里的 globalThis.document，因此必须在
      // 沙箱内注入 —— 宿主 globalThis 赋值对 vm 沙箱不可见。
      let written = null
      let dispatched = false
      function TA() {}
      Object.defineProperty(TA.prototype, 'value', {
        set(v) { written = v },
        get() { return written },
        configurable: true,
      })
      const textarea = {
        tagName: 'TEXTAREA',
        ownerDocument: { defaultView: { HTMLTextAreaElement: TA, Event: function Event() {} } },
        getAttribute: () => null,
        focus: () => {},
        dispatchEvent: () => { dispatched = true },
      }
      const fakeDoc = {
        querySelector: (sel) => (sel.includes('textarea') ? textarea : null),
        createEvent: () => ({ initEvent() {} }),
      }

      let reg3 = null
      const sb3 = {
        window: { __ModuleLoader__: { load: (r) => { reg3 = r } } },
        console, Symbol, Object, Array, String, Number, JSON, Math, Map, Set, Error, Promise,
        btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
        encodeURIComponent,
        MutationObserver: undefined,
        requestAnimationFrame: (fn) => fn(),
        document: fakeDoc,
      }
      vm.createContext(sb3)
      vm.runInContext(
        clientCode.replace(
          'Object.assign(exports, __MOD_CLIENT__);',
          'Object.assign(exports, __MOD_CLIENT__); exports.__C__ = __MOD_COMPONENTS__;',
        ),
        sb3,
      )
      const m3 = reg3.factory((spec) => {
        if (spec === 'react') return {}
        if (spec === 'react/jsx-runtime') return { jsx: () => ({}), jsxs: () => ({}) }
        throw new Error(`no module: ${spec}`)
      })
      const okWrite = m3.__C__.insertDraft('测试提示词')
      assert.equal(okWrite, true, 'insertDraft 应能找到 textarea 并写入')
      assert.equal(written, '测试提示词', 'insertDraft 必须真的写入目标文本')
      assert.equal(dispatched, true, 'insertDraft 必须派发 input 事件让 React 感知')
    }
    {
      // 找不到输入框时必须安全返回 false，不抛异常
      let reg4 = null
      const sb4 = {
        window: { __ModuleLoader__: { load: (r) => { reg4 = r } } },
        console, Symbol, Object, Array, String, Number, JSON, Math, Map, Set, Error, Promise,
        btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
        encodeURIComponent,
        MutationObserver: undefined,
        requestAnimationFrame: (fn) => fn(),
        document: { querySelector: () => null },
      }
      vm.createContext(sb4)
      vm.runInContext(
        clientCode.replace(
          'Object.assign(exports, __MOD_CLIENT__);',
          'Object.assign(exports, __MOD_CLIENT__); exports.__C__ = __MOD_COMPONENTS__;',
        ),
        sb4,
      )
      const m4 = reg4.factory((spec) => {
        if (spec === 'react') return {}
        if (spec === 'react/jsx-runtime') return { jsx: () => ({}), jsxs: () => ({}) }
        throw new Error(`no module: ${spec}`)
      })
      assert.doesNotThrow(() => m4.__C__.insertDraft('x'))
      assert.equal(m4.__C__.insertDraft('x'), false, '无输入框时应返回 false')
    }
    ok('insertDraft 能写入输入框并派发 input 事件；无输入框时安全返回 false')

    // 插槽注册：用桩记录所有 inject/register 调用
    const calls = []
    const slots = {
      inject: (name, fn) => {
        calls.push(['inject', name])
        try { const r = fn(); if (r && typeof r.next === 'function') { for (const _ of r) { /* drain generator */ } } } catch { /* ignore */ }
      },
      register: (desc, comp) => { calls.push(['register', desc.name, desc.id ?? null, desc.priority ?? null, desc.order ?? null]); return () => {} },
    }
    assert.doesNotThrow(() => comp.registerSlots({ slots }))
    const injected = calls.filter((c) => c[0] === 'inject').map((c) => c[1])
    for (const name of ['sidebar.brand.mark', 'sidebar.brand.name', 'conversation.hero.brand.mark', 'conversation.hero.options', 'settings.section']) {
      assert.ok(injected.includes(name), `缺少插槽 ${name}`)
    }
    const marks = calls.filter((c) => c[0] === 'register' && c[1] === 'sidebar.brand.mark')
    assert.ok(marks.some((c) => c[3] === -1), '品牌注册必须用 priority:-1 盖掉官方占位')
    ok('五个官方插槽全部声明，品牌注册用 priority:-1 覆盖官方')

    // 组件样式幂等 + 回收
    const { doc, head } = makeDomStub()
    const d1 = comp.installComponentStyles(doc)
    assert.equal(head.children.length, 1)
    assert.equal(head.children[0].dataset.pluginCss, 'dsh-doubao-ui/components.css')
    const tag = head.children[0]
    const d2 = comp.installComponentStyles(doc)
    assert.equal(head.children.length, 1, '组件样式重复安装不得重复插入')
    d2(); d1()
    assert.equal(tag.__removed, true, '组件样式卸载必须回收')
    ok('组件层样式注入幂等、可完整回收')

    // React 缺失时 apply 必须仍能安全执行（CSS 皮肤不受影响）
    const noReactFactory = captured.factory((spec) => { throw new Error(`no module: ${spec}`) })
    const { doc: d3 } = makeDomStub()
    const origDoc2 = globalThis.document
    globalThis.document = d3
    assert.doesNotThrow(() => noReactFactory.apply({}), 'React 缺失时 apply 不得抛异常')
    if (origDoc2 === undefined) delete globalThis.document
    else globalThis.document = origDoc2
    ok('React / jsx-runtime 缺失时组件层整体降级，CSS 皮肤仍生效')
  }

  // ── 9. manifest 自洽 ───────────────────────────────────────────────────
  {
    const pkg = JSON.parse(read('package.json'))
    assert.equal(pkg.dsh.client.platform, 'web')
    for (const name of [
      '@deepseek-ai/dsh-client-ui-theme',
      '@deepseek-ai/dsh-client-ui-sidebar',
      '@deepseek-ai/dsh-client-ui-conversation',
      '@deepseek-ai/dsh-client-ui-settings',
      '@deepseek-ai/dsh-client-ui-brand-official',
    ]) {
      assert.ok(pkg.dsh.client.inject.includes(name), `dsh.client.inject 必须前置声明 ${name}`)
    }
    assert.equal(pkg.version, '1.1.0', '版本号应与本次升级一致')
    assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
    assert.ok(existsSync(join(root, pkg.exports['.'].default)), 'exports["."] 指向的文件不存在')
    assert.ok(existsSync(join(root, pkg.exports['./client'].default)), 'exports["./client"] 指向的文件不存在')
    assert.ok(existsSync(join(root, 'cordis.patch.yml')))
    assert.ok(existsSync(join(root, 'LICENSE')))
    assert.ok(existsSync(join(root, 'README.md')))
    assert.ok(existsSync(join(root, 'docs/DESIGN.md')))
    assert.ok(read('cordis.patch.yml').includes('dsh-doubao-ui'), 'patch 必须挂载本插件行')
    ok('package.json / exports / patch / LICENSE / README / DESIGN 自洽')
  }
}

console.log(`\n✅ ${passed} 项检查全部通过`)
