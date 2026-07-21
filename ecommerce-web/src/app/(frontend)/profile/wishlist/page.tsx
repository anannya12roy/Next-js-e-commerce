"use client";

import React, { useState } from 'react';
import styles from '../Profile.module.css';
import Link from 'next/link';

// Dummy wishlist data
const initialWishlist = [
  {
    id: 1,
    name: "Kid's Azure Blue Cotton Panjabi With Digital Print",
    price: 820.91,
    img: "/images/prod1.jpg?v=w1",
  },
  {
    id: 2,
    name: "Modern Ceramic Table Lamp - White",
    price: 85.00,
    img: "/images/prod2.jpg?v=w2",
  },
  {
    id: 3,
    name: "Minimalist Oak Wood Chair",
    price: 240.00,
    img: "/images/prod3.jpg?v=w3",
  },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const handleRemove = (id: number) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  const handleAddToCart = (name: string) => {
    alert(`Added ${name} to cart!`);
  };

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>My Wishlist</h1>
        <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>
          {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px', display: 'block', opacity: 0.5 }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <p>Your wishlist is currently empty.</p>
          <Link href="/shop" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, marginTop: '8px', display: 'inline-block' }}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className={styles.wishlistGrid}>
          {wishlist.map((item) => (
            <div key={item.id} className={styles.wishlistItem}>
              <button 
                className={styles.removeWishlistBtn} 
                onClick={() => handleRemove(item.id)}
                aria-label="Remove from wishlist"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <img src={item.img} alt={item.name} className={styles.wishlistImg} />
              <div className={styles.wishlistInfo}>
                <div className={styles.wishlistTitle}>{item.name}</div>
                <div className={styles.wishlistPrice}>৳ {item.price.toFixed(2)}</div>
                <button 
                  className={styles.addToCartBtn}
                  onClick={() => handleAddToCart(item.name)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
