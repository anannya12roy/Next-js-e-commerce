'use server';

import pool from '@/lib/db';

export async function getOrders() {
  try {
    const [rows] = await pool.query(`
      SELECT id, customer_name, customer_email, customer_phone, total_amount, payment_status, order_status, created_at
      FROM orders
      ORDER BY created_at DESC
    `);
    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { success: false, error: 'Failed to fetch orders' };
  }
}

export async function getOrderById(orderId: number) {
  try {
    const [orders]: any = await pool.query(`
      SELECT * FROM orders WHERE id = ?
    `, [orderId]);

    if (!orders || orders.length === 0) {
      return { success: false, error: 'Order not found' };
    }

    const order = orders[0];

    const [items]: any = await pool.query(`
      SELECT * FROM order_items WHERE order_id = ?
    `, [orderId]);

    return { success: true, data: { ...order, items } };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return { success: false, error: 'Failed to fetch order details' };
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  try {
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return { success: false, error: 'Invalid status' };
    }

    await pool.query('UPDATE orders SET order_status = ? WHERE id = ?', [status, orderId]);
    return { success: true, message: 'Order status updated successfully' };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}

export async function updatePaymentStatus(orderId: number, status: string) {
  try {
    const validStatuses = ['Pending', 'Paid', 'Failed'];
    if (!validStatuses.includes(status)) {
      return { success: false, error: 'Invalid payment status' };
    }

    await pool.query('UPDATE orders SET payment_status = ? WHERE id = ?', [status, orderId]);
    return { success: true, message: 'Payment status updated successfully' };
  } catch (error) {
    console.error('Error updating payment status:', error);
    return { success: false, error: 'Failed to update payment status' };
  }
}

export async function deleteOrder(orderId: number) {
  try {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Items are deleted automatically due to ON DELETE CASCADE, but it's safe to do manually or rely on it
      await connection.query('DELETE FROM orders WHERE id = ?', [orderId]);

      await connection.commit();
      return { success: true, message: 'Order deleted successfully' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    return { success: false, error: 'Failed to delete order' };
  }
}
