"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Checkout.module.css';

// Initial dummy cart data (same as cart)
const checkoutItems = [
  {
    id: 1,
    name: 'Minimalist Chair',
    price: 120.00,
    image: '/images/prod1.jpg?v=2',
    color: 'Oatmeal',
    size: 'One Size',
    quantity: 2
  },
  {
    id: 2,
    name: 'Ceramic Table Lamp',
    price: 85.00,
    image: '/images/prod2.jpg?v=2',
    color: 'White',
    size: 'Standard',
    quantity: 1
  }
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const subtotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 15.00;
  const total = subtotal + shipping;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.main}>
        {/* Left Column: Form */}
        <div className={styles.formSection}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h2 className={styles.cardTitle}>Contact Information</h2>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email address</label>
              <input type="email" placeholder="john@example.com" className={styles.input} />
            </div>
            <label className={styles.checkboxGroup}>
              <input type="checkbox" className={styles.checkbox} defaultChecked />
              <span className={styles.label}>Email me with news and offers</span>
            </label>
          </div>

          <div className={styles.card}>
            <div className={styles.header}>
              <h2 className={styles.cardTitle}>Shipping Address</h2>
            </div>
            <div className={styles.inputGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>First name</label>
                <input type="text" className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Last name</label>
                <input type="text" className={styles.input} />
              </div>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Address</label>
                <input type="text" placeholder="Street address or P.O. Box" className={styles.input} />
              </div>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Apartment, suite, etc. (optional)</label>
                <input type="text" className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>City</label>
                <input type="text" className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Country</label>
                <select className={`${styles.input} ${styles.select}`} defaultValue="us">
                  <option value="us">United States</option>
                  <option value="ca">Canada</option>
                  <option value="uk">United Kingdom</option>
                  <option value="au">Australia</option>
                </select>
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>State / Province</label>
                <input type="text" className={styles.input} />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Postal code</label>
                <input type="text" className={styles.input} />
              </div>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Phone</label>
                <input type="tel" className={styles.input} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className={styles.summarySection}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          
          <div className={styles.itemList}>
            {checkoutItems.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImageWrapper}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <span className={styles.itemBadge}>{item.quantity}</span>
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemMeta}>{item.color} / {item.size}</div>
                </div>
                <div className={styles.itemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
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
            <span>$0.00</span>
          </div>

          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div style={{ marginTop: '32px', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Payment Method</h3>
            <div className={styles.paymentOptions}>
              <label className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.active : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod"
                  className={styles.radio}
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className={styles.paymentLabel}>Cash on Delivery</span>
              </label>

              <label className={`${styles.paymentOption} ${paymentMethod === 'bkash' ? styles.active : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="bkash"
                  className={styles.radio}
                  checked={paymentMethod === 'bkash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className={styles.paymentLabel}>bKash</span>
                <span style={{ fontWeight: 700, color: '#e2136e' }}>bKash</span>
              </label>

              <label className={`${styles.paymentOption} ${paymentMethod === 'ssl' ? styles.active : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="ssl"
                  className={styles.radio}
                  checked={paymentMethod === 'ssl'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className={styles.paymentLabel}>SSLCommerz (Cards/NetBanking)</span>
              </label>
            </div>
          </div>

          <button className={styles.payBtn}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Pay ${total.toFixed(2)}
          </button>

          <div className={styles.secureText}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Secure, encrypted checkout
          </div>
        </div>
      </div>
    </div>
  );
}
