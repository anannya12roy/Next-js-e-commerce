"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from '../../items.module.css';
import { getMenuItems, deleteMenuItem } from '@/actions/menuActions';

export default function MenuItemsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const menuId = parseInt(resolvedParams.id);
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  const fetchItems = async () => {
    try {
      const res = await getMenuItems(menuId);
      if (res.success) {
        setItems(res.data);
      }
    } catch (error) {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [menuId]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      try {
        const res = await deleteMenuItem(id);
        if (res.success) {
          toast.success('Deleted successfully');
          fetchItems();
        } else {
          toast.error(res.error || 'Failed to delete menu item');
        }
      } catch (error) {
        toast.error('Network error');
      }
    }
  };

  // Build a flattened tree for display
  const buildFlattenedTree = (itemsList: any[], parentId: number | null = null, depth = 0): any[] => {
    let result: any[] = [];
    const children = itemsList.filter(item => item.parent_id === parentId);
    
    // Sort by order
    children.sort((a, b) => a.sort_order - b.sort_order);

    for (const child of children) {
      result.push({ ...child, depth });
      result = result.concat(buildFlattenedTree(itemsList, child.id, depth + 1));
    }
    
    return result;
  };

  const allItemsFlattened = buildFlattenedTree(items);
  
  // Apply filters
  const filteredItems = allItemsFlattened.filter(item => {
    const matchName = !nameFilter || item.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchType = !typeFilter || item.type.toLowerCase() === typeFilter.toLowerCase();
    return matchName && matchType;
  });

  const getPrefix = (depth: number) => {
    if (depth === 0) return '';
    return '+'.repeat(depth) + ' ';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Menu Items</h1>
        <Link href={`/admin/dashboard/menus/${menuId}/items/create`} className={styles.addBtn}>
          Add New Item
        </Link>
      </div>

      <div className={styles.filters}>
        <input 
          type="text" 
          placeholder="Filter by Name" 
          className={styles.filterInput} 
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <select 
          className={styles.filterSelect}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Filter by Type</option>
          <option value="category">Category</option>
          <option value="page">Page</option>
          <option value="custom">Custom Link</option>
        </select>
        <button className={styles.filterBtn}>Filter</button>
        <button 
          className={styles.clearBtn}
          onClick={() => { setNameFilter(''); setTypeFilter(''); }}
        >
          Clear Filters
        </button>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <p style={{ padding: '24px' }}>Loading items...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Order</th>
                <th>Parent</th>
                <th>Type</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{getPrefix(item.depth)}{item.name}</td>
                  <td>
                    <input 
                      type="number" 
                      className={styles.orderInput} 
                      value={item.sort_order}
                      readOnly
                    />
                  </td>
                  <td>{item.parent_name || ''}</td>
                  <td>{item.type}</td>
                  <td>
                    {item.type === 'category' && item.category_id 
                      ? <span style={{color: '#f97316'}}>/category/{item.name.toLowerCase().replace(/\s+/g, '')}</span> 
                      : <span style={{color: '#f97316'}}>{item.url || ''}</span>
                    }
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link href={`/admin/dashboard/menus/${menuId}/items/create?id=${item.id}`} className={styles.editBtn}>
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px' }}>
                    No menu items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
