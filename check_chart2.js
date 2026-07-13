import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`BROWSER_${msg.type().toUpperCase()}:`, msg.text());
    }
  });
  page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));
  
  await page.goto('http://localhost:5173/');
  await new Promise(r => setTimeout(r, 1000));
  
  // Click on "Market Insights" sidebar item. It has text "Market Insights"
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const miBtn = buttons.find(b => b.textContent.includes('Market Insights'));
    if (miBtn) miBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("Checking if SVG exists...");
  const svgCount = await page.evaluate(() => {
    return document.querySelectorAll('svg.recharts-surface').length;
  });
  console.log("SVG count:", svgCount);
  
  const textContent = await page.evaluate(() => document.body.innerText);
  console.log("Page contains 'Portfolio Performance Overview':", textContent.includes('Portfolio Performance Overview'));
  
  await browser.close();
})();
