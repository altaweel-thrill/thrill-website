const crypto = require('node:crypto');

// Stores hashes only. The limits apply to this server process, as does the IP limiter.
function createContactSecurity({ secret, now = Date.now, minAgeMs = 2000, maxAgeMs = 4 * 60 * 60 * 1000, maxEntries = 10000 } = {}) {
  const consumed = new Map();
  const messages = new Map();
  const senders = new Map();
  const cooldownMs = 60 * 60 * 1000;
  const digest = value => crypto.createHash('sha256').update(value).digest('hex');
  const normalize = value => String(value).normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
  const prune = map => {
    for (const [key, value] of map) if (value.expiresAt <= now()) map.delete(key);
  };
  const sign = payload => crypto.createHmac('sha256', secret).update(payload).digest('hex');

  function issueToken() {
    if (!secret) return '';
    const payload = `${now()}.${crypto.randomBytes(24).toString('hex')}`;
    return `${payload}.${sign(payload)}`;
  }

  function isValidToken(token) {
    if (!secret || typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 3 || !/^\d{13}$/.test(parts[0]) || !/^[a-f0-9]{48}$/.test(parts[1]) || !/^[a-f0-9]{64}$/.test(parts[2])) return false;
    const age = now() - Number(parts[0]);
    if (age < minAgeMs || age > maxAgeMs) return false;
    prune(consumed);
    if (consumed.has(digest(token))) return false;
    return crypto.timingSafeEqual(Buffer.from(parts[2], 'hex'), Buffer.from(sign(parts.slice(0, 2).join('.')), 'hex'));
  }

  // Reserve synchronously before awaiting SMTP so simultaneous requests cannot both send.
  function reserve(token, fields) {
    if (!isValidToken(token)) return { error: 'invalid-token' };
    prune(messages); prune(senders);
    const tokenKey = digest(token);
    const senderKey = digest(normalize(fields.email));
    const messageKey = digest(`${senderKey}:${normalize(fields.subject)}:${normalize(fields.message)}`);
    if (messages.has(messageKey)) return { error: 'duplicate' };
    const sender = senders.get(senderKey);
    if (sender && sender.count >= 3) return { error: 'sender-limit' };
    if (consumed.size >= maxEntries || messages.size >= maxEntries || (!sender && senders.size >= maxEntries)) return { error: 'busy' };
    consumed.set(tokenKey, { expiresAt: Number(token.split('.')[0]) + maxAgeMs });
    messages.set(messageKey, { expiresAt: now() + cooldownMs });
    const updatedSender = sender || { count: 0, expiresAt: now() + cooldownMs };
    updatedSender.count++;
    senders.set(senderKey, updatedSender);
    return {
      // A transport failure permits a retry with a fresh token, never the consumed token.
      rollback() {
        messages.delete(messageKey);
        updatedSender.count--;
        if (updatedSender.count === 0) senders.delete(senderKey);
      }
    };
  }

  return { issueToken, isValidToken, reserve };
}

module.exports = { createContactSecurity };
