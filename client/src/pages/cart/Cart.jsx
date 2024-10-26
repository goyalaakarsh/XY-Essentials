import React, { useEffect, useState } from 'react';
import './cart.css';
import CartProductCard from '../../components/cartproductcard/CartProductCard';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/cart', {
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setCartItems(data.cartItems);
                    const initialSelectedItems = {};
                    data.cartItems.forEach(item => {
                        initialSelectedItems[item.product._id] = true; // Set to true by default
                    });
                    setSelectedItems(initialSelectedItems);
                } else {
                    console.error('Failed to fetch cart:', await response.json());
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        fetchCart();
    }, []);

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (response.ok) {
                setCartItems((prevItems) =>
                    prevItems.map((item) =>
                        item.product._id === productId ? { ...item, quantity: newQuantity } : item
                    )
                );
            } else {
                console.error('Failed to update quantity:', await response.json());
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
            } else {
                console.error('Failed to remove item:', await response.json());
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const totalPrice = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    const handleCheckout = () => {
        const checkoutItems = cartItems.filter(item => selectedItems[item.product._id]);
        if (checkoutItems.length === 0) {
            alert("Please select at least one item to proceed to checkout.");
            return;
        }
        navigate('/checkout', { state: { checkoutItems } });
    };

    const handleCheckboxChange = (productId) => {
        setSelectedItems((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };

    return (
        <div className="cart">
            <div className="section container">
                <div className="home-pro-head">
                    <div className="section_left_title">
                        <strong>Cart</strong>
                    </div>
                </div>
                <hr />
            </div>

            <div className="cart-product-summary container">
                <div className="cart-products-con">
                    {cartItems.map((item) => (
                        <div key={item.product._id}>
                            <input
                                type="checkbox"
                                checked={!!selectedItems[item.product._id]}
                                onChange={() => handleCheckboxChange(item.product._id)}
                            />
                            <CartProductCard 
                                product={item.product} 
                                quantity={item.quantity}
                                onUpdateQuantity={updateQuantity}
                                onRemoveFromCart={removeFromCart}
                            />
                        </div>
                    ))}
                </div>
                <div className="cart-summary-con">
                    <h3>Order Summary</h3>
                    <p>Total Price: ${totalPrice.toFixed(2)}</p>
                    <button className="checkout-button" onClick={handleCheckout}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;