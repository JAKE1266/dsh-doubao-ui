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
export const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="">
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
export function markDataUrl() {
  // 浏览器环境：btoa 只吃 Latin-1，SVG 全为 ASCII，可直接编码。
  try {
    return 'data:image/svg+xml;base64,' + btoa(MARK_SVG)
  } catch {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(MARK_SVG)
  }
}
