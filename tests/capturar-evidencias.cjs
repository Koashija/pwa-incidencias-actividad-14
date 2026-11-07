const { chromium } = require('playwright');
const path = require('path');

const URL = process.env.APP_URL || 'http://localhost:3000/index.html';
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const out = path.resolve(__dirname, '..', 'evidencias');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: CHROME });
  const context = await browser.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  await page.screenshot({ path: path.join(out, '01-inicio-pwa.png'), fullPage: true });

  await page.click('button[data-v="new"]');
  await page.fill('#t', 'Fuga de agua en laboratorio');
  await page.fill('#d', 'Se detectó una fuga junto al lavabo del laboratorio B.');
  await page.click('label[for="p3"]');
  await page.screenshot({ path: path.join(out, '02-formulario-validado.png'), fullPage: true });
  await page.click('#save');
  await page.waitForSelector('text=Fuga de agua en laboratorio');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(out, '03-registro-consulta.png'), fullPage: true });

  await page.click('button[data-a="edit"]');
  await page.fill('#t', 'Fuga de agua atendida');
  await page.click('#save');
  await page.waitForSelector('text=Fuga de agua atendida');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(out, '04-edicion-aplicada.png'), fullPage: true });

  await context.setOffline(true);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(out, '05-modo-sin-conexion.png'), fullPage: true });
  await page.click('button[data-v="new"]');
  await page.fill('#t', 'Incidencia registrada sin conexión');
  await page.fill('#d', 'Prueba de persistencia local con la red desactivada.');
  await page.click('#save');
  await page.waitForSelector('text=Incidencia registrada sin conexión');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(out, '06-almacenamiento-offline.png'), fullPage: true });
  await context.setOffline(false);

  const report = 'file:///' + path.resolve(out, 'lighthouse-final.report.html').replace(/\\/g, '/');
  await page.goto(report, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(out, '07-reporte-lighthouse.png'), fullPage: false });

  await browser.close();
  console.log('Capturas reales creadas desde la PWA y el reporte Lighthouse.');
})().catch(error => { console.error(error); process.exit(1); });
