"use client";

import React, { useState, useEffect, use } from 'react';
import toast from 'react-hot-toast';
import styles from '../features.module.css';
import { getFeatures, createFeature, updateFeature, deleteFeature } from '@/actions/featureActions';

interface Feature {
  id: number;
  type: string;
  name: string;
  description: string;
  image?: string;
  status?: string;
}

export default function FeaturesPage({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = use(params);
  const type = resolvedParams.type; // e.g. "fabrication"

  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const showImage = type === 'author';
  const showStatus = type === 'author' || type === 'publication';

  const formatTitle = (str: string) => {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const fetchFeatures = async () => {
    try {
      const res = await getFeatures(type);
      setFeatures(res.success && Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch features:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (showStatus) formData.append('status', status);
      if (showImage && imageFile) formData.append('image', imageFile);

      const res = editingId 
        ? await updateFeature(type, editingId, formData)
        : await createFeature(type, formData);

      if (res.success) {
        toast.success(editingId ? 'Updated successfully!' : 'Created successfully!');
        resetForm();
        fetchFeatures();
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

  const handleEdit = (item: Feature) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description || '');
    setStatus(item.status || 'Active');
    setImageFile(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setStatus('Active');
    setImageFile(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const res = await deleteFeature(type, id);
        if (res.success) {
          toast.success('Deleted successfully');
          fetchFeatures();
        } else {
          toast.error(res.error || 'Failed to delete');
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
        <h1 className={styles.title}>{formatTitle(type)}</h1>
      </div>

      <div className={styles.contentWrapper}>
        
        {/* Main Content Area */}
        <div className={styles.mainCol}>
          <div className={styles.cardHeader}>
            All {formatTitle(type)}
          </div>
          {loading ? (
            <p style={{ padding: '24px' }}>Loading items...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  {showImage && <th>Image</th>}
                  {showStatus && <th>Status</th>}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {features.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.description || <span style={{color: '#9ca3af', fontSize: '12px'}}>No description</span>}</td>
                    {showImage && (
                      <td>
                        {item.image ? (
                          <img src={`http://localhost:5000${item.image}`} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          <span style={{color: '#9ca3af', fontSize: '12px'}}>No image</span>
                        )}
                      </td>
                    )}
                    {showStatus && (
                      <td>
                        <span style={{
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '12px',
                          backgroundColor: item.status === 'Active' ? '#dcfce7' : '#f3f4f6',
                          color: item.status === 'Active' ? '#166534' : '#374151'
                        }}>
                          {item.status || 'Active'}
                        </span>
                      </td>
                    )}
                    <td>
                      <div style={{ display: 'flex' }}>
                        <button 
                          className={`${styles.actionBtn} ${styles.editBtn}`} 
                          onClick={() => handleEdit(item)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {features.length === 0 && (
                  <tr>
                    <td colSpan={4} className={styles.emptyState}>No items found. Create one on the right!</td>
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
              {editingId ? `Edit ${formatTitle(type)}` : `Add New ${formatTitle(type)}`}
            </div>
            <form onSubmit={handleSubmit} className={styles.formBody}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Name *</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder={`e.g. Enter ${formatTitle(type).toLowerCase()} name`} 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea 
                  className={`${styles.input} ${styles.textarea}`} 
                  placeholder="Enter description..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {showImage && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Image</label>
                  <input 
                    type="file" 
                    className={styles.input} 
                    onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                    accept="image/*"
                  />
                </div>
              )}

              {showStatus && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Status</label>
                  <select 
                    className={styles.input} 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              )}
              
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
