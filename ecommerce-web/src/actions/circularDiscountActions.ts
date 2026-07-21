'use server';

import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// --- Master Circular Functions ---

export async function getCirculars() {
  try {
    const [rows] = await pool.query('SELECT * FROM circular_discounts ORDER BY created_at DESC');
    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching circulars:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function getCircularById(id: number) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM circular_discounts WHERE id = ?', [id]);
    if (rows.length === 0) return { success: false, error: 'Circular not found' };
    return { success: true, data: rows[0] };
  } catch (error) {
    console.error('Error fetching circular:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function createCircular(data: any) {
  try {
    const { circular_number, start_time, end_time, status } = data;
    if (!circular_number || !start_time || !end_time) {
      return { success: false, error: 'Circular number, start time, and end time are required' };
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO circular_discounts (circular_number, start_time, end_time, status) VALUES (?, ?, ?, ?)',
      [circular_number, start_time, end_time, status || 'Active']
    );
    return { success: true, id: result.insertId, message: 'Circular created successfully' };
  } catch (error: any) {
    console.error('Error creating circular:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'Circular number already exists' };
    }
    return { success: false, error: 'Internal server error' };
  }
}

export async function updateCircular(id: number, data: any) {
  try {
    const { circular_number, start_time, end_time, status } = data;
    if (!circular_number || !start_time || !end_time) {
      return { success: false, error: 'Circular number, start time, and end time are required' };
    }

    await pool.query(
      'UPDATE circular_discounts SET circular_number = ?, start_time = ?, end_time = ?, status = ? WHERE id = ?',
      [circular_number, start_time, end_time, status || 'Active', id]
    );
    return { success: true, message: 'Circular updated successfully' };
  } catch (error: any) {
    console.error('Error updating circular:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'Circular number already exists' };
    }
    return { success: false, error: 'Internal server error' };
  }
}

export async function deleteCircular(id: number) {
  try {
    await pool.query('DELETE FROM circular_discounts WHERE id = ?', [id]);
    return { success: true, message: 'Circular deleted successfully' };
  } catch (error) {
    console.error('Error deleting circular:', error);
    return { success: false, error: 'Internal server error' };
  }
}

// --- Circular Item Functions ---

export async function getCircularItems(circularId: number) {
  try {
    const [rows] = await pool.query(
      `SELECT cdi.*, p.name as product_name 
       FROM circular_discount_items cdi
       JOIN products p ON cdi.product_id = p.id
       WHERE cdi.circular_id = ?
       ORDER BY cdi.created_at DESC`,
      [circularId]
    );
    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching circular items:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function searchProductByBarcode(barcode: string) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, name, price, barcode FROM products WHERE barcode = ? LIMIT 1', [barcode]);
    if (rows.length === 0) return { success: false, error: 'Product not found with this barcode' };
    return { success: true, data: rows[0] };
  } catch (error) {
    console.error('Error searching product by barcode:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function addCircularItem(data: any) {
  try {
    const { circular_id, product_id, barcode, discount_percent, discount_amount, start_time, end_time, status } = data;
    
    if (!circular_id || !product_id || !barcode) {
      return { success: false, error: 'Circular ID, Product ID, and Barcode are required' };
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO circular_discount_items 
        (circular_id, product_id, barcode, discount_percent, discount_amount, start_time, end_time, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        circular_id, product_id, barcode, 
        discount_percent || 0, discount_amount || 0, 
        start_time || null, end_time || null, 
        status || 'Active'
      ]
    );

    return { success: true, id: result.insertId, message: 'Product added to circular successfully' };
  } catch (error) {
    console.error('Error adding circular item:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function removeCircularItem(itemId: number) {
  try {
    await pool.query('DELETE FROM circular_discount_items WHERE id = ?', [itemId]);
    return { success: true, message: 'Item removed successfully' };
  } catch (error) {
    console.error('Error removing circular item:', error);
    return { success: false, error: 'Internal server error' };
  }
}
