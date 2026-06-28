'use server';

import pool from '@/lib/db';

export async function getFeatures(type: string) {
  try {
    const [rows] = await pool.query('SELECT * FROM product_features WHERE type = ? ORDER BY created_at DESC', [type]);
    return { success: true, data: rows };
  } catch (error) {
    console.error(`Error fetching features of type ${type}:`, error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function createFeature(type: string, data: any) {
  try {
    const { name, value, meta_title, meta_description, status, image } = data;
    
    if (!name) {
      return { success: false, error: 'Name is required' };
    }

    const [result]: any = await pool.query(
      `INSERT INTO product_features (type, name, value, meta_title, meta_description, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [type, name, value || null, meta_title || null, meta_description || null, status || 'active', image || null]
    );

    return { success: true, id: result.insertId, message: 'Feature created successfully' };
  } catch (error) {
    console.error('Error creating feature:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function updateFeature(type: string, id: number, data: any) {
  try {
    const { name, value, meta_title, meta_description, status, image } = data;
    
    if (!name) {
      return { success: false, error: 'Name is required' };
    }

    await pool.query(
      `UPDATE product_features SET name = ?, value = ?, meta_title = ?, meta_description = ?, status = ?, image = ? WHERE type = ? AND id = ?`,
      [name, value || null, meta_title || null, meta_description || null, status || 'active', image || null, type, id]
    );

    return { success: true, message: 'Feature updated successfully' };
  } catch (error) {
    console.error('Error updating feature:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function deleteFeature(type: string, id: number) {
  try {
    await pool.query('DELETE FROM product_features WHERE type = ? AND id = ?', [type, id]);
    return { success: true, message: 'Feature deleted successfully' };
  } catch (error) {
    console.error('Error deleting feature:', error);
    return { success: false, error: 'Internal server error' };
  }
}
