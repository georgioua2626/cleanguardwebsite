import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'temporary screenshots');

const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Auto-increment: find the next available N
let n = 1;
while (fs.existsSync(path.join(outDir, filename(n)))) n++;

function filename(n) {
  return label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
}

const outPath = path.join(outDir, filename(n));

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page    = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Trigger all scroll animations by marking elements as animate-in
  await page.evaluate(() => {
    document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('animate-in'));
  });

  // Small settle time for any transitions
  await new Promise(r => setTimeout(r, 400));

  await page.screenshot({ path: outPath, fullPage: true });
  await browser.close();
  console.log(`Screenshot saved → ${outPath}`);
})();
