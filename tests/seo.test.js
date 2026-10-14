const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const http = require('node:http');
const fs = require('node:fs');
const { SITE_URL, pages, sitemapPaths, getSeo } = require('../lib/seo');
const app = require('../app');
let server, origin;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise(resolve => server.close(resolve)));

const attribute = (html, key) => [...html.matchAll(new RegExp(`<meta[^>]+(?:name|property)="${key}"[^>]+content="([^"]*)"`, 'g'))].map(match => match[1]);

test('every public page renders unique metadata, a main heading and valid structured data', async () => {
  const titles = new Set(), descriptions = new Set();
  for (const route of sitemapPaths) {
    const response = await fetch(origin + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description = attribute(html, 'description');
    assert(title && !titles.has(title), `Missing or duplicated title: ${route}`);
    assert.equal(description.length, 1, route);
    assert(description[0] && !descriptions.has(description[0]), `Missing or duplicated description: ${route}`);
    titles.add(title); descriptions.add(description[0]);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `Main heading: ${route}`);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1, route);
    assert(html.includes(`rel="canonical" href="${SITE_URL}${route}"`), route);
    assert(!html.includes('noindex'), route);
    const data = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(data['@context'], 'https://schema.org');
    assert(data['@graph'].some(item => item['@type'] === 'WebPage' && item.url === SITE_URL + route), route);
    if (getSeo(route).alternates) {
      const variants = getSeo(route).alternates;
      assert(html.includes(`hreflang="en" href="${variants.en}"`), route);
      assert(html.includes(`hreflang="ar" href="${variants.ar}"`), route);
      const switchPath = new URL(route.startsWith('/ar') ? variants.en : variants.ar).pathname;
      assert(html.includes(`href="${switchPath}" lang="${route.startsWith('/ar') ? 'en' : 'ar'}"`), route);
    }
    const imagePath = decodeURI(new URL(getSeo(route).image).pathname);
    assert(fs.existsSync(path.join(__dirname, '../public', imagePath)), `Missing sharing image: ${route}`);
  }
});

test('sitemap contains every indexable route and reciprocal language alternates', async () => {
  const response = await fetch(origin + '/sitemap.xml');
  assert.equal(response.status, 200);
  assert(response.headers.get('content-type').includes('application/xml'));
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.equal(new Set(urls).size, urls.length);
  assert.deepEqual(urls.sort(), sitemapPaths.map(route => SITE_URL + route).sort());
  assert(!urls.some(url => /\/(thanks|card)$/.test(url)));
  assert(xml.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'));
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const url = block[1].match(/<loc>([^<]+)<\/loc>/)[1];
    const variants = getSeo(new URL(url).pathname).alternates;
    if (variants) for (const [language, href] of Object.entries({ ...variants, 'x-default': variants.en })) {
      assert(block[1].includes(`hreflang="${language}" href="${href}"`), url);
    }
  }
});

test('thank-you, empty card and missing pages cannot be indexed', async () => {
  for (const route of ['/thanks', '/ar/thanks', '/card', '/missing-page', '/ar/missing-page']) {
    const response = await fetch(origin + route);
    assert.equal(response.status, route.includes('missing') ? 404 : 200);
    const html = await response.text();
    assert.deepEqual(attribute(html, 'robots'), ['noindex, follow'], route);
    assert(!html.includes('rel="canonical"'), route);
    assert(!html.includes('application/ld+json'), route);
  }
});

test('known URLs normalize casing and trailing slashes while preserving queries', async () => {
  for (const route of ['/ABOUT/', '/ar/ETLAQ/', '/service/']) {
    const response = await fetch(origin + route + '?utm_source=test', { redirect: 'manual' });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), route.toLowerCase().replace(/\/+$/, '') + '?utm_source=test');
  }
  const response = await fetch(origin + '/about?utm_source=test');
  assert((await response.text()).includes(`rel="canonical" href="${SITE_URL}/about"`));
});

test('production host redirect and robots sitemap remain correct', async () => {
  const response = await new Promise((resolve, reject) => {
    http.get(origin + '/about?source=test', { headers: { Host: 'www.thrillagency.net' } }, res => {
      res.resume();
      res.once('end', () => resolve(res));
    }).once('error', reject);
  });
  assert.equal(response.statusCode, 301);
  assert.equal(response.headers.location, SITE_URL + '/about?source=test');
  const robots = await (await fetch(origin + '/robots.txt')).text();
  assert(robots.includes('Allow: /'));
  assert(robots.includes('Sitemap: ' + SITE_URL + '/sitemap.xml'));
  // Every catalog page has a route, including intentionally unindexed utility pages.
  const routes = app._router.stack.filter(layer => layer.route).map(layer => layer.route.path);
  for (const route of Object.keys(pages)) assert(routes.includes(route), `Missing route: ${route}`);
});
