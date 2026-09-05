import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const executablePath = fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')
  ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const pagesToCapture = [
  { url: 'http://localhost:5173/resume', name: 'updated_resume_analyzer' },
  { url: 'http://localhost:5173/mock-interview', name: 'updated_mock_interview' },
  { url: 'http://localhost:5173/quiz', name: 'updated_daily_quiz' },
  { url: 'http://localhost:5173/skill-gap', name: 'updated_skill_gap' },
  { url: 'http://localhost:5173/career-goal', name: 'updated_career_goal' },
  { url: 'http://localhost:5173/assessments', name: 'updated_ai_assessment' },
  { url: 'http://localhost:5173/jobs', name: 'updated_jobs' },
  { url: 'http://localhost:5173/scholarships', name: 'updated_scholarships' },
  { url: 'http://localhost:5173/peer-learning', name: 'updated_peer_nexus' },
  { url: 'http://localhost:5173/colleges', name: 'updated_colleges' },
  { url: 'http://localhost:5173/task/1', name: 'updated_task_page' }
];

async function capture() {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const artifactDir = 'C:\\Users\\dell\\.gemini\\antigravity-ide\\brain\\2bbdc123-e427-427d-93c7-55303de990f1\\screenshots';
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  for (const item of pagesToCapture) {
    try {
      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, 600));
      const filePath = path.join(artifactDir, `${item.name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`[CAPTURED] ${item.name} -> ${filePath}`);
    } catch (err) {
      console.error(`[ERROR] ${item.name}: ${err.message}`);
    }
  }

  await browser.close();
  console.log('Finished capturing screenshots.');
}

capture();
