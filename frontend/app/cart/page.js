'use client';
import { useState, useEffect } from 'react';

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [message, setMessage] = useState('');
    const userId = 'test_user_frontend';

    const fetchCart = async () => {
        try {
            const res = await fetch(`/api/v1/cart/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setCart(data.cart || {});
            }
        } catch (err) {
            console.error('Error fetching cart:', err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const checkout = async () => {
        try {
            const items = Object.entries(cart).map(([productId, qty]) => ({ productId, qty: parseInt(qty) }));
            if (items.length === 0) return;

            // Simplified Mock Total (In reality, we'd fetch prices from Catalog to calc total)
            const totalAmount = items.length * 100;

            const res = await fetch('/api/v1/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    totalAmount,
                    items
                })
            });

            if (res.ok) {
                const order = await res.json();

                // Clear the remote cart
                await fetch(`/api/v1/cart/${userId}`, { method: 'DELETE' });

                setMessage(`Order Placed Successfully! Order ID: ${order.id}`);
                setCart({}); // Clear local state
            } else {
                setMessage('Checkout failed');
            }
        } catch (err) {
            console.error(err);
            setMessage('Error during checkout');
        }
    };

    if (!cart) return <div>Loading Cart...</div>;

    const cartItems = Object.entries(cart);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Your Cart</h1>
            <a href="/" style={{ display: 'block', marginBottom: '20px', color: '#0070f3' }}>&larr; Back to Shop</a>

            {message && <div style={{ padding: '10px', background: '#d4edda', color: '#155724', marginBottom: '20px', borderRadius: '4px' }}>{message}</div>}

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {cartItems.map(([productId, qty]) => (
                            <li key={productId} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                                <strong>Product ID:</strong> {productId} <br />
                                <strong>Quantity:</strong> {qty}
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={checkout}
                        style={{ background: 'green', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', marginTop: '20px' }}
                    >
                        Checkout (Place Order)
                    </button>
                </>
            )}
        </div>
    );
}


