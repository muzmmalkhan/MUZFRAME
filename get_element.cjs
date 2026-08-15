const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  
  await page.type('input[type="email"]', 'khuzaimarashid5511@gmail.com');
  await page.type('input[type="password"]', 'client'); // wait, the db has no password, let's just click login
  // Actually, I don't know the login credentials. The default for ClientDashboard might redirect if not logged in.
  
  // Just dump the HTML of ClientDashboard directly.
  await browser.close();
})();
