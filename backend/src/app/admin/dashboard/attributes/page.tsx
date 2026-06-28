"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import styles from './attributes.module.css';
import { getAttributes, createAttribute, updateAttribute, deleteAttribute } from '@/actions/attributeActions';

interface AttributeValue {
  id: number;
  value: string;
}

interface Attribute {
  id: number;
  name: string;
  values: AttributeValue[];
}

export default function AttributesPage() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const router = useRouter();

  const fetchAttributes = async () => {
    try {
      const res = await getAttributes();
      setAttributes(res.success && Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch attributes:', error);
      toast.error('Failed to load attributes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Attribute name is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = editingId 
        ? await updateAttribute(editingId, { name })
        : await createAttribute({ name });

      if (res.success) {
        toast.success(editingId ? 'Attribute updated successfully!' : 'Attribute created successfully!');
        resetForm();
        fetchAttributes();
      } else {
        toast.error(`Error: ${res.error || 'Something went wrong'}`);
      }
    } catch (error: any) {
      console.error('Save failed:', error);
      toast.error(`Error: ${error.message || 'Network error occurred'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (attr: Attribute) => {
    setEditingId(attr.id);
    setName(attr.name);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this attribute? All its values will also be deleted.')) {
      try {
        const res = await deleteAttribute(id);
        if (res.success) {
          toast.success('Attribute deleted successfully');
          fetchAttributes();
        } else {
          toast.error('Failed to delete attribute');
        }
      } catch (error) {
        console.error('Delete failed:', error);
        toast.error('Network error occurred');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        
        {/* Main Content Area */}
        <div className={styles.mainCol}>
          <div className={styles.cardHeader}>
            Attributes
          </div>
          {loading ? (
            <p style={{ padding: '24px' }}>Loading attributes...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Values</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {attributes.map((attr, index) => (
                  <tr key={attr.id}>
                    <td>{index + 1}</td>
                    <td>{attr.name}</td>
                    <td>
                      <div className={styles.valuesContainer}>
                        {attr.values && attr.values.length > 0 ? (
                          attr.values.map(val => (
                            <span key={val.id} className={styles.valueChip}>{val.value}</span>
                          ))
                        ) : (
                          <span style={{ color: '#9ca3af', fontSize: '12px' }}>No values yet</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex' }}>
                        <button 
                          className={`${styles.actionBtn} ${styles.settingsBtn}`} 
                          onClick={() => router.push(`/admin/dashboard/attributes/${attr.id}`)}
                          title="Settings/Details"
                        >
                          ⚙️
                        </button>
                        <button 
                          className={`${styles.actionBtn} ${styles.editBtn}`} 
                          onClick={() => handleEdit(attr)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                          onClick={() => handleDelete(attr.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {attributes.length === 0 && (
                  <tr>
                    <td colSpan={4} className={styles.emptyState}>No attributes found. Create one on the right!</td>
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
              {editingId ? 'Edit Attribute' : 'Add New Attribute'}
            </div>
            <form onSubmit={handleSubmit} className={styles.formBody}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Name</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="e.g. Color, Size" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
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
        </div>

      </div>
    </div>
  );
}
