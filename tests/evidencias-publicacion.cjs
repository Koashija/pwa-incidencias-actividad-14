const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const APP = 'https://koashija.github.io/pwa-incidencias-actividad-14/';
const REPO = 'https://api.github.com/repos/Koashija/pwa-incidencias-actividad-14';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const out = path.resolve(__dirname, '..', 'evidencias');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: CHROME });
  const context = await browser.newContext({ viewport: { width: 1365, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.setDefaultNavigationTimeout(20000);

  await page.goto(REPO, { waitUntil: 'commit', timeout: 20000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(out, '08-repositorio-github.png'), fullPage: false });
  console.log('Repositorio capturado.');

  await page.goto(REPO + '/deployments', { waitUntil: 'commit', timeout: 20000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(out, '09-despliegue-github-pages.png'), fullPage: false });
  console.log('Despliegue capturado.');

  await page.setViewportSize({ width: 412, height: 915 });
  await page.goto(APP, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(out, '10-pwa-publicada-instalable.png'), fullPage: true });
  console.log('PWA pública capturada.');

  const cdp = await context.newCDPSession(page);
  const manifest = await cdp.send('Page.getAppManifest');
  const installability = await cdp.send('Page.getInstallabilityErrors');
  fs.writeFileSync(path.join(out, 'instalabilidad.json'), JSON.stringify({ url: APP, manifest, installability }, null, 2));

  await browser.close();
  console.log('Evidencias reales del repositorio, despliegue, PWA pública e instalabilidad creadas.');
})().catch(error => { console.error(error); process.exit(1); });
