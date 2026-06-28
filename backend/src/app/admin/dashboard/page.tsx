"use client";

import React, { useEffect, useState } from 'react';
import styles from './dashboard.module.css';

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: string;
}

interface DashboardData {
  metrics: {
    totalOrders: number;
    discountedOrders: number;
    ordersInProcess: number;
    orderUnfulfilled: number;
    totalRevenue: number;
    discountedRevenue: number;
    netRevenue: number;
    totalSalesPercentage: number;
    salesPerformance: number;
    newCustomers: number;
    totalCustomers: number;
  };
  charts: {
    topProducts: Array<{name: string, sold: string, revenue: string}>;
    monthlySales: Array<{month: string, revenue: string}>;
    salesPerformance: Array<{date: string, revenue: string}>;
  }
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetching from the Express backend
        const res = await fetch('http://localhost:5000/api/dashboard');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading Dashboard...</div>;
  }

  if (!data || !data.metrics) {
    return <div className={styles.loading}>Failed to load dashboard data.</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard Overview</h1>
        <p className={styles.subtitle}>Welcome back! Here is your store's current status.</p>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Revenue</h3>
          <p className={styles.statValue}>${data.metrics.totalRevenue?.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Net Revenue</h3>
          <p className={styles.statValue}>${data.metrics.netRevenue?.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Orders</h3>
          <p className={styles.statValue}>{data.metrics.totalOrders}</p>
        </div>
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Total Customers</h3>
          <p className={styles.statValue}>{data.metrics.totalCustomers}</p>
        </div>
      </section>

      <section className={styles.recentOrders}>
        <h2 className={styles.sectionTitle}>Top Products</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity Sold</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.charts.topProducts.map((product, idx) => (
              <tr key={idx}>
                <td>{product.name}</td>
                <td>{product.sold}</td>
                <td>${parseFloat(product.revenue).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
