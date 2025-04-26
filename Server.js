Server.js                                                                                                                                                                                                                                                   Here's an example of a complete server.js file:


const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
    user: 'your_username',
    host: 'your_host',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

// Middleware
app.use(express.json());

// User registration
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, email, hashedPassword, address, role]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// User login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, 'your_secret_key', {
            expiresIn: '1h',
        });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Store creation
app.post('/stores', authenticateToken, async (req, res) => {
    try {
        const { name, email, address } = req.body;
        const ownerId = req.user.userId;
        const result = await pool.query(
            'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, address, ownerId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating store' });
    }
});

// Rating submission
app.post('/stores/:storeId/ratings', authenticateToken, async (req, res) => {
    try {
        const storeId = req.params.storeId;
        const userId = req.user.userId;
        const { rating } = req.body;
        const result = await pool.query(
            'INSERT INTO ratings (store_id, user_id, rating) VALUES ($1, $2, $3) RETURNING *',
            [storeId, userId, rating]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error submitting rating' });
    }
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied' });
    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
}

// Start server
const port = 3000;
app.listen(port, () => {
    console.log(Server listening on port ${port});
});


// Make sure to replace placeholders like your_username, your_host, your_database, your_password, and your_secret_key with your actual credentials and secret key.