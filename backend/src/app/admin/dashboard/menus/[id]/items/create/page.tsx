"use client";

import React, { useState, useEffect, Suspense, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import styles from '../../../items.module.css';
import { getMenuItem, createMenuItem, updateMenuItem, getMenuItems } from '@/actions/menuActions';
import { getCategories } from '@/actions/categoryActions';

function CreateItemForm({ menuId }: { menuId: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const editId = idParam ? parseInt(idParam) : null;

  const [type, setType] = useState('category');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [parentId, setParentId] = useState('');
  const [order, setOrder] = useState('0');
  const [target, setTarget] = useState('_self');
  const [highlightColor, setHighlightColor] = useState('');
  const [url, setUrl] = useState('');

  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to build category paths
  const buildCategoryPaths = (cats: any[]) => {
    const catMap = new Map();
    cats.forEach(c => catMap.set(c.id, c));

    return cats.map(c => {
      let path = c.name;
      let current = c;
      while (current.parent_category && current.parent_category !== '0') {
        // Parent category might be stored as ID or string. Assuming ID here based on common structures.
        // If it's a string name, we would search by name. Let's try matching ID or slug.
        const parent = cats.find(p => p.id == current.parent_category || p.name === current.parent_category || p.slug === current.parent_category);
        if (parent) {
          path = parent.name + ' >> ' + path;
          current = parent;
        } else {
          break;
        }
      }
      return { ...c, path };
    }).sort((a, b) => a.path.localeCompare(b.path));
  };

  const buildItemPaths = (items: any[]) => {
    const itemMap = new Map();
    items.forEach(i => itemMap.set(i.id, i));

    return items.map(i => {
      let path = i.name;
      let current = i;
      while (current.parent_id) {
        const parent = itemMap.get(current.parent_id);
        if (parent) {
          path = parent.name + ' >> ' + path;
          current = parent;
        } else {
          break;
        }
      }
      return { ...i, path };
    }).sort((a, b) => a.path.localeCompare(b.path));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, itemsRes] = await Promise.all([
          getCategories(),
          getMenuItems(menuId)
        ]);

        if (catsRes.success) {
          setCategories(buildCategoryPaths(catsRes.data));
        }
        if (itemsRes.success) {
          // Filter out the current item from parents if editing
          let availableParents = itemsRes.data;
          if (editId) {
            availableParents = availableParents.filter((item: any) => item.id !== editId && item.parent_id !== editId);
          }
          setMenuItems(buildItemPaths(availableParents));
        }

        if (editId) {
          const itemRes = await getMenuItem(editId);
          if (itemRes.success) {
            const data = itemRes.data;
            setType(data.type);
            setName(data.name);
            setCategoryId(data.category_id?.toString() || '');
            setParentId(data.parent_id?.toString() || '');
            setOrder(data.sort_order?.toString() || '0');
            setTarget(data.target || '_self');
            setHighlightColor(data.highlight_color || '');
            setUrl(data.url || '');
          } else {
            toast.error('Item not found');
            router.push(`/admin/dashboard/menus/${menuId}/items`);
          }
        }
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [editId, menuId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        menu_id: menuId,
        type,
        name,
        category_id: type === 'category' ? (categoryId ? parseInt(categoryId) : null) : null,
        parent_id: parentId ? parseInt(parentId) : null,
        sort_order: parseInt(order),
        target,
        highlight_color: highlightColor,
        url: type === 'custom' ? url : null
      };

      const res = editId 
        ? await updateMenuItem(editId, payload)
        : await createMenuItem(payload);

      if (res.success) {
        toast.success(editId ? 'Item updated successfully' : 'Item created successfully');
        router.push(`/admin/dashboard/menus/${menuId}/items`);
      } else {
        toast.error(res.error || 'Failed to save item');
      }
    } catch (error) {
      toast.error('Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{editId ? 'Edit Item' : 'Add Item to Menu'}</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => router.push(`/admin/dashboard/menus/${menuId}/items`)} 
            className={styles.addBtn}
            style={{ backgroundColor: '#f97316' }}
          >
            Back to List
          </button>
        </div>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Type</label>
            <select 
              className={styles.input} 
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="category">Category</option>
              <option value="page">Page</option>
              <option value="custom">Custom Link</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Name</label>
            <input 
              type="text" 
              className={styles.input} 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Footwear"
              required
            />
          </div>

          {type === 'category' && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select 
                className={styles.input} 
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">-- Select Category --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.path}</option>
                ))}
              </select>
            </div>
          )}

          {type === 'custom' && (
            <div className={styles.formGroup}>
              <label className={styles.label}>URL</label>
              <input 
                type="text" 
                className={styles.input} 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>Parent Item</label>
            <select 
              className={styles.input} 
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
            >
              <option value="">-- None --</option>
              {menuItems.map(m => (
                <option key={m.id} value={m.id}>{m.path}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Order</label>
            <input 
              type="number" 
              className={styles.input} 
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Target</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="target" 
                  value="_self" 
                  checked={target === '_self'}
                  onChange={() => setTarget('_self')}
                />
                Self
              </label>
              <label className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="target" 
                  value="_blank" 
                  checked={target === '_blank'}
                  onChange={() => setTarget('_blank')}
                />
                Blank
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Menu Highlight Color</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="color" 
                value={highlightColor || '#000000'}
                onChange={(e) => setHighlightColor(e.target.value)}
                style={{ height: '40px', width: '40px', padding: '0', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
              <input 
                type="text" 
                className={styles.input} 
                value={highlightColor}
                onChange={(e) => setHighlightColor(e.target.value)}
                placeholder="Selected color hex"
                style={{ flex: 1 }}
              />
              <button 
                type="button" 
                onClick={() => setHighlightColor('')}
                style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                ⊗
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (editId ? 'Update Item' : 'Add Item')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CreateMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const menuId = parseInt(resolvedParams.id);
  
  return (
    <Suspense fallback={<div style={{ padding: '24px' }}>Loading...</div>}>
      <CreateItemForm menuId={menuId} />
    </Suspense>
  );
}
