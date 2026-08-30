const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const urls = ['http://localhost:5173/', 'http://localhost:5174/'];
  
  for (const url of urls) {
    console.log(`\n========================================`);
    console.log(`Checking URL: ${url}`);
    console.log(`========================================`);
    
    try {
      const page = await browser.newPage();
      
      // Capture console logs
      page.on('console', msg => {
        console.log(`[PAGE LOG] [${msg.type()}] ${msg.text()}`);
      });
      
      // Capture page errors
      page.on('pageerror', err => {
        console.error(`[PAGE ERROR]`, err);
      });
      
      // Capture failed requests
      page.on('requestfailed', request => {
        console.error(`[REQUEST FAILED] ${request.url()} - ${request.failure().errorText}`);
      });

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 5500 });
      
      const title = await page.title();
      console.log(`Page loaded successfully! Title: ${title}`);
      
      // Take screenshot
      const screenshotPath = path.join(__dirname, `screenshot_${url.replace(/[^a-z0-9]/gi, '_')}.png`);
      await page.screenshot({ path: screenshotPath });
      console.log(`Screenshot saved to: ${screenshotPath}`);
      
      await page.close();
    } catch (e) {
      console.error(`Error checking ${url}:`, e.message);
    }
  }
  
  await browser.close();
}

run();
