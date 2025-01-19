import React, { useState } from 'react';
import './productcard.css';
import { Link } from 'react-router-dom';
import Toast from '../toast/Toast';

const ProductCard = ({ product }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const [buttonVisible, setButtonVisible] = useState(true);
  const [message, setMessage] = useState('');

  const handleAddToCart = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials for cookie
        body: JSON.stringify({
          productId: product._id, // Ensure your product has an _id field
          quantity: 1, // You can modify this to allow user to choose quantity
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }

      const data = await response.json();
      console.log('Product added to cart:', data);
      setMessage('Added to cart');
      setButtonVisible(false);

      // Reset message and show button after 6 seconds
      setTimeout(() => {
        setMessage('');
        setButtonVisible(true);
      }, 6000);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  // const showToast (() => {
  //   <Toast action={action} message={message} show={buttonVisible} onClose={() => setButtonVisible(false)} />
  // })

  return (
    <div className="home-product-item">
      <Link to={`/products/${product._id}`} target="_blank" rel="noopener noreferrer" key={product._id}>
        <div className="home-product-img">
          <img src={product.images[0]} alt={product.name} />
        </div>
      </Link>
      <div className="home-product-details">
        <Link to={`/products/${product._id}`} key={product._id}>
          <div className="h-product-title">
            {product.name.length > 40 ? `${product.name.substring(0, 40)}...` : product.name}
          </div>
        </Link>
        <div className="h-product-subtitle">
          {product.description.length > 60 ? `${product.description.substring(0, 60)}...` : product.description}
        </div>
        <div className="h-product-price-cart">
          <div className="h-product-prices">
            <div className="h-p-price">
              ₹{product.price}
            </div>
          </div>
        </div>
        <div className="h-p-cart-btn">
          {message ? (
            <span>{message}</span>
          ) : (
            <button onClick={handleAddToCart}>
              <i className="fas fa-cart-plus"></i>
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
