const { test } = require('node:test');
const assert = require('node:assert');
const authorizeRoles = require('../../backend/src/middleware/role.middleware');
const { createMockReq, createMockRes } = require('./helpers/mock');

test('authorizeRoles throws when called without any roles', () => {
    assert.throws(() => authorizeRoles(), /at least one role/i);
});

test('returns 401 when req.user is missing (authenticate not run)', () => {
    const req = createMockReq();
    const res = createMockRes();
    let nextCalled = false;

    authorizeRoles('admin')(req, res, () => { nextCalled = true; });

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(nextCalled, false);
    assert.strictEqual(res.body.error.code, 'UNAUTHORIZED');
});

test('returns 403 when the user role is not allowed', () => {
    const req = createMockReq({ user: { id: 'user-1', role: 'user' } });
    const res = createMockRes();
    let nextCalled = false;

    authorizeRoles('admin')(req, res, () => { nextCalled = true; });

    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(nextCalled, false);
    assert.strictEqual(res.body.error.code, 'FORBIDDEN');
    assert.match(res.body.error.message, /admin/);
});

test('calls next() when the user role is allowed', () => {
    const req = createMockReq({ user: { id: 'admin-1', role: 'admin' } });
    const res = createMockRes();
    let nextCalled = false;

    authorizeRoles('admin')(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
});

test('allows any of the listed roles', () => {
    for (const role of ['moderator', 'admin']) {
        const req = createMockReq({ user: { id: `${role}-1`, role } });
        const res = createMockRes();
        let nextCalled = false;

        authorizeRoles('moderator', 'admin')(req, res, () => { nextCalled = true; });

        assert.strictEqual(nextCalled, true, `expected ${role} to be authorized`);
    }
});

test('accepts roles passed as a flat array', () => {
    const req = createMockReq({ user: { id: 'mod-1', role: 'moderator' } });
    const res = createMockRes();
    let nextCalled = false;

    authorizeRoles(['moderator', 'admin'])(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
});

test('rejects a guest role even when other roles are allowed', () => {
    const req = createMockReq({ user: { id: 'guest-1', role: 'guest' } });
    const res = createMockRes();

    authorizeRoles('user', 'moderator', 'admin')(req, res, () => {});

    assert.strictEqual(res.statusCode, 403);
});
