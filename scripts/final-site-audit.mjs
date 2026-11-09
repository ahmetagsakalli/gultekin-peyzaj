import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const base = (process.argv[2] || 'https://gultekin-peyzaj.vercel.app').replace(/\/$/, '');
const output = process.argv[3] || 'docs/final-qa-2026-11-09/routes.json';
const report = { base, checkedAt: new Date().toISOString(), pages: [], failures: [], assets: [], security: [] };
const check = (condition, message) => { if (!condition) report.failures.push(message); };
const get = (url, options) => fetch(url, { signal: AbortSignal.timeout(30000), ...options });
const sitemapResponse = await get(`${base}/sitemap.xml`);
check(sitemapResponse.ok, 'Sitemap failed');
const sitemap = new JSDOM(await sitemapResponse.text(), { contentType: 'text/xml' }).window.document;
const paths = [...new Set([...sitemap.querySelectorAll('loc')].map(n => new URL(n.textContent).pathname))];
check(paths.length >= 11, 'Expected at least 11 public pages');
const documents = new Map(), titles = new Set(), descriptions = new Set(), assetUrls = new Set();
for (const path of paths) {
  const response = await get(base + path);
  const html = await response.text();
  const dom = new JSDOM(html, { url: base + path });
  const doc = dom.window.document;
  documents.set(path.replace(/\/$/, '') || '/', doc);
  const title = doc.title;
  const description = doc.querySelector('meta[name="description"]')?.content;
  const canonical = doc.querySelector('link[rel="canonical"]')?.href;
  const headings = [...doc.querySelectorAll('h1')].map(n => n.textContent.trim());
  check(response.status === 200, `${path}: HTTP ${response.status}`);
  check(doc.documentElement.lang === 'tr', `${path}: missing Turkish lang`);
  check(headings.length === 1 && headings[0], `${path}: expected one h1`);
  check(title && !titles.has(title), `${path}: missing/duplicate title`); titles.add(title);
  check(description && !descriptions.has(description), `${path}: missing/duplicate description`); descriptions.add(description);
  check(canonical && new URL(canonical).pathname.replace(/\/$/, '') === path.replace(/\/$/, ''), `${path}: incorrect canonical`);
  check(!/noindex/.test(doc.querySelector('meta[name="robots"]')?.content || ''), `${path}: public page is noindex`);
  check(!!doc.querySelector('meta[property="og:image"]')?.content, `${path}: missing sharing image`);
  if (path === '/') check(doc.querySelector('header')?.classList.contains('header-home'), 'Home header style missing after regeneration');
  if (['/', '/hizmetler', '/hakkimizda', '/blog', '/iletisim'].includes(path.replace(/\/$/, '') || '/')) {
    check(!!doc.querySelector('header a[aria-current="page"]'), `${path}: missing current navigation link`);
  }
  for (const node of doc.querySelectorAll('script[type="application/ld+json"]')) {
    try { JSON.parse(node.textContent); } catch { check(false, `${path}: invalid structured data`); }
  }
  const body = doc.body.cloneNode(true); body.querySelectorAll('script,style').forEach(n=>n.remove());
  check(!/0541\s*283|905412837015|lorem ipsum|Panel deneme yazısı|Panel bağlantı kontrolü|QA kontrolü|Yayın öncesi deneme yazısı/i.test(body.textContent), `${path}: outdated phone or test content`);
  for (const image of doc.querySelectorAll('img')) {
    check(image.hasAttribute('alt'), `${path}: image without alt`);
    const src = image.getAttribute('src'); if (src && !src.startsWith('data:')) assetUrls.add(new URL(src, base).href);
  }
  for (const link of doc.querySelectorAll('a[href]')) {
    const url = new URL(link.getAttribute('href'), base + path);
    if (url.protocol === 'tel:') check(url.href === 'tel:+905459512353', `${path}: wrong phone ${url.href}`);
    if (url.hostname === 'wa.me') check(url.pathname === '/905459512353', `${path}: wrong WhatsApp`);
    if (link.target === '_blank') check(link.rel.includes('noopener'), `${path}: unsafe new-tab link`);
  }
  report.pages.push({ path, status: response.status, title, description, canonical, h1: headings[0], images: doc.images.length });
}
for (const [path, doc] of documents) {
  for (const link of doc.querySelectorAll('a[href]')) {
    const url = new URL(link.getAttribute('href'), base + path);
    if (url.origin !== base) continue;
    const targetPath = url.pathname.replace(/\/$/, '') || '/';
    const target = documents.get(targetPath);
    check(!!target, `${path}: unknown internal link ${url.pathname}`);
    if (target && url.hash) check(!!target.getElementById(decodeURIComponent(url.hash.slice(1))), `${path}: missing anchor ${url.pathname}${url.hash}`);
  }
}
for (const url of assetUrls) {
  const response = await get(url, { method: 'HEAD' });
  check(response.ok && /image\//.test(response.headers.get('content-type') || ''), `Image failed: ${url}`);
  report.assets.push({ url, status: response.status, type: response.headers.get('content-type'), bytes: response.headers.get('content-length') });
}
for (const path of ['/this-page-does-not-exist', '/blog/this-post-does-not-exist']) {
  const response = await get(base + path); check(response.status === 404, `${path}: expected HTTP 404`);
}
const robots = await (await get(base + '/robots.txt')).text();
check(robots.includes('Disallow: /admin') && robots.includes('Disallow: /api/'), 'Admin routes missing robots protection');
for (const path of ['/api/admin/content', '/api/admin/publishing']) {
  const response = await get(base + path); check(response.status === 401, `${path}: anonymous access allowed`);
  report.security.push({ path, status: response.status });
}
const admin = await get(base + '/admin');
check(/noindex/.test(admin.headers.get('x-robots-tag') || ''), 'Admin missing noindex header');
check(admin.headers.get('x-frame-options') === 'DENY', 'Admin missing frame protection');
await mkdir(output.slice(0, output.lastIndexOf('/')), { recursive: true });
await writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pages: report.pages.length, assets: report.assets.length, failures: report.failures }, null, 2));
assert.equal(report.failures.length, 0, 'Site audit found issues; see JSON report');
