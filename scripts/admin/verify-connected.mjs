import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

// Run only against an isolated local preview connected to the intended test database.
// Supply the password through stdin; never store it in this file or command output.
export async function verifyConnected(password, base = 'http://127.0.0.1:3005') {
  assert.equal(new URL(base).hostname, '127.0.0.1');
  let cookie = '', csrf = '', state, baselineId, temporaryPassword;
  const report = [];
  const pass = (name) => { report.push(name); console.log(`PASS ${name}`); };
  async function request(path, body, method = 'POST', extra = {}) {
    const headers = { Origin: base, Cookie: cookie, 'x-csrf-token': csrf, ...extra };
    if (body && !(body instanceof FormData)) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(body); }
    return fetch(base + path, { method, headers, body, redirect: 'manual' });
  }
  async function json(path, body, method) {
    const response = await request(path, body, method);
    const data = await response.json();
    assert.equal(response.status, 200, `${method || 'POST'} ${path}: ${JSON.stringify(data)}`);
    if (data.state) state = data.state;
    return data;
  }
  async function login(value) {
    const r = await request('/api/admin/login', { password: value });
    assert.equal(r.status, 200, 'login succeeds');
    const setCookie = r.headers.get('set-cookie');
    assert.match(setCookie, /HttpOnly/i); assert.match(setCookie, /SameSite=strict/i);
    cookie = setCookie.split(';')[0];
    const html = await (await request('/admin', undefined, 'GET')).text();
    csrf = html.match(/\\?"csrf\\?":\\?"([a-f0-9]{64})/)?.[1];
    assert.ok(csrf, 'authenticated page provides CSRF token');
  }
  const publish = () => json('/api/admin/publishing', { action: 'publish', version: state.version });
  const publicPage = async path => { const r = await fetch(base + path); return { status: r.status, html: await r.text() }; };
  const mediaFile = await readFile('public/images/lawn.webp');
  const makeUpload = (target, source = '') => {
    const form = new FormData();
    for (const [k, v] of Object.entries({ document: '/hakkimizda/', target, source, version: String(state.version), alt: 'Panel bağlantı kontrolü' })) form.set(k, v);
    form.set('file', new File([mediaFile], 'garden.webp', { type: 'image/webp' }));
    return form;
  };
  try {
    assert.equal((await request('/api/admin/content', undefined, 'GET')).status, 401);
    assert.equal((await request('/api/admin/login', { password }, 'POST', { Origin: 'https://invalid.example' })).status, 403);
    assert.equal((await request('/api/admin/login', { password: 'incorrect-verification-password' })).status, 401);
    await login(password);
    pass('Server authentication, origin protection and secure session cookie');
    let { registry } = await json('/api/admin/content', undefined, 'GET');
    if (state.draft.hasChanges) await json('/api/admin/publishing', { action: 'discard', version: state.version });
    await publish();
    baselineId = (await json('/api/admin/publishing', undefined, 'GET')).history[0].id;
    const page = registry.documents.find(p => p.id === '/hakkimizda/');
    const key = page.fields.find(f => registry.texts[f.id] === 'Gültekin').id;
    const marker = 'Gültekin kontrol ' + Date.now();
    const body = { document: page.id, version: state.version, changes: { [key]: marker } };
    assert.equal((await request('/api/admin/content', body, 'PATCH', { 'x-csrf-token': '' })).status, 403);
    await json('/api/admin/content', body, 'PATCH');
    assert.equal((await request('/api/admin/content', body, 'PATCH')).status, 409);
    assert.ok(!(await publicPage('/hakkimizda')).html.includes(marker));
    await json('/api/admin/content', undefined, 'GET');
    assert.equal(state.pageMedia[page.id].texts[key], marker);
    await publish();
    assert.ok((await publicPage('/hakkimizda')).html.includes(marker));
    pass('Draft persistence/isolation, stale-write conflict, immediate publication');
    await json('/api/admin/publishing', { action: 'restore', id: baselineId, version: state.version });
    assert.ok((await publicPage('/hakkimizda')).html.includes(marker));
    await publish();
    assert.ok(!(await publicPage('/hakkimizda')).html.includes(marker));
    pass('History restores into a private draft, then publishes');

    const source = page.images[0];
    await json('/api/admin/media', makeUpload('slot', source));
    const media = state.pageMedia[page.id].images[source];
    assert.ok(media.variants.length >= 2);
    const downloaded = await fetch(media.url);
    assert.equal(downloaded.status, 200); assert.match(downloaded.headers.get('content-type'), /image\/webp/);
    assert.ok(!state.pageMedia['/']?.images?.[source]);
    const mediaChange = (action, target = 'slot', selected = source) => json('/api/admin/media', { document: page.id, target, source: selected, version: state.version, action }, 'PATCH');
    await mediaChange('remove'); assert.equal(state.pageMedia[page.id].images[source], null);
    await mediaChange('reset'); assert.equal(state.pageMedia[page.id].images[source], undefined);
    await json('/api/admin/media', makeUpload('gallery'));
    await json('/api/admin/media', makeUpload('gallery'));
    const ids = state.pageMedia[page.id].gallery.map(i => i.id);
    await mediaChange('left', 'gallery', ids[1]);
    assert.equal(state.pageMedia[page.id].gallery[0].id, ids[1]);
    for (const id of ids) await mediaChange('remove', 'gallery', id);
    await json('/api/admin/content', undefined, 'GET');
    assert.deepEqual(state.pageMedia[page.id].gallery, []);
    pass('Real Blob upload, responsive WebP, page isolation, removal/reset and gallery order');

    const blogId = randomUUID(), title = 'Panel deneme yazısı ' + Date.now();
    function blogForm(name, cover = false) {
      const f = new FormData();
      for (const [k, v] of Object.entries({ id: blogId, version: String(state.version), title: name, body: 'Bu içerik yalnızca yönetim panelinin yayın akışını doğrulamak için hazırlanmıştır.\n\nKontrol tamamlandığında kaldırılır.' })) f.set(k, v);
      if (cover) f.set('cover', new File([mediaFile], 'cover.webp', { type: 'image/webp' }));
      return f;
    }
    const { entry } = await json('/api/admin/blog', blogForm(title, true));
    assert.equal((await publicPage('/blog/' + entry.slug)).status, 404);
    await publish();
    const article = await publicPage('/blog/' + entry.slug);
    assert.equal(article.status, 200); assert.ok(article.html.includes(title));
    assert.ok((await publicPage('/sitemap.xml')).html.includes(entry.slug));
    const edited = await json('/api/admin/blog', blogForm(title + ' düzenlendi'), 'PATCH');
    assert.equal(edited.entry.slug, entry.slug);
    await publish();
    assert.ok((await publicPage('/blog/' + entry.slug)).html.includes(title + ' düzenlendi'));
    await json('/api/admin/blog', { id: blogId, version: state.version }, 'DELETE');
    await publish();
    assert.equal((await publicPage('/blog/' + entry.slug)).status, 404);
    pass('Blog draft, new live route without deployment, sitemap, edit and removal');

    temporaryPassword = randomUUID() + 'Aa*';
    await json('/api/admin/password', { currentPassword: password, newPassword: temporaryPassword, confirmPassword: temporaryPassword });
    assert.equal((await request('/api/admin/content', undefined, 'GET')).status, 401);
    await login(temporaryPassword);
    await json('/api/admin/password', { currentPassword: temporaryPassword, newPassword: password, confirmPassword: password });
    temporaryPassword = undefined;
    await login(password);
    pass('Password changes revoke existing sessions; requested initial password restored');
  } finally {
    if (temporaryPassword) {
      await login(temporaryPassword);
      await json('/api/admin/password', { currentPassword: temporaryPassword, newPassword: password, confirmPassword: password });
      await login(password);
    }
    if (baselineId) {
      await json('/api/admin/content', undefined, 'GET');
      await json('/api/admin/publishing', { action: 'restore', id: baselineId, version: state.version });
      await publish();
    }
    if (cookie) { await json('/api/admin/logout', {}); assert.equal((await request('/api/admin/content', undefined, 'GET')).status, 401); }
  }
  pass('Original content restored and logout revokes server session');
  return report;
}
