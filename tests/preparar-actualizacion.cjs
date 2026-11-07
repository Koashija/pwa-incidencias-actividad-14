const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const APP = 'https://koashija.github.io/pwa-incidencias-actividad-14/';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const root = path.resolve(__dirname, '..');
const evidence = path.join(root, 'evidencias');
const profile = path.join(evidence, 'perfil-actualizacion');

(async () => {
  const context = await chromium.launchPersistentContext(profile, { headless: true, executablePath: CHROME, viewport: { width: 412, height: 915 } });
  const page = context.pages()[0] || await context.newPage();
  await page.goto(APP, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  if ((await page.textContent('#version')).trim() !== 'Versión 1.0.0') throw new Error('La versión inicial pública no es 1.0.0');

  await page.click('button[data-v="new"]');
  await page.fill('#t', 'Dato local conservado entre versiones');
  await page.fill('#d', 'Registro utilizado para comprobar que IndexedDB no se borra al actualizar.');
  await page.click('#save');
  await page.waitForSelector('text=Dato local conservado entre versiones');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(evidence, '11-version-inicial-dato-local.png'), fullPage: true });

  const cdp = await context.newCDPSession(page);
  const manifest = await cdp.send('Page.getAppManifest');
  const installability = await cdp.send('Page.getInstallabilityErrors');
  fs.writeFileSync(path.join(evidence, 'instalabilidad.json'), JSON.stringify({ url: APP, manifest, installability }, null, 2));

  await context.close();
  console.log('Perfil persistente preparado con versión 1.0.0 y un dato local.');
})().catch(error => { console.error(error); process.exit(1); });
