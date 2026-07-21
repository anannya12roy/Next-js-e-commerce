"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../Profile.module.css';

// Using a dummy order function to simulate fetching by ID
const getDummyOrder = (id: string) => {
  return {
    id: `#${id}`,
    date: 'July 15, 2026',
    status: 'Delivered',
    paymentMethod: 'Cash on Delivery',
    shippingAddress: 'House #42, Road #7, Block C, Banani\nDhaka 1213, Bangladesh',
    billingAddress: 'House #42, Road #7, Block C, Banani\nDhaka 1213, Bangladesh',
    subtotal: 325.00,
    shippingCost: 15.00,
    tax: 0.00,
    total: 340.00,
    items: [
      { name: 'Minimalist Chair', meta: 'Oatmeal / One Size', img: '/images/prod1.jpg?v=3', qty: 2, price: 240.00 },
      { name: 'Ceramic Table Lamp', meta: 'White / Standard', img: '/images/prod2.jpg?v=3', qty: 1, price: 85.00 },
    ]
  };
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = typeof params.id === 'string' ? params.id : 'ORD-UNKNOWN';
  
  const order = getDummyOrder(orderId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className={styles.detailsHeader}>
        <div>
          <Link href="/profile/orders" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '14px', fontWeight: 600, display: 'inline-block', marginBottom: '8px' }}>
            ← Back to Orders
          </Link>
          <h1>Order {order.id}</h1>
          <div className={styles.detailsMeta}>Placed on {order.date}</div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className={`${styles.orderStatus} ${styles[`status-${order.status}`]}`}>
            {order.status}
          </span>
          <button className={styles.printBtn} onClick={handlePrint}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print
          </button>
        </div>
      </div>

      <div className={styles.detailsSection}>
        <h2 className={styles.detailsSectionTitle}>Items Ordered</h2>
        <div>
          {order.items.map((item, index) => (
            <div key={index} className={styles.detailsItem}>
              <img src={item.img} alt={item.name} className={styles.detailsItemImg} />
              <div className={styles.detailsItemInfo}>
                <div className={styles.detailsItemTitle}>{item.name}</div>
                <div className={styles.detailsItemMeta}>{item.meta}</div>
                <div className={styles.detailsItemPriceRow}>
                  <span>৳ {(item.price / item.qty).toFixed(2)} x {item.qty}</span>
                  <span style={{ color: '#111827', fontWeight: 600 }}>৳ {item.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '24px', maxWidth: '300px', marginLeft: 'auto' }}>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>৳ {order.subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>৳ {order.shippingCost.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tax</span>
            <span>৳ {order.tax.toFixed(2)}</span>
          </div>
          <div className={styles.summaryTotalRow}>
            <span>Total</span>
            <span>৳ {order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailsSection}>
          <h2 className={styles.detailsSectionTitle}>Shipping Address</h2>
          <div style={{ whiteSpace: 'pre-line', fontSize: '14px', color: '#4b5563', lineHeight: 1.6 }}>
            {order.shippingAddress}
          </div>
        </div>

        <div className={styles.detailsSection}>
          <h2 className={styles.detailsSectionTitle}>Payment Method</h2>
          <div style={{ fontSize: '14px', color: '#4b5563', lineHeight: 1.6 }}>
            <span style={{ fontWeight: 600, color: '#111827' }}>{order.paymentMethod}</span>
            <br />
            Payment Status: <span style={{ color: '#059669', fontWeight: 600 }}>Paid</span>
          </div>
        </div>
      </div>
    </>
  );
}
