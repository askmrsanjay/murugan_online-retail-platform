const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/catalog';

// Connect to MongoDB
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    category: String,
    stock: Number
});

const Product = mongoose.model('Product', productSchema);

// GET all products
app.get('/api/v1/catalog', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({
            service: 'Catalog Service',
            status: 'Active',
            count: products.length,
            products: products
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new product (for seeding/testing)
app.post('/api/v1/catalog', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Seed Initial Data if empty
async function seedData() {
    const count = await Product.countDocuments();
    if (count === 0) {
        console.log('Seeding initial data...');
        await Product.create([
            { name: 'Smartphone X', price: 999, description: 'High-end smartphone', category: 'Electronics', stock: 50 },
            { name: 'Wireless Headphones', price: 199, description: 'Noise cancelling', category: 'Electronics', stock: 100 },
            { name: 'Running Shoes', price: 89, description: 'Comfortable running shoes', category: 'Apparel', stock: 20 }
        ]);
        console.log('Data seeded.');
    }
}
// Wait for connection to open then seed
mongoose.connection.once('open', seedData);

app.listen(port, () => {
    console.log(`Catalog service running on port ${port}`);
});


