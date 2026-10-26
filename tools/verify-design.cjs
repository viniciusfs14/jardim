'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'artifacts', 'redesign');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const server = http.createServer(async (req, res) => {
  try {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
    if (target !== root && !target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    const data = await fs.readFile(target);
    res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' });
    res.end(data);
  } catch { res.writeHead(404).end(); }
});
(async () => {
  await fs.mkdir(output, { recursive: true });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = 'http://127.0.0.1:' + server.address().port;
  let browser;
  try {
    browser = await chromium.launch({ executablePath: process.env.SARA_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    for (const width of [1440, 900, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: width > 700 ? 1000 : 844 }, isMobile: width < 700, hasTouch: width < 700, reducedMotion: width === 320 ? 'reduce' : 'no-preference' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const checkWidth = async name => {
        const sizes = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, viewport: innerWidth }));
        assert.ok(sizes.content <= sizes.viewport + 1, name + ': horizontal overflow ' + JSON.stringify(sizes));
      };
      await checkWidth('intro/' + width);
      await page.screenshot({ path: path.join(output, 'intro-' + width + '.png'), fullPage: true });
      await page.locator('#enter').click();
      await page.locator('#garden').waitFor({ state: 'visible' });
      if (await page.locator('#pingoListen').getAttribute('aria-pressed') === 'true') await page.locator('#pingoListen').click();
      await checkWidth('garden/' + width);
      await page.screenshot({ path: path.join(output, 'garden-' + width + '.png'), fullPage: true });
      await page.locator('#hiddenFlower').click();
      assert.equal(await page.locator('#hiddenFlower').getAttribute('aria-expanded'), 'true');
      for (const action of ['water', 'sun', 'butterfly', 'note']) {
        const tool = page.locator('[data-action="' + action + '"]');
        const bounds = await tool.boundingBox();
        assert.ok(bounds.width >= 44 && bounds.height >= 44, action + ': small touch target');
        await tool.click();
      }
      assert.equal(await page.locator('#count').textContent(), '4 / 4');
      await page.locator('#openLetter').waitFor({ state: 'visible' });
      await page.locator('#openLetter').click();
      await page.locator('#modalOk').waitFor({ state: 'visible' });
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'closeModal');
      await page.keyboard.press('Shift+Tab');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'modalOk');
      await page.keyboard.press('Escape');
      await page.locator('#modal').waitFor({ state: 'hidden' });
      await page.screenshot({ path: path.join(output, 'flourished-' + width + '.png'), fullPage: true });
      await page.locator('#finalButton').click();
      await page.locator('#farewell').waitFor({ state: 'visible' });
      await page.locator('#openFinalLetter').click();
      await page.locator('#finale').waitFor({ state: 'visible' });
      await checkWidth('letter/' + width);
      await page.locator('.keepsake-preview img').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => { const image = document.querySelector('.keepsake-preview img'); return image.complete && image.naturalWidth > 0; });
      await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({ path: path.join(output, 'letter-' + width + '.png'), fullPage: true });
      assert.equal(await page.locator('.download-card').getAttribute('download'), 'um-girassol-para-Sara.png');
      await page.locator('#backGarden').click();
      await page.locator('#restart').click();
      await page.locator('#intro').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#count').textContent(), '0 / 4');
      assert.deepEqual(errors, [], 'browser errors');
      console.log('PASS ' + width + 'px: layout, actions, modal keyboard, finale, PNG and restart');
      await page.close();
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
