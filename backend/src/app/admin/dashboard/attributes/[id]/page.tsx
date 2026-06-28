"use client";

import React, { useState, useEffect, use } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import styles from '../attributes.module.css';

interface AttributeValue {
  id: number;
  value: string;
  alias_value: string;
  sort_order: number;
}

interface Attribute {
  id: number;
  name: string;
  values: AttributeValue[];
}

export default function AttributeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const attributeId = resolvedParams.id;
  const router = useRouter();

  const [attribute, setAttribute] = useState<Attribute | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [value, setValue] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchAttribute = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/attributes/${attributeId}`);
      if (res.ok) {
        const data = await res.json();
        setAttribute(data);
      } else {
        toast.error('Attribute not found');
        router.push('/admin/dashboard/attributes');
      }
    } catch (error) {
      console.error('Failed to fetch attribute:', error);
      toast.error('Failed to load attribute details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttribute();
  }, [attributeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      toast.error('Value is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        attribute_id: attributeId,
        value,
        sort_order: parseInt(sortOrder) || 0
      };

      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:5000/api/attribute-values/${editingId}`
        : 'http://localhost:5000/api/attribute-values';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(editingId ? 'Value updated successfully!' : 'Value added successfully!');
        resetForm();
        fetchAttribute();
      } else {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.error || 'Something went wrong'}`);
      }
    } catch (error: any) {
      console.error('Save failed:', error);
      toast.error(`Error: ${error.message || 'Network error occurred'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (val: AttributeValue) => {
    setEditingId(val.id);
    setValue(val.value);
    setSortOrder(val.sort_order.toString());
  };

  const resetForm = () => {
    setEditingId(null);
    setValue('');
    setSortOrder('0');
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this value?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/attribute-values/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Value deleted successfully');
          fetchAttribute();
        } else {
          toast.error('Failed to delete value');
        }
      } catch (error) {
        console.error('Delete failed:', error);
        toast.error('Network error occurred');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Attribute Detail</h1>
        <button 
          className={styles.exportBtn} 
          style={{ backgroundColor: '#6b7280' }} 
          onClick={() => router.push('/admin/dashboard/attributes')}
        >
          Back to List
        </button>
      </div>

      <div className={styles.contentWrapper}>
        
        {/* Main Content Area */}
        <div className={styles.mainCol}>
          <div className={styles.cardHeader}>
            {loading ? 'Loading...' : attribute?.name}
          </div>
          {loading ? (
            <p style={{ padding: '24px' }}>Loading values...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Value</th>
                  <th>Sort Order</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {attribute?.values && attribute.values.map((val, index) => (
                  <tr key={val.id}>
                    <td>{index + 1}</td>
                    <td>{val.value}</td>
                    <td>{val.sort_order}</td>
                    <td>
                      <div style={{ display: 'flex' }}>
                        <button 
                          className={`${styles.actionBtn} ${styles.editBtn}`} 
                          onClick={() => handleEdit(val)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                          onClick={() => handleDelete(val.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!attribute?.values || attribute.values.length === 0) && (
                  <tr>
                    <td colSpan={4} className={styles.emptyState}>No values found for this attribute.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Sidebar Area */}
        <div className={styles.sideCol}>
          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              {editingId ? 'Edit Attribute Value' : 'Add New Attribute Value'}
            </div>
            <form onSubmit={handleSubmit} className={styles.formBody}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Attribute Name</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={attribute?.name || ''}
                  disabled
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Attribute Value *</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="e.g. Red, XL" 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Sort Order</label>
                <input 
                  type="number" 
                  className={styles.input} 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                {editingId && (
                  <button type="button" className={styles.exportBtn} style={{ backgroundColor: '#9ca3af' }} onClick={resetForm}>
                    Cancel
                  </button>
                )}
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>

          <div className={styles.formCard}>
            <div className={styles.cardHeader}>
              Select Excel File
            </div>
            <div className={styles.formBody}>
              <div className={styles.uploadGroup}>
                <input type="file" className={styles.input} style={{ flex: 1, padding: '6px' }} />
                <button className={styles.uploadBtn}>Upload</button>
                <button className={styles.exportBtn}>Export</button>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                * Excel upload is visual placeholder for now.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
