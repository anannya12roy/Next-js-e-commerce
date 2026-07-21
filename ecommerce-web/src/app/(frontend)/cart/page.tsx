"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Cart.module.css';

// Initial dummy cart data
const initialCartItems = [
  {
    id: 1,
    productId: 1,
    name: 'Minimalist Chair',
    price: 120.00,
    image: '/images/prod1.jpg?v=2',
    color: 'Oatmeal',
    size: 'One Size',
    quantity: 2
  },
  {
    id: 2,
    productId: 2,
    name: 'Ceramic Table Lamp',
    price: 85.00,
    image: '/images/prod2.jpg?v=2',
    color: 'White',
    size: 'Standard',
    quantity: 1
  }
];

export default function CartPage() {
  const [items, setItems] = useState(initialCartItems);
  
  const updateQuantity = (id: number, newQty: number) => {
    if (newQty < 1) return;
    setItems(items.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };
  
  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 15.00 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.main}>
          <div className={styles.emptyCart}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptySubtitle}>Looks like you haven't added anything to your cart yet.</p>
            <Link href="/shop" className={styles.shopNowBtn}>
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your Cart</h1>
          <p className={styles.subtitle}>{items.length} items in your cart</p>
        </div>

        <div className={styles.content}>
          {/* Left Column: Cart Items */}
          <div className={styles.cartItems}>
            <div className={styles.cartList}>
              {items.map(item => (
                <div key={item.id} className={styles.cartItem}>
                  <Link href={`/product/${item.name.toLowerCase().replace(/ /g, '-')}`}>
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                  </Link>
                  
                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <Link 
                        href={`/product/${item.name.toLowerCase().replace(/ /g, '-')}`}
                        className={styles.itemName}
                      >
                        {item.name}
                      </Link>
                      <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    
                    <div className={styles.itemMeta}>
                      <span>Color: {item.color}</span>
                      <span>Size: {item.size}</span>
                    </div>
                    
                    <div className={styles.itemActions}>
                      <div className={styles.quantityControl}>
                        <button 
                          className={styles.qtyBtn} 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button 
                          className={styles.qtyBtn} 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className={styles.promoCode}>
              <h3 className={styles.promoTitle}>Discount Code</h3>
              <div className={styles.promoInputGroup}>
                <input type="text" placeholder="Enter promo code" className={styles.promoInput} />
                <button className={styles.promoBtn}>Apply</button>
              </div>
            </div>

            <Link href="/checkout" className={styles.checkoutBtn}>
              Proceed to Checkout
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>

            <Link href="/shop" className={styles.continueShopping}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
