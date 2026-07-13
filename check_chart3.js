import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/');
  await new Promise(r => setTimeout(r, 1000));
  
  // Click on "Market Insights"
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const miBtn = buttons.find(b => b.textContent.includes('Market Insights'));
    if (miBtn) miBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const chartBox = await page.evaluate(() => {
    const svg = document.querySelector('svg.recharts-surface');
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });
  
  console.log("Chart SVG dimensions:", chartBox);
  
  const linesBox = await page.evaluate(() => {
    const lines = Array.from(document.querySelectorAll('.recharts-line-curve'));
    return lines.map(line => line.getAttribute('d'));
  });
  
  console.log("Line paths:", linesBox.length);
  if (linesBox.length > 0) {
    console.log("First line path starts with:", linesBox[0] ? linesBox[0].substring(0, 30) : 'null');
  }
  
  await browser.close();
})();
