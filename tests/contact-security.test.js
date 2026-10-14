const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createContactSecurity } = require('../lib/contact-security');
const fields = { email: 'client@example.com', subject: 'Brand project', message: 'We would like a brand identity for our business.' };
function fixture(options = {}) {
  let time = 1800000000000;
  const security = createContactSecurity({ secret: 'test-secret', now: () => time, ...options });
  return { security, advance: ms => { time += ms; } };
}

test('signed tokens are unique, expire, reject tampering and cannot be replayed', () => {
  const { security, advance } = fixture();
  const token = security.issueToken();
  assert.notEqual(token, security.issueToken());
  assert.equal(security.isValidToken(token), false);
  advance(2001);
  assert.equal(security.isValidToken(token), true);
  assert.equal(security.isValidToken(token.slice(0, -1) + (token.endsWith('0') ? '1' : '0')), false);
  assert.equal(security.isValidToken('1800000000000.' + 'a'.repeat(64)), false);
  assert.equal(security.reserve(token, fields).error, undefined);
  assert.equal(security.reserve(token, fields).error, 'invalid-token');
  const expired = security.issueToken();
  advance(4 * 60 * 60 * 1000 + 1);
  assert.equal(security.isValidToken(expired), false);
});

test('duplicate messages normalize spacing and sender case; different clients remain allowed', () => {
  const { security, advance } = fixture();
  const tokens = Array.from({ length: 4 }, () => security.issueToken());
  advance(2001);
  security.reserve(tokens[0], fields);
  assert.equal(security.reserve(tokens[1], { ...fields, email: 'CLIENT@example.com', message: '  We would like a brand identity  for our business.  ' }).error, 'duplicate');
  assert.equal(security.reserve(tokens[2], { ...fields, email: 'another@example.com' }).error, undefined);
  advance(60 * 60 * 1000 + 1);
  assert.equal(security.reserve(tokens[3], fields).error, undefined);
});

test('sender limit applies to different messages and resets after one hour', () => {
  const { security, advance } = fixture();
  const tokens = Array.from({ length: 5 }, () => security.issueToken());
  advance(2001);
  for (let index = 0; index < 3; index++) assert.equal(security.reserve(tokens[index], { ...fields, message: fields.message + index }).error, undefined);
  assert.equal(security.reserve(tokens[3], { ...fields, message: fields.message + 'new' }).error, 'sender-limit');
  advance(60 * 60 * 1000 + 1);
  assert.equal(security.reserve(tokens[4], { ...fields, message: fields.message + 'new' }).error, undefined);
});

test('SMTP rollback permits a fresh retry but does not reactivate a used token', () => {
  const { security, advance } = fixture();
  const first = security.issueToken(), second = security.issueToken();
  advance(2001);
  const reservation = security.reserve(first, fields);
  assert.equal(security.reserve(second, fields).error, 'duplicate');
  reservation.rollback();
  assert.equal(security.reserve(first, fields).error, 'invalid-token');
  assert.equal(security.reserve(second, fields).error, undefined);
});

test('missing secret fails closed and storage remains bounded', () => {
  assert.equal(createContactSecurity().issueToken(), '');
  const { security, advance } = fixture({ maxEntries: 1 });
  const first = security.issueToken(), second = security.issueToken();
  advance(2001);
  security.reserve(first, fields);
  assert.equal(security.reserve(second, { ...fields, email: 'another@example.com' }).error, 'busy');
});
