'use server';

import pool from '@/lib/db';
import { uploadMedia } from './mediaActions';

export async function getFeatures(type: string) {
  try {
    const [rows]: any = await pool.query('SELECT * FROM product_features WHERE type = ? ORDER BY created_at DESC', [type]);
    return { success: true, data: rows };
  } catch (error) {
    console.error(`Error fetching features of type ${type}:`, error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function createFeature(type: string, data: any) {
  try {
    let name, description, status, image;

    if (data instanceof FormData) {
      name = data.get('name') as string;
      description = data.get('description') as string;
      status = data.get('status') as string;
      
      const imageFile = data.get('image') as File | null;
      if (imageFile && imageFile.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        const uploadRes = await uploadMedia(uploadFormData);
        if (uploadRes.success) {
          image = uploadRes.url;
        }
      }
    } else {
      ({ name, description, status, image } = data);
    }
    
    if (!name) {
      return { success: false, error: 'Name is required' };
    }

    const [result]: any = await pool.query(
      `INSERT INTO product_features (type, name, description, status, image) VALUES (?, ?, ?, ?, ?)`,
      [type, name, description || null, status || 'Active', image || null]
    );

    return { success: true, id: result.insertId, message: 'Feature created successfully' };
  } catch (error) {
    console.error('Error creating feature:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function updateFeature(type: string, id: number, data: any) {
  try {
    let name, description, status, image;

    if (data instanceof FormData) {
      name = data.get('name') as string;
      description = data.get('description') as string;
      status = data.get('status') as string;
      
      const imageFile = data.get('image') as File | null;
      if (imageFile && imageFile.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        const uploadRes = await uploadMedia(uploadFormData);
        if (uploadRes.success) {
          image = uploadRes.url;
        }
      }
    } else {
      ({ name, description, status, image } = data);
    }
    
    if (!name) {
      return { success: false, error: 'Name is required' };
    }

    if (image !== undefined) {
      await pool.query(
        `UPDATE product_features SET name = ?, description = ?, status = ?, image = ? WHERE type = ? AND id = ?`,
        [name, description || null, status || 'Active', image || null, type, id]
      );
    } else {
      await pool.query(
        `UPDATE product_features SET name = ?, description = ?, status = ? WHERE type = ? AND id = ?`,
        [name, description || null, status || 'Active', type, id]
      );
    }

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
