import puppeteer from 'puppeteer-core';
import fs from 'fs';

const executablePath = fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')
  ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const routesToTest = [
  { path: '/', name: 'Splash Page' },
  { path: '/onboarding', name: 'Onboarding Workstation' },
  { path: '/login', name: 'Login' },
  { path: '/signup', name: 'Signup' },
  { path: '/forgot-password', name: 'Forgot Password' },
  { path: '/complete-profile', name: 'Complete Profile' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/explore', name: 'Explore Hub' },
  { path: '/roadmap', name: 'Career Roadmap' },
  { path: '/profile', name: 'Profile & Mastery' },
  { path: '/career-goal', name: 'Career Goal' },
  { path: '/assessments', name: 'Assessments' },
  { path: '/skill-gap', name: 'Skill Gap Analysis' },
  { path: '/resources', name: 'Learning Resources' },
  { path: '/resume', name: 'Resume Analyzer' },
  { path: '/mock-interview', name: 'Mock Interview' },
  { path: '/colleges', name: 'Top Colleges' },
  { path: '/notifications', name: 'Notifications & Alerts' },
  { path: '/quiz', name: 'Daily Quiz' },
  { path: '/progress', name: 'Progress Tracking' },
  { path: '/achievements', name: 'Achievements' },
  { path: '/settings', name: 'Settings' },
  { path: '/settings/notifications', name: 'Notification Settings' },
  { path: '/settings/privacy', name: 'Privacy Settings' },
  { path: '/settings/language', name: 'Language Settings' },
  { path: '/help', name: 'Help & Docs' },
  { path: '/about', name: 'About Platform' },
  { path: '/chatbot', name: 'AI Mentor Chatbot' },
  { path: '/jobs', name: 'Jobs & Internships' },
  { path: '/scholarships', name: 'Scholarships' },
  { path: '/peer-learning', name: 'Peer Learning & Community' },
  { path: '/task/1', name: 'Task Deep Dive (/task/1)' },
  { path: '/resource/fs_1_1', name: 'Resource Viewer (/resource/fs_1_1)' },
  { path: '/notification/notif_1', name: 'Notification Detail (/notification/notif_1)' },
  { path: '/subscription', name: 'Subscription Plan' },
  { path: '/projects', name: 'Hands-On Projects' },
  { path: '/hackathons', name: 'Hackathons Hub' },
  { path: '/admin/login', name: 'Admin Login' },
  { path: '/admin/dashboard', name: 'Admin Dashboard' },
  { path: '/admin/students', name: 'Admin Students' },
  { path: '/admin/paths', name: 'Admin Paths' },
  { path: '/admin/resources', name: 'Admin Resources' },
  { path: '/admin/reports', name: 'Admin Reports' },
  { path: '/admin/notifications', name: 'Admin Notifications' },
];

async function runDeepAudit() {
  console.log('=== STARTING NEXORA COMPREHENSIVE PLATFORM DEEP AUDIT ===');
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const auditLog = [];
  const pageErrors = {};

  page.on('pageerror', (err) => {
    const currentUrl = page.url();
    if (!pageErrors[currentUrl]) pageErrors[currentUrl] = [];
    pageErrors[currentUrl].push({ type: 'pageerror', message: err.message });
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const currentUrl = page.url();
      if (!pageErrors[currentUrl]) pageErrors[currentUrl] = [];
      pageErrors[currentUrl].push({ type: 'console.error', text: msg.text() });
    }
  });

  for (const route of routesToTest) {
    const url = `http://localhost:5173${route.path}`;
    const result = { route: route.path, name: route.name, status: 'UNKNOWN', details: [] };

    try {
      const response = await page.goto(url, { waitUntil: 'networkidle0', timeout: 8000 });
      const httpStatus = response ? response.status() : 'No Response';

      // Check if redirected unexpectedly
      const actualUrl = page.url();
      const redirected = !actualUrl.includes(route.path) && route.path !== '/';

      // Check page content
      const bodyText = await page.evaluate(() => document.body.innerText.trim());
      const hasHeading = await page.$('h1, h2, h3') !== null;
      const buttonsCount = (await page.$$('button, a.btn')).length;
      const inputsCount = (await page.$$('input, select, textarea')).length;

      // Check for broken image elements
      const brokenImages = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src);
      });

      // Check for raw unrendered template placeholders or error text
      const hasUndefinedText = bodyText.includes('undefined') || bodyText.includes('NaN') || bodyText.includes('[object Object]');

      result.httpStatus = httpStatus;
      result.redirectedTo = redirected ? actualUrl : null;
      result.bodyLength = bodyText.length;
      result.hasHeading = hasHeading;
      result.buttonsCount = buttonsCount;
      result.inputsCount = inputsCount;
      result.brokenImages = brokenImages;
      result.hasUndefinedText = hasUndefinedText;

      if (redirected) {
        result.status = 'REDIRECTED';
        result.details.push(`Redirected to: ${actualUrl}`);
      } else if (bodyText.length < 50) {
        result.status = 'EMPTY_PAGE';
        result.details.push(`Body text is almost empty (${bodyText.length} chars)`);
      } else if (brokenImages.length > 0) {
        result.status = 'BROKEN_IMAGES';
        result.details.push(`Broken images: ${brokenImages.join(', ')}`);
      } else if (hasUndefinedText) {
        result.status = 'GLITCH_TEXT';
        result.details.push('Found "undefined" or "NaN" in rendered text');
      } else {
        result.status = 'PASS';
      }

      console.log(`[${result.status}] ${route.path} (${route.name}) - ${bodyText.length} chars, ${buttonsCount} btns, ${inputsCount} inputs`);
    } catch (e) {
      result.status = 'CRASH_TIMEOUT';
      result.error = e.message;
      console.log(`[FAIL] ${route.path} - ${e.message}`);
    }

    auditLog.push(result);
  }

  await browser.close();

  fs.writeFileSync('audit_results.json', JSON.stringify({ auditLog, pageErrors }, null, 2));
  console.log('Deep audit complete. Results saved to audit_results.json');
}

runDeepAudit();
