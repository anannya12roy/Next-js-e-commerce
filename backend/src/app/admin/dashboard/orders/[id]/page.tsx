'use client';

import React, { useEffect, useState } from 'react';
import { getOrderById, updateOrderStatus, updatePaymentStatus } from '@/actions/orderActions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrder = async () => {
    setLoading(true);
    const res = await getOrderById(Number(params.id));
    if (res.success && res.data) {
      setOrder(res.data);
    } else {
      toast.error('Failed to load order details');
      router.push('/admin/dashboard/orders');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const handleStatusChange = async (status: string) => {
    const res = await updateOrderStatus(order.id, status);
    if (res.success) {
      toast.success('Order status updated');
      fetchOrder();
    } else {
      toast.error(res.error || 'Failed to update status');
    }
  };

  const handlePaymentChange = async (status: string) => {
    const res = await updatePaymentStatus(order.id, status);
    if (res.success) {
      toast.success('Payment status updated');
      fetchOrder();
    } else {
      toast.error(res.error || 'Failed to update payment status');
    }
  };

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading order details...</div>;
  }

  if (!order) return null;

  return (
    <div style={{ padding: '24px', backgroundColor: '#f4f7fa', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937', margin: 0 }}>Order Details #{order.id}</h2>
        <button onClick={() => window.print()} style={{ padding: '8px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Print Invoice
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Order Items */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#374151', margin: '0 0 16px 0', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>Ordered Items</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', color: '#374151' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Product</th>
                  <th style={{ padding: '12px' }}>Price</th>
                  <th style={{ padding: '12px' }}>Qty</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.map((item: any) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px' }}>{item.product_name}</td>
                    <td style={{ padding: '12px' }}>${parseFloat(item.price).toFixed(2)}</td>
                    <td style={{ padding: '12px' }}>x {item.quantity}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 500 }}>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ padding: '16px 12px', textAlign: 'right', fontWeight: 600 }}>Total Amount:</td>
                  <td style={{ padding: '16px 12px', textAlign: 'right', fontWeight: 700, fontSize: '16px' }}>${parseFloat(order.total_amount).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Customer Info */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#374151', margin: '0 0 16px 0', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>Customer Information</h3>
            <div style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>
              <p style={{ margin: '4px 0' }}><strong>Name:</strong> {order.customer_name}</p>
              <p style={{ margin: '4px 0' }}><strong>Phone:</strong> {order.customer_phone}</p>
              {order.customer_email && <p style={{ margin: '4px 0' }}><strong>Email:</strong> {order.customer_email}</p>}
              <p style={{ margin: '16px 0 4px 0' }}><strong>Shipping Address:</strong></p>
              <p style={{ margin: 0, padding: '12px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                {order.shipping_address}
              </p>
            </div>
          </div>

          {/* Status Updates */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#374151', margin: '0 0 16px 0', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>Order Status</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', marginBottom: '8px', fontWeight: 500 }}>Payment Method</label>
              <div style={{ padding: '8px 12px', backgroundColor: '#f3f4f6', borderRadius: '4px', fontSize: '14px' }}>{order.payment_method}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', marginBottom: '8px', fontWeight: 500 }}>Payment Status</label>
              <select 
                value={order.payment_status}
                onChange={(e) => handlePaymentChange(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', outline: 'none' }}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#4b5563', marginBottom: '8px', fontWeight: 500 }}>Delivery Status</label>
              <select 
                value={order.order_status}
                onChange={(e) => handleStatusChange(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', outline: 'none' }}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
