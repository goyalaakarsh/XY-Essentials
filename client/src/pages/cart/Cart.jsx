import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eci from '../../assets/undraw_empty-cart_574u.svg';
import './cart.css';
import CartProductCard from '../../components/cartproductcard/CartProductCard';

const Cart = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile/`, {
                credentials: 'include',
            });
            const data = await response.json();
            setProfile(data);

            if (!response.ok) {
                navigate('/login');
                console.error('Failed to fetch profile');
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/user/cart`, {
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched cart items:', data.cartItems);
                    setCartItems(data.cartItems);
                    const initialSelectedItems = {};
                    data.cartItems.forEach(item => {
                        initialSelectedItems[item.product._id] = true;
                    });
                    setSelectedItems(initialSelectedItems);
                } else {
                    const errorData = await response.json();
                    console.error('Failed to fetch cart:', errorData);
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${productId}`, {
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
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/${productId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const calculateSubtotal = () => {
        return cartItems
            .filter(item => selectedItems[item.product._id])
            .reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        const checkoutItems = cartItems.filter(item => selectedItems[item.product._id]);
        const totalItems = checkoutItems.reduce((total, item) => total + item.quantity, 0);
        if (checkoutItems.length === 0) {
            alert("Please select at least one item to proceed to checkout.");
            return;
        }
        if (totalItems > 10) {
            alert("You can only checkout with a maximum of 10 items (considering quantities).");
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
            <div className="con2">
                <div className="section_left_title">Cart</div>
                {cartItems.length === 0 ? (
                    <div className="empty-cart-message">
                        <h2>It’s quiet in here, shall we change that?</h2>

                        <img loading="lazy" src={eci} alt="Empty Cart Illustration" width="400" />
                        <button
                            className="shop-now-btn"
                            onClick={() => navigate('/shop')}
                        >

                            Shop Now
                            <i className="fa-solid fa-cart-shopping"></i>
                        </button>
                    </div>
                ) : (
                    <div className="cart-product-summary">
                        <div className="cart-products-con">
                            {cartItems.map((item) => (
                                <div key={item.product._id} className="cpc">
                                    <input
                                        type="checkbox"
                                        className="cart-item-checkbox"
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
                            <h3>Cart Total</h3>
                            <div className="total-con">
                                <span className='cart-price'>₹{calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <button className="checkout-button" onClick={handleCheckout}>
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;