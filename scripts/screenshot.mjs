#!/usr/bin/env node
/**
 * 用本机 Edge 截取 DSH Web 的亮/暗两张预览图。
 *
 * 为什么用 Edge 而不是 Playwright：本机没有安装 Playwright，但 Edge 自带
 * `--headless --screenshot`，零依赖即可出图。
 *
 * 前提（重要）：
 *   1. DSH Web 正在运行，且**已启用本皮肤**（并重启 + 硬刷新过一次）；
 *   2. 你能提供带鉴权的访问方式 —— DSH Web 的根路径返回 401，
 *      直接请求会被拒。两种可用方式：
 *
 *      a) 如果你有访问令牌，设置环境变量：
 *           $env:DSH_URL = "http://127.0.0.1:50459/?token=<你的token>"
 *
 *      b) 如果 GUI 只对已登录的浏览器会话开放，headless 浏览器拿不到会话，
 *         这时**无法自动截图**，请改用手动方式（见文件末尾）。
 *
 * 用法：
 *   node scripts/screenshot.mjs                      # 亮色
 *   node scripts/screenshot.mjs --dark               # 暗色
 *   node scripts/screenshot.mjs --out assets/x.png
 */

import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const EDGE_CANDIDATES = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
]

const args = process.argv.slice(2)
const dark = args.includes('--dark')
const outFlag = args.indexOf('--out')
const outFile = outFlag >= 0 && args[outFlag + 1]
  ? resolve(root, args[outFlag + 1])
  : join(root, 'assets', dark ? 'screenshot-dark.png' : 'screenshot-light.png')

const url = process.env.DSH_URL
if (!url) {
  console.error('缺少 DSH_URL 环境变量。')
  console.error('  $env:DSH_URL = "http://127.0.0.1:<port>/?token=<token>"')
  console.error('（DSH Web 根路径返回 401，必须带上可用的鉴权信息。）')
  process.exit(1)
}

const browser = EDGE_CANDIDATES.find((p) => existsSync(p))
if (!browser) {
  console.error('找不到 Edge / Chrome 可执行文件，无法截图。')
  process.exit(1)
}

mkdirSync(dirname(outFile), { recursive: true })

// 暗色：注入一次主题切换后再截图。DSH 用 body[data-ds-dark-theme] 表达暗色，
// 但该属性由宿主启动脚本设置，headless 下未必可写；这里先尝试直接设属性。
const preDark = dark
  ? 'document.body.setAttribute("data-ds-dark-theme","");'
  : ''

const shotArgs = [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1440,900',
  '--virtual-time-budget=8000',
  `--screenshot=${outFile}`,
]
if (preDark) shotArgs.push(`--evaluate-on-new-document=${preDark}`)
shotArgs.push(url)

console.log(`browser: ${browser}`)
console.log(`url:     ${url}`)
console.log(`output:  ${outFile}`)

const res = spawnSync(browser, shotArgs, { stdio: 'inherit', timeout: 45000 })

if (res.error) {
  console.error('截图失败：', res.error.message)
  if (res.error.code === 'ETIMEDOUT') {
    console.error('浏览器超时。最常见原因是页面返回 401 —— DSH Web 需要登录会话，')
    console.error('headless 浏览器拿不到，请改用手动截图（见 assets/README.md）。')
  }
  process.exit(1)
}
if (res.signal) {
  console.error('浏览器被信号终止（多半是超时）。页面可能需要鉴权。')
  process.exit(1)
}
if (!existsSync(outFile)) {
  console.error('截图未生成。多半是页面需要登录会话，headless 拿不到。')
  console.error('请改用手动方式：浏览器打开 DSH Web → 启用皮肤 → 截图。')
  process.exit(1)
}
console.log('done:', outFile)
