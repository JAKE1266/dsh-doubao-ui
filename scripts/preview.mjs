#!/usr/bin/env node
/**
 * 把皮肤 CSS 渲染成预览图，不需要启动 DSH。
 *
 * 原理：生成一个模拟 DSH 三栏布局的 HTML（侧栏 + 会话区 + 输入框），
 * 把 tokens.mjs 生成的**真实 CSS** 注入进去，用本机 Edge headless 截图。
 *
 * ⚠️ 这是**示意图**，不是 DSH 的真实截图。它复现的是皮肤的配色、圆角、
 * 玻璃、分色等视觉决策；布局是手写的近似，**不能反映 DSH 真实的 DOM 密度、
 * 间距与组件结构**。真实效果请在启用插件后查看。
 *
 * 用法：
 *   node scripts/preview.mjs            # 亮色
 *   node scripts/preview.mjs --dark     # 暗色
 *   node scripts/preview.mjs --out assets/x.png
 */

import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import vm from 'node:vm'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].find((p) => existsSync(p))

if (!EDGE) {
  console.error('找不到 Edge / Chrome，无法渲染预览。')
  process.exit(1)
}

const args = process.argv.slice(2)
const dark = args.includes('--dark')
const outFlag = args.indexOf('--out')
const outFile = outFlag >= 0 && args[outFlag + 1]
  ? resolve(root, args[outFlag + 1])
  : join(root, 'assets', dark ? 'preview-dark.png' : 'preview-light.png')

// ── 1. 从产物里取出真实 CSS 与品牌资产 ────────────────────────────────
const code = readFileSync(join(root, 'client', 'client.js'), 'utf8')
let reg = null
const sb = {
  window: { __ModuleLoader__: { load: (r) => { reg = r } } },
  console, Symbol, Object, Array, String, Number, JSON, Math, Map, Set, Error, Promise,
  btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
  encodeURIComponent, MutationObserver: undefined, requestAnimationFrame: (f) => f(),
  document: {
    head: { appendChild() {} }, body: { querySelectorAll: () => [] },
    createElement: () => ({ dataset: {}, remove() {} }), querySelector: () => null,
    documentElement: { getAttribute: () => null, setAttribute() {}, removeAttribute() {} },
  },
}
vm.createContext(sb)
vm.runInContext(code, sb)

const hooked = code.replace(
  'Object.assign(exports, __MOD_CLIENT__);',
  'Object.assign(exports, __MOD_CLIENT__); exports.__T__ = __MOD_TOKENS__; exports.__C__ = __MOD_COMPONENTS__; exports.__A__ = __MOD_ARTWORK__;',
)
let reg2 = null
const sb2 = { ...sb, window: { __ModuleLoader__: { load: (r) => { reg2 = r } } } }
vm.createContext(sb2)
vm.runInContext(hooked, sb2)
const m2 = reg2.factory((s) => {
  if (s === 'react') return {}
  if (s === 'react/jsx-runtime') return { jsx: () => ({}), jsxs: () => ({}) }
  throw new Error(s)
})

const skinCss = m2.__T__.renderSkinCss()
const componentCss = m2.__C__.COMPONENT_CSS
const markSvg = m2.__A__.MARK_SVG
const markUrl = 'data:image/svg+xml;base64,' + Buffer.from(markSvg).toString('base64')

// ── 2. 模拟 DSH 界面 ──────────────────────────────────────────────────
const SESSIONS = ['如何优化 React 渲染性能', 'Postgres 索引设计讨论', '把这段 Python 改成 Rust', '周报草稿']

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<style>${skinCss}</style>
<style>${componentCss}</style>
<style>
/* ── 仅预览用的布局外壳（不属于皮肤本体）────────────────────────── */
*{box-sizing:border-box}
html,body{margin:0;height:100%}
body{
  font-family:var(--dsw-font-family);
  font-size:var(--dsw-font-size-base);
  color:var(--dsw-alias-label-primary);
  background:var(--dsw-alias-bg-base);
  ${dark ? 'color-scheme:dark' : 'color-scheme:light'}
}
.app{display:grid;grid-template-columns:250px 1fr;height:100vh}
.sidebar{
  background:var(--dsw-specific-sidebar-fill);
  border-right:1px solid var(--dsw-alias-border-l1);
  display:flex;flex-direction:column;padding:12px 10px;gap:2px;
}
.brand{display:flex;align-items:center;gap:9px;padding:6px 8px 14px}
.brand img{width:26px;height:26px;border-radius:32%}
.brand span{font-weight:700;font-size:15px;background:var(--km-gradient-text,var(--db-primary));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.newbtn{
  display:flex;align-items:center;gap:8px;padding:9px 12px;margin-bottom:10px;
  border-radius:var(--dsw-radius-md);
  background:var(--km-gradient-button,var(--db-gradient-button));
  color:#fff;font-weight:600;font-size:13.5px;
  box-shadow:0 4px 14px var(--km-primary-soft,var(--db-primary-soft));
}
.sess{padding:9px 11px;border-radius:var(--dsw-radius-md);font-size:13.5px;
  color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sess.active{background:var(--dsw-specific-sidebar-nav-item-active);color:var(--km-primary,var(--db-primary));font-weight:600}
.sess:hover{background:var(--dsw-alias-interactive-bg-hover)}
.sidefoot{margin-top:auto;padding:9px 11px;font-size:12.5px;color:var(--dsw-alias-label-tertiary)}
.main{display:flex;flex-direction:column;min-width:0;background:var(--dsw-alias-bg-base)}
.header{
  height:52px;display:flex;align-items:center;padding:0 20px;gap:10px;
  border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;
}
.header .title{font-weight:600;font-size:14px}
.header .badge{
  margin-left:auto;font-size:11.5px;padding:3px 10px;border-radius:9999px;
  background:var(--km-primary-soft,var(--db-primary-soft));
  color:var(--km-primary,var(--db-primary));
  border:1px solid var(--km-primary-border,var(--db-primary-border));font-weight:600;
}
.chat{flex:1;overflow:auto;padding:26px 0}
.col{max-width:var(--km-content-max-width,var(--db-content-max-width,768px));margin:0 auto;padding:0 24px;display:flex;flex-direction:column;gap:20px}
.msg{display:flex;gap:12px}
.msg.user{justify-content:flex-end}
.bubble{border-radius:var(--dsw-radius-lg);padding:13px 17px;line-height:1.65;font-size:14.5px;max-width:82%}
.msg.user .bubble{
  background:var(--dsw-specific-bubble);
  border:1px solid var(--km-primary-border,var(--db-primary-border));
}
.msg.ai .bubble{background:transparent;padding-left:0;max-width:100%}
.avatar{width:28px;height:28px;border-radius:32%;flex:none;margin-top:2px}
code{
  font-family:var(--dsh-font-family-code-default);font-size:12.5px;
  background:var(--dsw-alias-markdown-inline-code);padding:2px 6px;border-radius:6px;
}
pre{
  margin:12px 0;padding:14px 16px;border-radius:var(--dsw-radius-lg);
  background:var(--dsw-alias-markdown-code-block);
  border:1px solid var(--dsw-alias-border-l2);
  font-family:var(--dsh-font-family-code-default);font-size:12.5px;
  line-height:1.6;overflow:auto;color:var(--dsw-alias-label-primary);
}
blockquote{
  margin:12px 0;padding:10px 16px;border-left:3px solid var(--km-primary,var(--db-primary));
  background:var(--km-gradient-soft,var(--db-primary-soft));
  border-radius:var(--dsw-radius-lg);
  color:var(--dsw-alias-label-secondary);font-size:13.5px;
}
.composerWrap{padding:0 24px 22px;flex:none}
.composer{
  max-width:var(--km-content-max-width,var(--db-content-max-width,768px));margin:0 auto;
  border-radius:var(--km-composer-radius,var(--db-composer-radius));
  box-shadow:var(--km-composer-shadow,var(--db-composer-shadow));
  border:1px solid var(--dsw-alias-border-l2);
  background:var(--dsw-alias-bg-layer-1);
  padding:16px 18px 12px;display:flex;flex-direction:column;gap:12px;
}
.composer .ph{color:var(--dsw-alias-label-tertiary);font-size:14.5px;min-height:44px}
.chips{display:flex;gap:8px;flex-wrap:wrap}
.chip{
  display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 14px;
  border-radius:9999px;font-size:12.5px;font-weight:500;
  border:1px solid var(--dsw-alias-border-l2);
  background:var(--km-glass-fill,var(--dsw-alias-bg-layer-1));
  backdrop-filter:var(--km-glass-blur,none);-webkit-backdrop-filter:var(--km-glass-blur,none);
  color:var(--dsw-alias-label-secondary);
}
.chip.sel{
  background:var(--km-gradient-button,var(--db-gradient-button));
  color:#fff;border-color:var(--km-primary,var(--db-primary));
  box-shadow:0 4px 14px var(--km-primary-soft,var(--db-primary-soft));
}
.composerFoot{display:flex;align-items:center;gap:10px}
.send{
  margin-left:auto;width:34px;height:34px;border-radius:9999px;
  background:var(--km-gradient-button,var(--db-gradient-button));color:#fff;
  display:grid;place-items:center;font-size:16px;
  box-shadow:0 4px 14px var(--km-primary-soft,var(--db-primary-soft));
}
.label{position:fixed;top:8px;right:10px;font-size:10.5px;letter-spacing:.06em;
  color:var(--dsw-alias-label-caption);text-transform:uppercase;pointer-events:none}
</style>
</head>
<body${dark ? ' data-ds-dark-theme' : ''}>
<div class="app">
  <aside class="sidebar">
    <div class="brand"><img src="${markUrl}" alt=""><span>${process.env.DSH_PREVIEW_NAME || 'Kimi'}</span></div>
    <div class="newbtn">＋ 新建会话</div>
    ${SESSIONS.map((s, i) => `<div class="sess${i === 0 ? ' active' : ''}">${s}</div>`).join('')}
    <div class="sidefoot">⚙ 设置　·　共 ${SESSIONS.length} 个会话</div>
  </aside>
  <main class="main">
    <div class="header">
      <span class="title">如何优化 React 渲染性能</span>
      <span class="badge">${process.env.DSH_PREVIEW_BADGE || 'skin preview'}</span>
    </div>
    <div class="chat"><div class="col">
      <div class="msg user"><div class="bubble">帮我看一下这个 SQL 为什么慢？</div></div>
      <div class="msg ai">
        <img class="avatar" src="${markUrl}" alt="">
        <div class="bubble">
          主要原因是 <code>created_at</code> 上没有索引，导致全表扫描。建议加一个复合索引：
          <pre>CREATE INDEX idx_orders_user_created
  ON orders (user_id, created_at DESC);</pre>
          这样 <code>WHERE user_id = ? ORDER BY created_at DESC</code> 就能走索引。
          <blockquote>提示：索引不是越多越好，写入放大的代价也要算进去。</blockquote>
        </div>
      </div>
    </div></div>
    <div class="composerWrap">
      <div class="composer">
        <div class="ph">发消息…</div>
        <div class="chips">
          <span class="chip sel">AI 搜索</span>
          <span class="chip">长文阅读</span>
          <span class="chip">帮我写作</span>
          <span class="chip">翻译</span>
        </div>
        <div class="composerFoot">
          <span style="font-size:12px;color:var(--dsw-alias-label-tertiary)">⏎ 发送</span>
          <span class="send">↑</span>
        </div>
      </div>
    </div>
  </main>
</div>
<div class="label">${dark ? 'dark' : 'light'} · 示意图</div>
</body>
</html>`

const tmpHtml = join(root, 'assets', `.preview-${dark ? 'dark' : 'light'}.html`)
mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(tmpHtml, html, 'utf8')

const shot = [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  '--no-default-browser-check', '--window-size=1440,900',
  '--force-device-scale-factor=1.5', '--virtual-time-budget=3000',
  `--screenshot=${outFile}`, pathToFileURL(tmpHtml).href,
]
const res = spawnSync(EDGE, shot, { stdio: 'ignore', timeout: 60000 })
try { rmSync(tmpHtml) } catch { /* ignore */ }

if (res.error || !existsSync(outFile)) {
  console.error('渲染失败：', res.error?.message ?? '未生成图片')
  process.exit(1)
}
console.log('preview:', outFile)
