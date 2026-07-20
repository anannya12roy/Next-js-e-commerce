"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './CartDrawer.module.css';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // Dummy data matching the visual in the screenshot
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Kid's Azure Blue Cotton Panjabi With Digital Print & Patchwork",
      meta: "( 1415 | BLUE)",
      price: 820.91,
      image: "/images/prod1.jpg?v=2", // using existing dummy image
      quantity: 1
    }
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`} 
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
        
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.title}>SHOPPING BAG ({items.length})</span>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className={styles.itemsArea}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
              Your shopping bag is empty.
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className={styles.itemCard}>
                <img src={item.image} alt="Product" className={styles.itemImage} />
                <div className={styles.itemDetails}>
                  <div className={styles.itemName}>
                    {item.name} <span className={styles.itemMeta}>{item.meta}</span>
                  </div>
                  <div className={styles.itemPrice}>
                    Price: ৳ {item.price.toFixed(2)}
                  </div>
                  
                  <div className={styles.qtyRow}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className={styles.qtyLabel}>Qty:</span>
                      <div className={styles.qtyControls}>
                        <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, -1)}>−</button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                    </div>
                    
                    <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.subtotalRow}>
            <span className={styles.subtotalLabel}>Subtotal</span>
            <span className={styles.subtotalValue}>৳ {subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.continueBtn} onClick={onClose}>
              CONTINUE SHOPPING
            </button>
            <Link href="/cart" style={{ flex: 1, display: 'flex' }} onClick={onClose}>
              <button className={styles.checkoutBtn} style={{ width: '100%' }}>
                VIEW CART
              </button>
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
