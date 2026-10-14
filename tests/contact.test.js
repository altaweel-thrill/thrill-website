const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
// Never use real credentials, CAPTCHA or SMTP during tests.
process.env.RECAPTCHA_SECRET = 'test-recaptcha-secret';
process.env.CONTACT_FORM_SECRET = 'test-form-secret';
process.env.EMAIL_USER = 'test@example.com';
process.env.EMAIL_PASS = 'test-password';
process.env.RECAPTCHA_MIN_SCORE = '0.7';
const axios = require('axios');
const nodemailer = require('nodemailer');
const originalPost = axios.post, originalTransport = nodemailer.createTransport;
const app = require('../app');
app.set('trust proxy', 'loopback');
let server, origin, tokens, ip = 1, captcha = {}, mailFailure = false;
const sent = [];
const validCaptcha = () => ({ success: true, score: 0.9, action: 'CONTACT_FORM', hostname: 'thrillagency.net', challenge_ts: new Date().toISOString(), ...captcha });

before(async () => {
  axios.post = async (url, body, options) => {
    assert.equal(url, 'https://www.google.com/recaptcha/api/siteverify');
    assert.equal(new URLSearchParams(body).get('secret'), 'test-recaptcha-secret');
    assert.equal(options.headers['Content-Type'], 'application/x-www-form-urlencoded');
    return { data: validCaptcha() };
  };
  nodemailer.createTransport = () => ({ sendMail: async mail => {
    if (mailFailure) throw Object.assign(new Error('Test SMTP failure'), { code: 'ETEST' });
    sent.push(mail);
  } });
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  tokens = await Promise.all(Array.from({ length: 15 }, async () => {
    const response = await fetch(origin + '/contact');
    assert(response.headers.get('cache-control').includes('no-store'));
    const html = await response.text();
    for (const script of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
      if (script[1].trim() && !script[0].includes('application/ld+json')) new vm.Script(script[1]);
    }
    return html.match(/name="contactFormToken" value="([^"]+)"/)[1];
  }));
  await new Promise(resolve => setTimeout(resolve, 2100));
});
after(async () => {
  axios.post = originalPost; nodemailer.createTransport = originalTransport;
  await new Promise(resolve => server.close(resolve));
});

async function submit(overrides = {}, fixedIp) {
  const fields = { name: 'Test Client', email: 'client@example.com', phone: '+966536900404', subject: 'Brand design', message: 'We need a new brand identity for our company.', locale: 'en', website: '', contactFormToken: overrides.contactFormToken ?? tokens.shift(), recaptchaToken: 'test-token', ...overrides };
  return fetch(origin + '/contact', { method: 'POST', redirect: 'manual', headers: { Accept: 'application/json', 'X-Forwarded-For': fixedIp || `192.0.2.${ip++}` }, body: new URLSearchParams(fields) });
}

test('valid Arabic enquiry sends once and redirects to Arabic thanks', async () => {
  const token = tokens[0];
  const response = await submit({ locale: 'ar' });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { redirect: '/ar/thanks' });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].replyTo, 'client@example.com');
  const replay = await submit({ contactFormToken: token, email: 'new@example.com' });
  assert.equal(replay.status, 400);
  assert.equal(sent.length, 1);
});

test('duplicate enquiries from another IP do not generate another email', async () => {
  const response = await submit();
  assert.equal(response.status, 429);
  assert((await response.json()).error.includes('already submitted'));
  assert.equal(sent.length, 1);
});

test('every required field rejects empty and whitespace-only values on the server', async () => {
  const token = tokens[0];
  const before = sent.length;
  for (const field of ['name', 'email', 'phone', 'subject', 'message']) {
    for (const value of ['', '   ']) {
      const response = await submit({ contactFormToken: token, [field]: value });
      assert.equal(response.status, 400, `${field}=${JSON.stringify(value)}`);
      assert((await response.json()).error.includes('check'), field);
    }
  }
  assert.equal(sent.length, before);
});

test('honeypots and bad fields are rejected before sending', async () => {
  assert.equal((await submit({ website: 'spam.example' })).status, 400);
  assert.equal((await submit({ email: 'not-an-email' })).status, 400);
  assert.equal(sent.length, 1);
});

test('low score, wrong action, wrong domain and expired CAPTCHA cannot send', async () => {
  for (const invalid of [{ score: 0.6 }, { action: 'LOGIN' }, { hostname: 'other.example' }, { challenge_ts: new Date(Date.now() - 180000).toISOString() }]) {
    captcha = invalid;
    assert.equal((await submit({ email: 'different@example.com' })).status, 400);
  }
  captcha = {};
  assert.equal(sent.length, 1);
});

test('SMTP failure returns a localized error and allows a fresh-token retry', async () => {
  mailFailure = true;
  const fields = { locale: 'ar', email: 'retry@example.com' };
  const failed = await submit(fields);
  assert.equal(failed.status, 503);
  const error = await failed.json();
  assert(error.error.includes('الإرسال'));
  assert(error.contactFormToken);
  mailFailure = false;
  const success = await submit(fields);
  assert.equal(success.status, 200);
  assert.equal(sent.length, 2);
});

test('IP request limit also applies to invalid requests and returns JSON', async () => {
  for (let index = 0; index < 3; index++) assert.equal((await submit({ contactFormToken: 'invalid' }, '198.51.100.1')).status, 400);
  const limited = await submit({ contactFormToken: 'invalid', locale: 'ar' }, '198.51.100.1');
  assert.equal(limited.status, 429);
  assert((await limited.json()).error.includes('تجاوز'));
  assert.equal(sent.length, 2);
});
