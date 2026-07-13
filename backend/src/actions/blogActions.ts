'use server';

import pool from '@/lib/db';

export async function createBlogCategory(data: any) {
  try {
    const { name } = data;
    
    if (!name) {
      return { success: false, error: 'Name is required' };
    }

    const [result]: any = await pool.query(
      `INSERT INTO blog_categories (name) VALUES (?)`,
      [name]
    );

    return { success: true, id: result.insertId, message: 'Blog category created successfully' };
  } catch (error) {
    console.error('Error creating blog category:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function getBlogCategories() {
  try {
    const [rows] = await pool.query('SELECT * FROM blog_categories ORDER BY created_at DESC');
    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function createBlog(data: any) {
  try {
    const { 
      type, 
      title, 
      category_id, 
      slug, 
      banner, 
      short_description, 
      description, 
      is_featured, 
      meta_title, 
      meta_image, 
      meta_description, 
      meta_keywords 
    } = data;
    
    if (!title || !slug) {
      return { success: false, error: 'Title and Slug are required' };
    }

    const [result]: any = await pool.query(
      `INSERT INTO blogs (
        type, title, category_id, slug, banner, short_description, description, 
        is_featured, meta_title, meta_image, meta_description, meta_keywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        type || 'Blog', 
        title, 
        category_id || null, 
        slug, 
        banner || null, 
        short_description || null, 
        description || null, 
        is_featured === true || is_featured === 'yes' ? 1 : 0, 
        meta_title || null, 
        meta_image || null, 
        meta_description || null, 
        meta_keywords || null
      ]
    );

    return { success: true, id: result.insertId, message: 'Blog created successfully' };
  } catch (error) {
    console.error('Error creating blog:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function getBlogs() {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, c.name as category_name 
      FROM blogs b 
      LEFT JOIN blog_categories c ON b.category_id = c.id 
      ORDER BY b.created_at DESC
    `);
    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return { success: false, error: 'Internal server error' };
  }
}
