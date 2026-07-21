'use server';

import pool from '@/lib/db';

export async function getBrands() {
  try {
    const [rows] = await pool.query('SELECT * FROM brands ORDER BY created_at DESC');
    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching brands:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function createBrand(data: any) {
  try {
    const { name, logo, status, meta_title, meta_description } = data;
    
    if (!name) {
      return { success: false, error: 'Name is required' };
    }

    const [result]: any = await pool.query(
      `INSERT INTO brands (name, logo, status, meta_title, meta_description) VALUES (?, ?, ?, ?, ?)`,
      [name, logo || null, status || 'active', meta_title || null, meta_description || null]
    );

    return { success: true, id: result.insertId, message: 'Brand created successfully' };
  } catch (error) {
    console.error('Error creating brand:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function updateBrand(id: number, data: any) {
  try {
    const { name, logo, status, meta_title, meta_description } = data;
    
    if (!name) {
      return { success: false, error: 'Name is required' };
    }

    await pool.query(
      `UPDATE brands SET name = ?, logo = ?, status = ?, meta_title = ?, meta_description = ? WHERE id = ?`,
      [name, logo || null, status || 'active', meta_title || null, meta_description || null, id]
    );

    return { success: true, message: 'Brand updated successfully' };
  } catch (error) {
    console.error('Error updating brand:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function deleteBrand(id: number) {
  try {
    await pool.query('DELETE FROM brands WHERE id = ?', [id]);
    return { success: true, message: 'Brand deleted successfully' };
  } catch (error) {
    console.error('Error deleting brand:', error);
    return { success: false, error: 'Internal server error' };
  }
}
