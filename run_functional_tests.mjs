import puppeteer from 'puppeteer-core';
import fs from 'fs';

const executablePath = fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')
  ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runTests() {
  console.log('=== NEXORA END-TO-END FUNCTIONALITY TEST SUITE ===');
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const consoleErrors = [];
  page.on('pageerror', (err) => {
    consoleErrors.push({ type: 'pageerror', message: err.message });
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push({ type: 'console.error', text: msg.text() });
    }
  });

  const results = [];

  const report = (name, passed, details = '') => {
    results.push({ name, passed, details });
    console.log(`[${passed ? 'PASS' : 'FAIL'}] ${name} ${details ? '- ' + details : ''}`);
  };

  try {
    // ----------------------------------------------------
    // TEST 1: Splash & Onboarding Functionality
    // ----------------------------------------------------
    await page.goto('http://localhost:5173/onboarding', { waitUntil: 'networkidle0' });
    const onboardingTitle = await page.$eval('h1', el => el.innerText);
    const hasOrientation = onboardingTitle.includes('Configure Your Career Trajectory');
    report('Onboarding Load', hasOrientation, `Found: "${onboardingTitle}"`);

    // Click 2nd track (Fullstack)
    const trackButtons = await page.$$('.skeuo-convex.interactive');
    if (trackButtons.length >= 2) {
      await trackButtons[1].click();
      await new Promise(r => setTimeout(r, 300));
      const activeTitle = await page.$eval('h3', el => el.innerText);
      report('Onboarding Dynamic Track Selection', activeTitle.includes('Full-Stack'), `Active preview: ${activeTitle}`);
    }

    // Click "Initialize Career Trajectory"
    const initBtn = await page.$('button.btn-primary.w-full');
    if (initBtn) {
      await initBtn.click();
      await new Promise(r => setTimeout(r, 800));
      const currentUrl = page.url();
      report('Onboarding Navigation to Signup', currentUrl.includes('/signup'), `URL: ${currentUrl}`);
    }

    // ----------------------------------------------------
    // TEST 2: Dashboard Sprint Task Toggle & State Persistence
    // ----------------------------------------------------
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
    const initialProgress = await page.evaluate(() => localStorage.getItem('nexora_task_progress'));
    
    // Find task items and click one
    const taskItems = await page.$$('.interactive.flex.items-start');
    if (taskItems.length > 0) {
      await taskItems[0].click();
      await new Promise(r => setTimeout(r, 400));
      const updatedProgress = await page.evaluate(() => localStorage.getItem('nexora_task_progress'));
      const changed = initialProgress !== updatedProgress;
      report('Dashboard Task Toggle Persistence', changed, `Progress saved to localStorage: ${updatedProgress}`);
    }

    // ----------------------------------------------------
    // TEST 3: Roadmap Workstation Dual-Pane & Track Switcher
    // ----------------------------------------------------
    await page.goto('http://localhost:5173/roadmap', { waitUntil: 'networkidle0' });
    const roadmapHeader = await page.$eval('h1', el => el.innerText);
    report('Roadmap Dual-Pane Workstation Load', roadmapHeader.includes('Track'), `Header: "${roadmapHeader}"`);

    // Switch track via select dropdown
    await page.select('select', 'fullstack');
    await new Promise(r => setTimeout(r, 500));
    const switchedHeader = await page.$eval('h1', el => el.innerText);
    report('Roadmap Track Switcher to Fullstack', switchedHeader.includes('Full Stack') || switchedHeader.includes('Fullstack'), `Header: "${switchedHeader}"`);

    // Click milestone status toggle directly on the milestone node button
    const nodeToggleBtn = await page.$('button.skeuo-well[title*="Status"]');
    if (nodeToggleBtn) {
      await nodeToggleBtn.click();
      await new Promise(r => setTimeout(r, 400));
      const savedRoadmap = await page.evaluate(() => localStorage.getItem('nexora_roadmap_prog_fullstack'));
      report('Roadmap Milestone Status Toggle & Storage', savedRoadmap !== null, `Saved state: ${savedRoadmap}`);
    }

    // Check if the mock CLI text is present
    const pageText = await page.evaluate(() => document.body.innerText);
    const hasMockCli = pageText.includes('$ nexora test');
    report('Check Mock CLI "$ nexora test" removal', !hasMockCli, hasMockCli ? 'FLAGGED: Mock CLI text still present in Roadmap' : 'CLEAN: Replaced by Milestone Practical Challenge');

    // ----------------------------------------------------
    // TEST 4: Notifications Inbox & Live In-Place Chat
    // ----------------------------------------------------
    await page.goto('http://localhost:5173/notifications', { waitUntil: 'networkidle0' });
    const notifCards = await page.$$('.skeuo-convex.interactive');
    report('Notifications List Render', notifCards.length > 0, `Loaded ${notifCards.length} notification cards`);

    if (notifCards.length >= 2) {
      await notifCards[1].click();
      await new Promise(r => setTimeout(r, 400));
      const canvasTitle = await page.$eval('h2', el => el.innerText);
      report('Notifications Canvas Selection', canvasTitle.length > 0, `Active Canvas: "${canvasTitle}"`);
    }

    // Test sending reply in notifications
    const replyInput = await page.$('input[placeholder*="Ask AI Mentor"]');
    const replySubmit = await page.$('button[type="submit"]');
    if (replyInput && replySubmit) {
      await replyInput.type('Can you elaborate on model quantization?');
      await replySubmit.click();
      await new Promise(r => setTimeout(r, 1200));
      const updatedBody = await page.evaluate(() => document.body.innerText);
      const replyAppeared = updatedBody.includes('Can you elaborate on model quantization?');
      report('In-Place AI Chat Reply in Notifications', replyAppeared, 'Reply sent and recorded');
    }

    // ----------------------------------------------------
    // TEST 5: Explore Hub & Category Routing Integrity
    // ----------------------------------------------------
    await page.goto('http://localhost:5173/explore', { waitUntil: 'networkidle0' });
    const exploreCards = await page.$$('.skeuo-card, [class*="interactive"]');
    report('Explore Page Cards Render', exploreCards.length > 5, `Found ${exploreCards.length} options`);

    // ----------------------------------------------------
    // TEST 6: Projects Page Interactivity & Enrollment
    // ----------------------------------------------------
    await page.goto('http://localhost:5173/projects', { waitUntil: 'networkidle0' });
    const projectCards = await page.$$('.skeuo-card.tactile-press');
    report('Projects List Render', projectCards.length > 0, `Found ${projectCards.length} projects`);
    if (projectCards.length > 0) {
      await projectCards[0].click();
      await new Promise(r => setTimeout(r, 600));
      const currentUrl = page.url();
      report('Project Card Click & Enrollment Flow', currentUrl.includes('/resource/'), `Navigated to: ${currentUrl}`);
    }

    // ----------------------------------------------------
    // TEST 7: Hackathons Page Interactivity & Registration
    // ----------------------------------------------------
    await page.goto('http://localhost:5173/hackathons', { waitUntil: 'networkidle0' });
    const regButtons = await page.$$('button.hackathon-register-btn');
    report('Hackathons Buttons Render', regButtons.length > 0, `Found ${regButtons.length} hackathon action buttons`);
    if (regButtons.length > 0) {
      await regButtons[0].click();
      await new Promise(r => setTimeout(r, 500));
      const buttonText = await page.evaluate(el => el.innerText, regButtons[0]);
      report('Hackathon Registration Click Action', buttonText.includes('Registered') || buttonText.includes('Join'), `Status: "${buttonText}"`);
    }

    // ----------------------------------------------------
    // TEST 8: Resource Viewer Dynamic Loading & Sandbox Tab
    // ----------------------------------------------------
    await page.goto('http://localhost:5173/resource/ds_1_1', { waitUntil: 'networkidle0' });
    const resTitle = await page.$eval('h1', el => el.innerText);
    report('Resource Viewer Dynamic Lookup (ds_1_1)', resTitle.length > 0, `Title: "${resTitle}"`);

    const tabs = await page.$$('button.tab-pill');
    if (tabs.length >= 2) {
      await tabs[1].click(); // Sandbox tab
      await new Promise(r => setTimeout(r, 300));
      const codeSnippet = await page.$('pre');
      report('Resource Viewer Interactive Sandbox Tab', codeSnippet !== null, 'Code sandbox rendered');
    }

    // ----------------------------------------------------
    // TEST 9: AI Tools (Resume, Mock Interview, Chatbot)
    // ----------------------------------------------------
    await page.goto('http://localhost:5173/resume', { waitUntil: 'networkidle0' });
    const resumeHeading = await page.$eval('h1', el => el.innerText).catch(() => 'Missing');
    report('Resume Analyzer Route (/resume)', resumeHeading !== 'Missing', `Header: "${resumeHeading}"`);

    await page.goto('http://localhost:5173/mock-interview', { waitUntil: 'networkidle0' });
    const interviewHeading = await page.$eval('h1', el => el.innerText).catch(() => 'Missing');
    report('Mock Interview Route (/mock-interview)', interviewHeading !== 'Missing', `Header: "${interviewHeading}"`);

    await page.goto('http://localhost:5173/chatbot', { waitUntil: 'networkidle0' });
    const chatbotInput = await page.$('input, textarea');
    report('AI Chatbot Route (/chatbot)', chatbotInput !== null, 'Chatbot input available');

    // ----------------------------------------------------
    // TEST 10: Console and Runtime Errors Summary
    // ----------------------------------------------------
    const severeErrors = consoleErrors.filter(e => !e.text?.includes('favicon') && !e.message?.includes('favicon'));
    report('Console Error Audit', severeErrors.length === 0, `${severeErrors.length} severe console errors detected`);
    if (severeErrors.length > 0) {
      console.log('Console Errors:', severeErrors);
    }

  } catch (err) {
    console.error('Fatal test error:', err);
    report('Test Execution Crash', false, err.message);
  } finally {
    await browser.close();
  }

  // Save report to file
  const reportPath = 'C:\\Users\\dell\\.gemini\\antigravity-ide\\brain\\2bbdc123-e427-427d-93c7-55303de990f1\\scratch\\test_results.json';
  fs.writeFileSync(reportPath, JSON.stringify({ results, consoleErrors }, null, 2));
  console.log('Test execution finished. Results saved to:', reportPath);
}

runTests();
