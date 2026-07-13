import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));
  
  await page.goto('http://localhost:5173/');
  
  // Wait a bit for React to render
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("Checking if SVG exists...");
  const svgCount = await page.evaluate(() => {
    return document.querySelectorAll('.recharts-surface').length;
  });
  console.log("SVG count:", svgCount);
  
  await browser.close();
})();
