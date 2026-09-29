import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public', 'projects')
fs.mkdirSync(outDir, { recursive: true })

const shots = [
  ['turfn', 'https://web-kappa-ten-24.vercel.app/'],
  ['geo', 'https://global-geosciences-chatbot.vercel.app/'],
  ['vip', 'https://upgrade-vip-chatbot.vercel.app/'],
  ['microrage', 'https://microrage-frontend-react.vercel.app/'],
  ['cineflix', 'https://cine-flix-movie-website.vercel.app/'],
  ['weipa', 'https://weipa-client-project.vercel.app/'],
]

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

for (const [id, url] of shots) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
    await page.waitForTimeout(2500)
    const file = path.join(outDir, `${id}.png`)
    await page.screenshot({ path: file, type: 'png' })
    console.log('OK', id)
  } catch (err) {
    console.error('FAIL', id, err.message)
  }
}

await browser.close()
