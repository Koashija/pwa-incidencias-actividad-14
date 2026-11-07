const { chromium } = require('playwright');

const URL = process.env.APP_URL || 'http://localhost:3000';
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: CHROME });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  console.log('APROBADO: carga inicial y navegación.');
  if (!(await page.title()).includes('Alerta Campus')) throw new Error('Título incorrecto');

  await page.click('button[data-v="new"]');
  await page.fill('#t', 'Prueba funcional automatizada');
  await page.fill('#d', 'Registro creado para validar el CRUD');
  await page.click('label[for="p2"]');
  await page.click('#save');
  await page.waitForSelector('text=Prueba funcional automatizada');
  console.log('APROBADO: alta y consulta.');

  await page.click('button[data-a="edit"]');
  await page.fill('#t', 'Prueba funcional editada');
  await page.click('#save');
  await page.waitForSelector('text=Prueba funcional editada');
  console.log('APROBADO: edición.');

  await page.click('button[data-a="del"]');
  await page.click('#yes');
  await page.waitForSelector('text=No hay incidencias en esta vista.');
  console.log('APROBADO: eliminación.');

  const sw = await page.evaluate(async () => Boolean(await navigator.serviceWorker.ready));
  if (!sw) throw new Error('Service Worker no disponible');
  console.log('APROBADO: Service Worker activo.');

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('text=Alerta Campus');
  await page.click('button[data-v="new"]');
  await page.fill('#t', 'Registro sin conexión');
  await page.click('#save');
  await page.waitForSelector('text=Registro sin conexión');

  if (errors.length) throw new Error('Errores de página: ' + errors.join(' | '));
  console.log('APROBADO: navegación, alta, consulta, edición, eliminación, Service Worker y modo offline.');
  await browser.close();
})().catch(error => { console.error('NO APROBADO:', error); process.exit(1); });
