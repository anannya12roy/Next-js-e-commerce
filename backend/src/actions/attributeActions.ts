'use server';

import pool from '@/lib/db';

export async function getAttributes() {
  try {
    const [rows]: any = await pool.query('SELECT * FROM attributes ORDER BY created_at DESC');
    
    // We also need to fetch their values to match the frontend expectation
    const attributes = rows as any[];
    for (let attr of attributes) {
      const [values] = await pool.query('SELECT * FROM attribute_values WHERE attribute_id = ?', [attr.id]);
      attr.values = values;
    }

    return { success: true, data: attributes };
  } catch (error) {
    console.error('Error fetching attributes:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function createAttribute(data: { name: string }) {
  try {
    const { name } = data;
    
    if (!name) {
      return { success: false, error: 'Name is required' };
    }

    const [result]: any = await pool.query(
      `INSERT INTO attributes (name) VALUES (?)`,
      [name]
    );

    return { success: true, id: result.insertId, message: 'Attribute created successfully' };
  } catch (error) {
    console.error('Error creating attribute:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function updateAttribute(id: number, data: { name: string }) {
  try {
    const { name } = data;
    
    if (!name) {
      return { success: false, error: 'Name is required' };
    }

    await pool.query(
      `UPDATE attributes SET name = ? WHERE id = ?`,
      [name, id]
    );

    return { success: true, message: 'Attribute updated successfully' };
  } catch (error) {
    console.error('Error updating attribute:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function deleteAttribute(id: number) {
  try {
    // Delete associated attribute values first
    await pool.query('DELETE FROM attribute_values WHERE attribute_id = ?', [id]);
    
    // Delete the attribute
    await pool.query('DELETE FROM attributes WHERE id = ?', [id]);
    
    return { success: true, message: 'Attribute deleted successfully' };
  } catch (error) {
    console.error('Error deleting attribute:', error);
    return { success: false, error: 'Internal server error' };
  }
}
