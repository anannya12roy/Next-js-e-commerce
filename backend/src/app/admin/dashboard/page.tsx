"use client";

import React, { useEffect, useState } from 'react';
import { getDashboardData } from '@/actions/dashboardActions';

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
    totalProducts: number;
    totalCategories: number;
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
        const res = await getDashboardData();
        if (res.success) {
          setData(res.data as DashboardData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading Dashboard...</div>;
  }

  if (!data || !data.metrics) {
    return <div className="loading">Failed to load dashboard data.</div>;
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Dashboard Overview</h1>
        <p className="subtitle">Welcome back! Here is your store's current status.</p>
      </header>

      <section className="statsGrid">
        <div className="statCard">
          <h3 className="statTitle">Total Revenue</h3>
          <p className="statValue">${data.metrics.totalRevenue?.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
        </div>
        <div className="statCard">
          <h3 className="statTitle">Net Revenue</h3>
          <p className="statValue">${data.metrics.netRevenue?.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
        </div>
        <div className="statCard">
          <h3 className="statTitle">Total Orders</h3>
          <p className="statValue">{data.metrics.totalOrders}</p>
        </div>
        <div className="statCard">
          <h3 className="statTitle">Total Customers</h3>
          <p className="statValue">{data.metrics.totalCustomers}</p>
        </div>
        <div className="statCard">
          <h3 className="statTitle">Total Products</h3>
          <p className="statValue">{data.metrics.totalProducts}</p>
        </div>
        <div className="statCard">
          <h3 className="statTitle">Total Categories</h3>
          <p className="statValue">{data.metrics.totalCategories}</p>
        </div>
      </section>

      <section className="recentOrders">
        <h2 className="sectionTitle">Top Products</h2>
        <table className="table">
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
