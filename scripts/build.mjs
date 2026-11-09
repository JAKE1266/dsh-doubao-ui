#!/usr/bin/env node
/**
 * 把 src/*.mjs 打包成 client/client.js。
 *
 * 为什么自己写一个 ~120 行的打包器，而不是 tsdown / esbuild：
 *   - 本包**零依赖**，`npm install` 都不需要；发到 GitHub 上 clone 下来
 *     直接 `node scripts/build.mjs` 就能产出可安装的产物。
 *   - 源码是几个无 JSX、无外部 import 的 ESM/CJS 混写文件，内联足够。
 *   - 产物必须是 DSH 客户端约定的「工厂式 CJS 模块」：
 *     `window.__ModuleLoader__.load({ id, factory(require){ ... } })`。
 *
 * v1.1.0：支持多模块内联。模块表：
 *   ./tokens.mjs      → __MOD_TOKENS__
 *   ./artwork.mjs     → __MOD_ARTWORK__
 *   ./components.mjs  → __MOD_COMPONENTS__
 *   ./client.mjs      → 主模块（工厂体）
 *
 * 种子模块（react、react/jsx-runtime）由工厂的 require 参数提供，
 * 打包器把它们原样透传，不内联、不列为 external（DSH 平台种子表已内置）。
 *
 * 产物随仓库提交（client/client.js），因此 `dsh plugin add` / GitHub 安装
 * 都不需要触发任何构建或 prepare 脚本。
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const outFile = join(root, 'client', 'client.js')

/** 允许透传给工厂 require 的宿主种子模块（不需要在 dsh.client.external 声明）。 */
const SEED_MODULES = new Set(['react', 'react/jsx-runtime', 'react-dom'])

/** 内联模块表：文件名 → 工厂内的局部变量名。 */
const MODULES = [
  { file: 'tokens.mjs', spec: './tokens.mjs', varName: '__MOD_TOKENS__' },
  { file: 'artwork.mjs', spec: './artwork.mjs', varName: '__MOD_ARTWORK__' },
  { file: 'components.mjs', spec: './components.mjs', varName: '__MOD_COMPONENTS__' },
]

const exportNamesOf = {}
const moduleBodies = {}

for (const mod of MODULES) {
  const src = readFileSync(join(root, 'src', mod.file), 'utf8')
  const names = []
  let body = src.replace(
    /^export\s+(const|let|var|function|async function)\s+([A-Za-z_$][\w$]*)/gm,
    (_m, kind, name) => {
      names.push(name)
      return `${kind} ${name}`
    },
  )
  // 支持 `export { a, b, c }` 形式：收集名字并整行删除。
  body = body.replace(/^export\s*\{([^}]*)\}\s*;?\s*$/gm, (_m, list) => {
    for (const part of list.split(',')) {
      const name = part.trim().split(/\s+as\s+/)[0].trim()
      if (name) names.push(name)
    }
    return ''
  })
  if (/^export\s*\{/m.test(body)) {
    throw new Error(`build: ${mod.file} 残留了无法解析的 export 语句`)
  }
  if (names.length === 0) {
    throw new Error(`build: ${mod.file} 没有解析到任何导出`)
  }
  exportNamesOf[mod.file] = [...new Set(names)]
  moduleBodies[mod.file] = body
}

/** 把源码里 require('./xxx.mjs') 换成对应模块变量；种子模块保持 require 原样。 */
function rewriteRequires(src, owner) {
  return src.replace(/require\(\s*['"]([^'"]+)['"]\s*\)/g, (whole, spec) => {
    if (SEED_MODULES.has(spec)) return whole
    const mod = MODULES.find((m) => m.spec === spec)
    if (!mod) {
      throw new Error(`build: ${owner} 存在未处理的外部 require: ${spec}`)
    }
    return mod.varName
  })
}

// 各模块体也要重写（components.mjs 依赖 artwork.mjs 与种子模块）
for (const mod of MODULES) {
  moduleBodies[mod.file] = rewriteRequires(moduleBodies[mod.file], mod.file)
}

const mainSrc = readFileSync(join(root, 'src', 'client.mjs'), 'utf8')
const mainBody = rewriteRequires(mainSrc, 'client.mjs')

/** 把 ESM 源码包装成一个返回 exports 对象的 CJS 块。 */
function wrapModule(mod, body) {
  const names = exportNamesOf[mod.file]
  return `const ${mod.varName} = (() => {\n${body}\nreturn { ${names.join(', ')} };\n})();`
}

const banner = `/* dsh-doubao-ui — 自动生成，请勿直接编辑。
 * 源码：src/tokens.mjs + src/artwork.mjs + src/components.mjs + src/client.mjs
 * 生成：node scripts/build.mjs
 */`

const output = `${banner}
window.__ModuleLoader__.load({
\tid: 'dsh-doubao-ui',
\tfactory: (require) => {
\t\tvar module = { exports: {} };
\t\tvar exports = module.exports;
\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

${MODULES.map((m) => indent(wrapModule(m, moduleBodies[m.file]), 2)).join('\n\n')}

${indent(mainBody, 2)}

\t\t// 客户端入口的 apply 需要工厂的 require 来安全探测 React 种子模块。
\t\texports.apply = (ctx) => apply(ctx, require);
\t\texports.inject = inject;
\t\treturn module.exports;
\t}
});
`

function indent(text, tabs) {
  const pad = '\t'.repeat(tabs)
  return text
    .split('\n')
    .map((line) => (line.length > 0 ? pad + line : line))
    .join('\n')
}

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, output, 'utf8')
const totalExports = Object.values(exportNamesOf).reduce((n, a) => n + a.length, 0)
console.log(`build: wrote ${outFile} (${output.length} bytes, ${MODULES.length + 1} modules, ${totalExports} exports)`)
