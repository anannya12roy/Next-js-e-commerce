'use client';

import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus, updatePaymentStatus, deleteOrder } from '@/actions/orderActions';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const EyeIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const TrashIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getOrders();
    if (res.success && res.data) {
      setOrders(res.data as any);
    } else {
      toast.error('Failed to load orders');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    const res = await updateOrderStatus(id, status);
    if (res.success) {
      toast.success('Order status updated');
      fetchOrders();
    } else {
      toast.error(res.error || 'Failed to update status');
    }
  };

  const handlePaymentChange = async (id: number, status: string) => {
    const res = await updatePaymentStatus(id, status);
    if (res.success) {
      toast.success('Payment status updated');
      fetchOrders();
    } else {
      toast.error(res.error || 'Failed to update payment status');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this order?')) {
      const res = await deleteOrder(id);
      if (res.success) {
        toast.success('Order deleted');
        fetchOrders();
      } else {
        toast.error('Failed to delete order');
      }
    }
  };

  const selectStyle = { backgroundColor: 'white', color: '#111827', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px', outline: 'none' };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return { bg: '#fef3c7', text: '#d97706' };
      case 'Processing': return { bg: '#e0e7ff', text: '#4338ca' };
      case 'Shipped': return { bg: '#dcfce7', text: '#15803d' };
      case 'Delivered': return { bg: '#dcfce7', text: '#16a34a' };
      case 'Cancelled': return { bg: '#fee2e2', text: '#dc2626' };
      case 'Paid': return { bg: '#dcfce7', text: '#16a34a' };
      case 'Failed': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f4f7fa', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header Card */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', margin: 0 }}>Orders</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input type="text" placeholder="Search by Order ID or Name" style={{ ...selectStyle, width: '250px', padding: '8px 12px' }} />
            <button style={{ padding: '8px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>Search</button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div style={{ backgroundColor: 'white', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#374151' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
              <th style={{ padding: '16px 16px', textAlign: 'left' }}>Order ID</th>
              <th style={{ padding: '16px 16px', textAlign: 'left' }}>Customer</th>
              <th style={{ padding: '16px 16px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '16px 16px', textAlign: 'left' }}>Total Amount</th>
              <th style={{ padding: '16px 16px', textAlign: 'left' }}>Payment Status</th>
              <th style={{ padding: '16px 16px', textAlign: 'left' }}>Order Status</th>
              <th style={{ padding: '16px 16px', textAlign: 'center', width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center' }}>Loading orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '24px', textAlign: 'center' }}>No orders found.</td></tr>
            ) : orders.map((order) => {
              const paymentColors = getStatusColor(order.payment_status);
              const orderColors = getStatusColor(order.order_status);
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px', fontWeight: 600 }}>#{order.id}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 500, color: '#111827' }}>{order.customer_name}</div>
                    <div style={{ color: '#6b7280', fontSize: '12px' }}>{order.customer_phone}</div>
                    {order.customer_email && <div style={{ color: '#6b7280', fontSize: '12px' }}>{order.customer_email}</div>}
                  </td>
                  <td style={{ padding: '16px' }}>{new Date(order.created_at).toLocaleString()}</td>
                  <td style={{ padding: '16px', fontWeight: 600 }}>${parseFloat(order.total_amount).toFixed(2)}</td>
                  
                  {/* Payment Status Dropdown */}
                  <td style={{ padding: '16px' }}>
                    <select 
                      style={{ ...selectStyle, backgroundColor: paymentColors.bg, color: paymentColors.text, fontWeight: 500, border: 'none' }}
                      value={order.payment_status}
                      onChange={(e) => handlePaymentChange(order.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </td>
                  
                  {/* Order Status Dropdown */}
                  <td style={{ padding: '16px' }}>
                    <select 
                      style={{ ...selectStyle, backgroundColor: orderColors.bg, color: orderColors.text, fontWeight: 500, border: 'none' }}
                      value={order.order_status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <Link href={`/admin/dashboard/orders/${order.id}`}>
                        <button style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid #e5e7eb', background: '#fff', color: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="View Details">
                          <EyeIcon />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(order.id)}
                        style={{ width: '32px', height: '32px', borderRadius: '4px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} 
                        title="Delete Order"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
