const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const userRepo = require('../src/repositories/user.repository');
const app = require('../src/app');

// In-memory database mock for user repository
let usersTable = [];
let idCounter = 1;

// Override userRepo methods to use in-memory state during tests
userRepo.findUserByEmail = async (email) => {
    return usersTable.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};

userRepo.findUserById = async (id) => {
    const u = usersTable.find(user => user.id === id);
    if (!u) return null;
    return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        created_at: u.created_at
    };
};

userRepo.createUser = async (userData) => {
    const newUser = {
        id: idCounter++,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'user',
        created_at: new Date().toISOString()
    };
    usersTable.push(newUser);
    return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        created_at: newUser.created_at
    };
};

describe('Authentication & Authorization API Suite', () => {
    beforeEach(() => {
        usersTable = [];
        idCounter = 1;
    });

    // 1. Successful registration
    test('1. Successful user registration (POST /api/auth/register)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Elsabeth Cheru',
                email: 'elsabeth@example.com',
                password: 'password123'
            });

        assert.equal(res.status, 201);
        assert.equal(res.body.error, null);
        assert.equal(res.body.data.name, 'Elsabeth Cheru');
        assert.equal(res.body.data.email, 'elsabeth@example.com');
        assert.equal(res.body.data.role, 'user');
        assert.equal(res.body.data.password, undefined);
        assert.equal(res.body.data.password_hash, undefined);
    });

    // 2. Duplicate registration
    test('2. Duplicate user registration (POST /api/auth/register)', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Elsabeth Cheru',
                email: 'elsabeth@example.com',
                password: 'password123'
            });

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Elsabeth Duplicate',
                email: 'elsabeth@example.com',
                password: 'password456'
            });

        assert.equal(res.status, 409);
        assert.equal(res.body.data, null);
        assert.equal(res.body.error.code, 'EMAIL_IN_USE');
        assert.equal(res.body.error.message, 'A user with this email already exists');
    });

    // 3. Invalid registration data
    test('3. Invalid registration data (POST /api/auth/register)', async () => {
        const resMissingPassword = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'invalid-email-format'
            });

        assert.equal(resMissingPassword.status, 400);
        assert.equal(resMissingPassword.body.error.code, 'VALIDATION_ERROR');

        const resShortPassword = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'valid@example.com',
                password: '123'
            });

        assert.equal(resShortPassword.status, 400);
        assert.equal(resShortPassword.body.error.code, 'VALIDATION_ERROR');
    });

    // 4. Successful login
    test('4. Successful user login (POST /api/auth/login)', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Elsabeth Cheru',
                email: 'elsabeth@example.com',
                password: 'password123'
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'elsabeth@example.com',
                password: 'password123'
            });

        assert.equal(res.status, 200);
        assert.equal(res.body.error, null);
        assert.equal(typeof res.body.data.token, 'string');
        assert.equal(res.body.data.user.email, 'elsabeth@example.com');
        assert.equal(res.body.data.user.role, 'user');
        assert.equal(res.body.data.user.password, undefined);
    });

    // 5. Wrong password
    test('5. Login with wrong password (POST /api/auth/login)', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Elsabeth Cheru',
                email: 'elsabeth@example.com',
                password: 'password123'
            });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'elsabeth@example.com',
                password: 'wrongpassword'
            });

        assert.equal(res.status, 401);
        assert.equal(res.body.data, null);
        assert.equal(res.body.error.code, 'UNAUTHORIZED');
        assert.equal(res.body.error.message, 'Invalid email or password');
    });

    // 6. Nonexistent email
    test('6. Login with nonexistent email (POST /api/auth/login)', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'password123'
            });

        assert.equal(res.status, 401);
        assert.equal(res.body.data, null);
        assert.equal(res.body.error.code, 'UNAUTHORIZED');
        assert.equal(res.body.error.message, 'Invalid email or password');
    });

    // 7. Protected route with no token
    test('7. Protected route access without token (GET /api/auth/me)', async () => {
        const res = await request(app)
            .get('/api/auth/me');

        assert.equal(res.status, 401);
        assert.equal(res.body.data, null);
        assert.equal(res.body.error.code, 'UNAUTHORIZED');
        assert.equal(res.body.error.message, 'Access denied. No token provided.');
    });

    // 8. Protected route with invalid token
    test('8. Protected route access with invalid token (GET /api/auth/me)', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', 'Bearer invalid.token.value');

        assert.equal(res.status, 401);
        assert.equal(res.body.data, null);
        assert.equal(res.body.error.code, 'UNAUTHORIZED');
        assert.equal(res.body.error.message, 'Invalid token.');
    });

    // 9. Protected route with valid token
    test('9. Protected route access with valid token (GET /api/auth/me)', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Elsabeth Cheru',
                email: 'elsabeth@example.com',
                password: 'password123'
            });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'elsabeth@example.com',
                password: 'password123'
            });

        const token = loginRes.body.data.token;

        const meRes = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);

        assert.equal(meRes.status, 200);
        assert.equal(meRes.body.error, null);
        assert.equal(meRes.body.data.email, 'elsabeth@example.com');
        assert.equal(meRes.body.data.name, 'Elsabeth Cheru');
    });

    // 10. Admin-only route with normal user
    test('10. Admin-only route access with normal user token (GET /api/auth/admin-only)', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Normal User',
                email: 'user@example.com',
                password: 'password123',
                role: 'user'
            });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'user@example.com',
                password: 'password123'
            });

        const userToken = loginRes.body.data.token;

        const adminRes = await request(app)
            .get('/api/auth/admin-only')
            .set('Authorization', `Bearer ${userToken}`);

        assert.equal(adminRes.status, 403);
        assert.equal(adminRes.body.data, null);
        assert.equal(adminRes.body.error.code, 'FORBIDDEN');
        assert.equal(adminRes.body.error.message, 'Forbidden: Insufficient permissions');
    });

    // 11. Admin-only route with admin user
    test('11. Admin-only route access with admin token (GET /api/auth/admin-only)', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                name: 'System Admin',
                email: 'admin@example.com',
                password: 'adminpassword123',
                role: 'admin'
            });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@example.com',
                password: 'adminpassword123'
            });

        const adminToken = loginRes.body.data.token;

        const adminRes = await request(app)
            .get('/api/auth/admin-only')
            .set('Authorization', `Bearer ${adminToken}`);

        assert.equal(adminRes.status, 200);
        assert.equal(adminRes.body.error, null);
        assert.equal(adminRes.body.data.message, 'Welcome to the Admin Dashboard');
        assert.equal(adminRes.body.data.user.role, 'admin');
    });
});
