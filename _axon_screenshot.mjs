import puppeteer from 'puppeteer-core';
import { readdirSync } from 'fs';
import { join } from 'path';

const url        = process.argv[2] || 'http://localhost:3000/en/';
const label      = process.argv[3] ? '-' + process.argv[3] : '';
const outDir     = 'C:\\Users\\georg\\Desktop\\Axon Web\\temporary screenshots';
const chromePath = 'C:\\Users\\georg\\.cache\\puppeteer\\chrome\\win64-149.0.7827.22\\chrome-win64\\chrome.exe';

const existing = readdirSync(outDir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.replace('screenshot-', '').replace(/(-.*)?\.png$/, ''), 10)).filter(n => !isNaN(n));
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filepath = join(outDir, `screenshot-${next}${label}.png`);

const browser = await puppeteer.launch({ headless: true, executablePath: chromePath });
const page    = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

// Emulate prefers-reduced-motion so station-content shows immediately (opacity: 1 !important)
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: filepath, fullPage: true });
await browser.close();
console.log('Saved:', filepath);
