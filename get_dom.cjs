const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  
  // login
  await page.type('input[type="email"]', 'khuzaimarashid5511@gmail.com');
  await page.type('input[type="password"]', 'client'); // wait, password? Let me try 'client' or something
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  
  // get html
  const content = await page.content();
  const fs = require('fs');
  fs.writeFileSync('dom.html', content);
  
  await browser.close();
})();
