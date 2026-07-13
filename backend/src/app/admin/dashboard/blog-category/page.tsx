"use client";

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getBlogCategories, createBlogCategory } from '@/actions/blogActions';

export default function BlogCategoryListPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    const res = await getBlogCategories();
    if (res.success && res.data) {
      setCategories(res.data);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Category Name is required');
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await createBlogCategory({ name });
      if (res.success) {
        toast.success(res.message || 'Blog category created successfully');
        setName('');
        setIsModalOpen(false);
        fetchCategories(); // Refresh list
      } else {
        toast.error(res.error || 'Failed to create blog category');
      }
    } catch (e) {
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container" style={{ position: 'relative' }}>
      <div className="card">
        <div className="cardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Blog Categories</span>
          <button 
            className="actionButton" 
            style={{ backgroundColor: '#f97316' }}
            onClick={() => setIsModalOpen(true)}
          >
            Add New Category
          </button>
        </div>
        <div className="cardBody">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={2} style={{ padding: '16px', textAlign: 'center' }}>No categories found.</td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px' }}>{category.name}</td>
                      <td style={{ padding: '12px 16px' }}>{new Date(category.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div 
            className="card" 
            style={{ width: '500px', margin: 0 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <div className="cardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Blog Category Information</span>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>
            <div className="cardBody">
              <div className="formGroup" style={{ marginBottom: '16px' }}>
                <label className="label">Name</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '4px', outline: 'none' }}
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button 
                  type="button" 
                  className="actionButton"
                  style={{ backgroundColor: '#f97316' }}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
