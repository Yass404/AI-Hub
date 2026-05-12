// Captures the synthetic mockups (steps 03 Gem rendering, 06 Imagen result)
// that live on Google's side and can't be screenshot from our app.
// Run: node scripts/capture-mockups.mjs

import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MOCKUPS_DIR = path.resolve(__dirname, 'mockups')
const OUTPUT_DIR = path.resolve(__dirname, '..', 'public', 'help')

const mockups = [
  { html: '03-article-rendu-gem.html', out: '03-article-rendu-gem.png', width: 880 },
  { html: '06-gemini-imagen-resultat.html', out: '06-gemini-imagen-resultat.png', width: 1000 },
]

const browser = await chromium.launch()

for (const m of mockups) {
  const ctx = await browser.newContext({
    viewport: { width: m.width, height: 800 },
    deviceScaleFactor: 2,
  })
  const page = await ctx.newPage()
  const url = 'file://' + path.join(MOCKUPS_DIR, m.html)
  await page.goto(url, { waitUntil: 'load' })
  await page.waitForTimeout(300)
  const body = await page.locator('body').boundingBox()
  await page.screenshot({
    path: path.join(OUTPUT_DIR, m.out),
    clip: { x: 0, y: 0, width: body.width, height: body.height },
  })
  console.log('  →', m.out)
  await ctx.close()
}

await browser.close()
console.log('Done.')
