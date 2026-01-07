const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'orders',
    password: process.env.DB_PASSWORD || 'password',
    port: 5432,
});

async function initDB() {
    let retries = 5;
    while (retries > 0) {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS orders (
                    id SERIAL PRIMARY KEY,
                    user_id VARCHAR(50) NOT NULL,
                    total_amount DECIMAL(10,2) NOT NULL,
                    status VARCHAR(20) DEFAULT 'PENDING',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    items JSONB
                )
            `);
            console.log('Orders table created/verified');
            break;
        } catch (err) {
            console.error('Error init DB, retrying...', err.message);
            retries--;
            await new Promise(res => setTimeout(res, 3000));
        }
    }
}
initDB();

// GET Orders for User
app.get('/api/v1/orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST Create Order
app.post('/api/v1/orders', async (req, res) => {
    try {
        const { userId, totalAmount, items } = req.body;

        // In a real system, you would validate stock here or listen to an event

        const result = await pool.query(
            'INSERT INTO orders (user_id, total_amount, items) VALUES ($1, $2, $3) RETURNING *',
            [userId, totalAmount, JSON.stringify(items)]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Order service running on port ${port}`);
});

