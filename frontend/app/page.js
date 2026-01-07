'use client';
import { useState, useEffect } from 'react';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState('');
    const userId = 'test_user_frontend'; // Hardcoded for PoC

    useEffect(() => {
        fetch('/api/v1/catalog')
            .then(res => res.json())
            .then(data => setProducts(data.products || []))
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    const addToCart = async (product) => {
        try {
            const res = await fetch(`/api/v1/cart/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product._id || product.id,
                    quantity: 1
                })
            });
            if (res.ok) {
                setMessage(`Added ${product.name} to cart!`);
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage('Failed to add to cart');
            }
        } catch (err) {
            console.error(err);
            setMessage('Error adding to cart');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Murugan Retail Store</h1>
                <a href="/cart" style={{ padding: '10px 20px', background: 'green', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                    Go to Cart
                </a>
            </div>

            {message && <div style={{ padding: '10px', background: '#d4edda', color: '#155724', marginBottom: '20px', borderRadius: '4px' }}>{message}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {products.map(product => (
                    <div key={product._id || product.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p><strong>Category:</strong> {product.category}</p>
                        <p style={{ color: 'green', fontWeight: 'bold' }}>${product.price}</p>
                        <button
                            onClick={() => addToCart(product)}
                            style={{ background: '#0070f3', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}


