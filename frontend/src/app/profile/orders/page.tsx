"use client";

import React from 'react';
import styles from '../Profile.module.css';
import Link from 'next/link';

// Dummy orders data
const orders = [
  {
    id: '#ORD-98745',
    date: 'July 15, 2026',
    status: 'Delivered',
    total: 340.00,
    items: [
      { name: 'Minimalist Chair', meta: 'Oatmeal / One Size', img: '/images/prod1.jpg?v=3', qty: 2, price: 240.00 },
      { name: 'Ceramic Table Lamp', meta: 'White / Standard', img: '/images/prod2.jpg?v=3', qty: 1, price: 85.00 },
    ]
  },
  {
    id: '#ORD-98711',
    date: 'June 28, 2026',
    status: 'Processing',
    total: 820.91,
    items: [
      { name: "Kid's Azure Blue Cotton Panjabi", meta: '(1415 | BLUE)', img: '/images/prod1.jpg?v=4', qty: 1, price: 820.91 },
    ]
  }
];

export default function OrdersPage() {
  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>My Orders</h1>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 600 }}>{order.id}</td>
                <td>{order.date}</td>
                <td>৳ {order.total.toFixed(2)}</td>
                <td>
                  <span className={`${styles.orderStatus} ${styles[`status-${order.status}`]}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <Link href={`/profile/orders/${order.id.replace('#', '')}`} className={styles.viewBtn}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
