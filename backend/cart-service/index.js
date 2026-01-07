const express = require('express');
const Redis = require('ioredis');
const app = express();
const port = 3000;

app.use(express.json());

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

const redis = new Redis({
    host: redisHost,
    port: redisPort
});

redis.on('connect', () => console.log('Connected to Redis'));
redis.on('error', (err) => console.error('Redis Error:', err));

// GET Cart items for a user
app.get('/api/v1/cart/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await redis.hgetall(`cart:${userId}`);

        // Convert string quantities to numbers
        for (const key in cart) {
            cart[key] = parseInt(cart[key]);
        }

        res.json({ userId, cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST Add item to cart
app.post('/api/v1/cart/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({ error: 'ProductId and quantity required' });
        }

        // Increment quantity in Redis Hash
        await redis.hincrby(`cart:${userId}`, productId, quantity);

        res.json({ message: 'Item added to cart', productId, quantity });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Remove item from cart
app.delete('/api/v1/cart/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        await redis.hdel(`cart:${userId}`, productId);
        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Clear entire cart
app.delete('/api/v1/cart/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        await redis.del(`cart:${userId}`);
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Cart service running on port ${port}`);
});


