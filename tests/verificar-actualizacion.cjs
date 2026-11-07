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
  await page.waitForTimeout(2500);
  await page.evaluate(async () => (await navigator.serviceWorker.ready).update());
  await page.waitForSelector('#update:not([hidden])', { timeout: 20000 });
  await page.screenshot({ path: path.join(evidence, '12-actualizacion-disponible.png'), fullPage: true });

  await page.click('#update');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);
  if ((await page.textContent('#version')).trim() !== 'Versión 1.1.0') throw new Error('No se activó la versión 1.1.0');
  if (!(await page.locator('text=Dato local conservado entre versiones').count())) throw new Error('El dato local se perdió durante la actualización');
  const caches = await page.evaluate(() => caches.keys());
  if (!caches.includes('alerta-campus-v7')) throw new Error('La caché v7 no está activa');
  await page.screenshot({ path: path.join(evidence, '13-version-actualizada-datos-conservados.png'), fullPage: true });
  fs.writeFileSync(path.join(evidence, 'actualizacion.json'), JSON.stringify({ version: '1.1.0', cache: 'alerta-campus-v7', datoLocalConservado: true, url: APP }, null, 2));

  await context.close();
  console.log('APROBADO: actualización 1.1.0, caché v7 y conservación de IndexedDB.');
})().catch(error => { console.error(error); process.exit(1); });
