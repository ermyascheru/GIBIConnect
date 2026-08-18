const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { full_name, email, password } = req.body;
    try {
        if (!full_name || !email || !password) {
            return res.status(400).json({ message: 'Full name, email, and password are required' });
        }

        const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await db.query(
            `INSERT INTO users (full_name, email, password_hash, role, status)
             VALUES ($1, $2, $3, 'user', 'active')
             RETURNING id, full_name, email, role, status, created_at`,
            [full_name, email, passwordHash]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser.rows[0]
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error during registration', error: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.status !== 'active') {
            return res.status(403).json({ message: 'Account is inactive or suspended' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'supersecretkey',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error during login', error: err.message });
    }
};

const getMe = async (req, res) => {
    try {
        const userResult = await db.query(
            'SELECT id, full_name, email, role, status, created_at FROM users WHERE id = $1',
            [req.user.id]
        );
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(userResult.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error fetching user profile', error: err.message });
    }
};

module.exports = { register, login, getMe };