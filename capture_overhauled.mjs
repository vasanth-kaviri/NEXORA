import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const executablePath = fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')
  ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const artifactDir = 'C:\\Users\\dell\\.gemini\\antigravity-ide\\brain\\2bbdc123-e427-427d-93c7-55303de990f1\\screenshots';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Mock Interview - Start session and capture Voice Answering Studio
  try {
    await page.goto('http://localhost:5173/mock-interview', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 600));
    // Click "Launch Proctored Interview" button
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Launch Proctored Interview')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(artifactDir, 'updated_mock_interview_voice.png'), fullPage: false });
    console.log('[CAPTURED] updated_mock_interview_voice.png');
  } catch (err) {
    console.error('Error capturing mock interview:', err);
  }

  // 2. Profile with Work Experience & Skills Matrix
  try {
    await page.goto('http://localhost:5173/profile', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(artifactDir, 'updated_profile_mastery.png'), fullPage: true });
    console.log('[CAPTURED] updated_profile_mastery.png');
  } catch (err) {
    console.error('Error capturing profile:', err);
  }

  // 3. Dashboard with About Section
  try {
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 800));
    // Scroll down to about section
    await page.evaluate(() => {
      const el = document.getElementById('about-nexora-section');
      if (el) el.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(artifactDir, 'updated_dashboard_about.png'), fullPage: false });
    console.log('[CAPTURED] updated_dashboard_about.png');
  } catch (err) {
    console.error('Error capturing dashboard about:', err);
  }

  // 4. Onboarding
  try {
    await page.goto('http://localhost:5173/onboarding', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(artifactDir, 'updated_onboarding_cta.png'), fullPage: false });
    console.log('[CAPTURED] updated_onboarding_cta.png');
  } catch (err) {
    console.error('Error capturing onboarding:', err);
  }

  // 5. Claude-inspired AI Mentor Chatbot
  try {
    await page.goto('http://localhost:5173/chatbot', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(artifactDir, 'updated_claude_mentor.png'), fullPage: false });
    console.log('[CAPTURED] updated_claude_mentor.png');
  } catch (err) {
    console.error('Error capturing chatbot:', err);
  }

  await browser.close();
  console.log('Finished all targeted screenshots.');
}

capture();
