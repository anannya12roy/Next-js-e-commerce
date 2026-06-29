'use server';

import pool from '@/lib/db';

// --- Menu Actions ---

export async function getMenus() {
  try {
    const [rows] = await pool.query('SELECT * FROM menus ORDER BY created_at DESC');
    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching menus:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function getMenu(id: number) {
  try {
    const [rows]: any = await pool.query('SELECT * FROM menus WHERE id = ?', [id]);
    if (rows.length > 0) {
      return { success: true, data: rows[0] };
    }
    return { success: false, error: 'Menu not found' };
  } catch (error) {
    console.error('Error fetching menu:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function createMenu(data: any) {
  try {
    const { name, identifier } = data;
    if (!name || !identifier) {
      return { success: false, error: 'Name and Identifier are required' };
    }
    const [result]: any = await pool.query(
      'INSERT INTO menus (name, identifier) VALUES (?, ?)',
      [name, identifier]
    );
    return { success: true, id: result.insertId, message: 'Menu created successfully' };
  } catch (error: any) {
    console.error('Error creating menu:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'Menu identifier must be unique' };
    }
    return { success: false, error: 'Internal server error' };
  }
}

export async function updateMenu(id: number, data: any) {
  try {
    const { name, identifier } = data;
    if (!name || !identifier) {
      return { success: false, error: 'Name and Identifier are required' };
    }
    await pool.query(
      'UPDATE menus SET name = ?, identifier = ? WHERE id = ?',
      [name, identifier, id]
    );
    return { success: true, message: 'Menu updated successfully' };
  } catch (error: any) {
    console.error('Error updating menu:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'Menu identifier must be unique' };
    }
    return { success: false, error: 'Internal server error' };
  }
}

export async function deleteMenu(id: number) {
  try {
    await pool.query('DELETE FROM menus WHERE id = ?', [id]);
    return { success: true, message: 'Menu deleted successfully' };
  } catch (error) {
    console.error('Error deleting menu:', error);
    return { success: false, error: 'Internal server error' };
  }
}

// --- Menu Item Actions ---

export async function getMenuItems(menuId: number) {
  try {
    const [rows]: any = await pool.query(
      `SELECT mi.*, c.name as category_name, p.name as parent_name 
       FROM menu_items mi 
       LEFT JOIN categories c ON mi.category_id = c.id
       LEFT JOIN menu_items p ON mi.parent_id = p.id
       WHERE mi.menu_id = ? 
       ORDER BY mi.sort_order ASC`, 
      [menuId]
    );
    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function getMenuItem(id: number) {
  try {
    const [rows]: any = await pool.query('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (rows.length > 0) {
      return { success: true, data: rows[0] };
    }
    return { success: false, error: 'Menu item not found' };
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function createMenuItem(data: any) {
  try {
    const { menu_id, type, name, category_id, parent_id, sort_order, target, highlight_color, url } = data;
    
    if (!menu_id || !type || !name) {
      return { success: false, error: 'Menu ID, Type, and Name are required' };
    }

    const [result]: any = await pool.query(
      `INSERT INTO menu_items 
       (menu_id, type, name, category_id, parent_id, sort_order, target, highlight_color, url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        menu_id, type, name, 
        category_id || null, 
        parent_id || null, 
        sort_order || 0, 
        target || '_self', 
        highlight_color || null, 
        url || null
      ]
    );
    return { success: true, id: result.insertId, message: 'Menu item created successfully' };
  } catch (error) {
    console.error('Error creating menu item:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function updateMenuItem(id: number, data: any) {
  try {
    const { type, name, category_id, parent_id, sort_order, target, highlight_color, url } = data;
    
    if (!type || !name) {
      return { success: false, error: 'Type and Name are required' };
    }

    await pool.query(
      `UPDATE menu_items 
       SET type = ?, name = ?, category_id = ?, parent_id = ?, sort_order = ?, target = ?, highlight_color = ?, url = ? 
       WHERE id = ?`,
      [
        type, name, 
        category_id || null, 
        parent_id || null, 
        sort_order || 0, 
        target || '_self', 
        highlight_color || null, 
        url || null, 
        id
      ]
    );
    return { success: true, message: 'Menu item updated successfully' };
  } catch (error) {
    console.error('Error updating menu item:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function deleteMenuItem(id: number) {
  try {
    await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);
    return { success: true, message: 'Menu item deleted successfully' };
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return { success: false, error: 'Internal server error' };
  }
}
