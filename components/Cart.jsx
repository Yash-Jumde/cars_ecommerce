import React from 'react';
import Link from 'next/link';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { toast } from 'react-hot-toast';

import { useStateContext } from '../context/StateContext';
import { useAuth } from '../context/AuthContext'; // Import auth context
import { urlFor } from '../lib/client';

const Cart = () => {
  const { totalPrice, totalQuantities, cartItems, setShowCart, toggleCartItemQuanitity, onRemove, makePayment, paymentLoading } = useStateContext();
  const { currentUser } = useAuth(); // Get current user

  const handleCheckout = () => {
    makePayment();
  };

  return (
    <div className="cart-wrapper">
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}>
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>

        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="btn"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">
          {cartItems.length >= 1 && cartItems.map((item) => (
            <div className="product" key={item._id}>
              <img src={urlFor(item?.image[0])} className="cart-product-image" />
              <div className="item-desc">
                <div className="flex top">
                  <h5>{item.name}</h5>
                  <h4>₹ {item.price}</h4>
                </div>
                <div className="flex bottom">
                  <div>
                    <p className="quantity-desc">
                      <span className="minus" onClick={() => toggleCartItemQuanitity(item._id, 'decrement') }>
                        <AiOutlineMinus />
                      </span>
                      <span className="num">{item.quantity}</span>
                      <span className="plus" onClick={() => toggleCartItemQuanitity(item._id, 'increment') }>
                        <AiOutlinePlus />
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="remove-item"
                    onClick={() => onRemove(item)}
                  >
                    <TiDeleteOutline />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>₹ {totalPrice}</h3>
            </div>
            <div className="btn-container">
              <button 
                type="button" 
                className="btn" 
                onClick={handleCheckout}
                disabled={paymentLoading}
              >
                {paymentLoading ? 'Processing...' : (currentUser ? 'Pay Now' : 'Login to Checkout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart;
