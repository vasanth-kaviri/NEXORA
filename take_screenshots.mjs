import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const executablePath = fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')
  ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const outDir = 'C:\\Users\\dell\\.gemini\\antigravity-ide\\brain\\2bbdc123-e427-427d-93c7-55303de990f1\\screenshots';

async function run() {
  console.log('Launching browser at:', executablePath);
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const routes = [
    { url: 'http://localhost:5173/onboarding', name: 'onboarding_desktop.png' },
    { url: 'http://localhost:5173/dashboard', name: 'dashboard_desktop.png' },
    { url: 'http://localhost:5173/roadmap', name: 'roadmap_desktop.png' },
    { url: 'http://localhost:5173/notifications', name: 'notifications_desktop.png' },
    { url: 'http://localhost:5173/explore', name: 'explore_desktop.png' }
  ];

  for (const r of routes) {
    try {
      console.log('Navigating to:', r.url);
      await page.goto(r.url, { waitUntil: 'networkidle0', timeout: 15000 });
      await new Promise(res => setTimeout(res, 1200));
      const filePath = path.join(outDir, r.name);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log('Saved:', filePath);
    } catch (e) {
      console.error('Error on', r.url, e.message);
    }
  }

  // Mobile viewport test for dashboard
  try {
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(res => setTimeout(res, 1000));
    await page.screenshot({ path: path.join(outDir, 'dashboard_mobile.png') });
    console.log('Saved mobile screenshot');
  } catch (e) {
    console.error('Mobile screenshot failed', e.message);
  }

  await browser.close();
  console.log('Screenshots complete.');
}

run();
