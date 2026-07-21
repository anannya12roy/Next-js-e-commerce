'use server';

import pool from '@/lib/db';

export async function getCategories() {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY created_at DESC');
    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function createCategory(data: any) {
  try {
    const { name, parent_category, brand, ordering_number, banner, category_image, slug, status, meta_title, meta_description } = data;
    
    if (!name) {
      return { success: false, error: 'Name is required' };
    }

    const [result]: any = await pool.query(
      `INSERT INTO categories 
       (name, parent_category, brand, ordering_number, banner, category_image, slug, status, meta_title, meta_description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, parent_category || null, brand || null, ordering_number || 0, banner || null, category_image || null, slug || null, status || 'active', meta_title || null, meta_description || null]
    );

    return { success: true, id: result.insertId, message: 'Category created successfully' };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function updateCategory(id: number, data: any) {
  try {
    const { name, parent_category, brand, ordering_number, banner, category_image, slug, status, meta_title, meta_description } = data;
    
    if (!name) {
      return { success: false, error: 'Name is required' };
    }

    await pool.query(
      `UPDATE categories 
       SET name = ?, parent_category = ?, brand = ?, ordering_number = ?, banner = ?, category_image = ?, slug = ?, status = ?, meta_title = ?, meta_description = ? 
       WHERE id = ?`,
      [name, parent_category || null, brand || null, ordering_number || 0, banner || null, category_image || null, slug || null, status || 'active', meta_title || null, meta_description || null, id]
    );

    return { success: true, message: 'Category updated successfully' };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function deleteCategory(id: number) {
  try {
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    return { success: true, message: 'Category deleted successfully' };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: 'Internal server error' };
  }
}
