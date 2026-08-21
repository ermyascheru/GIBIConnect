process.env.JWT_SECRET = process.env.JWT_SECRET || 'elsa-test-secret-key-for-unit-tests';

const { test } = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');
const authenticate = require('../../backend/src/middleware/auth.middleware');
const { optionalAuthenticate } = require('../../backend/src/middleware/auth.middleware');
const { createMockReq, createMockRes } = require('./helpers/mock');

const SECRET = process.env.JWT_SECRET;

function signToken(payload, options) {
    return jwt.sign(payload, SECRET, options);
}

test('authenticate returns 401 when no Authorization header is present', () => {
    const req = createMockReq();
    const res = createMockRes();
    let nextCalled = false;

    authenticate(req, res, () => { nextCalled = true; });

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(nextCalled, false);
    assert.strictEqual(res.body.error.code, 'UNAUTHORIZED');
    assert.strictEqual(res.body.data, null);
    assert.ok(res.body.meta.timestamp);
});

test('authenticate returns 401 when Authorization header is not Bearer scheme', () => {
    const req = createMockReq({ headers: { authorization: 'Basic abc123' } });
    const res = createMockRes();

    authenticate(req, res, () => {});

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.error.code, 'UNAUTHORIZED');
});

test('authenticate returns 401 for an invalid token', () => {
    const req = createMockReq({ headers: { authorization: 'Bearer not-a-real-token' } });
    const res = createMockRes();

    authenticate(req, res, () => {});

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.error.message, 'Invalid or expired token.');
});

test('authenticate returns 401 for an expired token with a clear message', () => {
    const token = signToken({ id: 'user-1', role: 'user' }, { expiresIn: '-10s' });
    const req = createMockReq({ headers: { authorization: `Bearer ${token}` } });
    const res = createMockRes();

    authenticate(req, res, () => {});

    assert.strictEqual(res.statusCode, 401);
    assert.match(res.body.error.message, /expired/i);
});

test('authenticate calls next() and attaches decoded user for a valid token', () => {
    const token = signToken({ id: 'user-1', role: 'admin' }, { expiresIn: '1h' });
    const req = createMockReq({ headers: { authorization: `Bearer ${token}` } });
    const res = createMockRes();
    let nextCalled = false;

    authenticate(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(req.user.id, 'user-1');
    assert.strictEqual(req.user.role, 'admin');
});

test('optionalAuthenticate continues without a user when no header is present', () => {
    const req = createMockReq();
    const res = createMockRes();
    let nextCalled = false;

    optionalAuthenticate(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(req.user, undefined);
    assert.strictEqual(res.statusCode, null);
});

test('optionalAuthenticate attaches the user for a valid token', () => {
    const token = signToken({ id: 'mod-1', role: 'moderator' }, { expiresIn: '1h' });
    const req = createMockReq({ headers: { authorization: `Bearer ${token}` } });
    const res = createMockRes();
    let nextCalled = false;

    optionalAuthenticate(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(req.user.role, 'moderator');
});

test('optionalAuthenticate swallows invalid tokens and continues anonymously', () => {
    const req = createMockReq({ headers: { authorization: 'Bearer garbage-token' } });
    const res = createMockRes();
    let nextCalled = false;

    optionalAuthenticate(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(req.user, undefined);
});
