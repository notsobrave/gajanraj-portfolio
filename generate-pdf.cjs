const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  const htmlPath = path.join(__dirname, 'cv.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  
  await page.pdf({
    path: 'CV_Gajanraj_Mohanaraj.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  
  await browser.close();
  console.log('✓ PDF generated: CV_Gajanraj_Mohanaraj.pdf');
})();