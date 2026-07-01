"use client";

import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/actions/categoryActions';
import { getBrands } from '@/actions/brandActions';
import { useMediaModal } from '@/contexts/MediaModalContext';

interface Category {
  id: number;
  name: string;
  parent_category: number | null;
  brand: string;
  ordering_number: number;
  banner: string;
  category_image: string;
  slug: string;
  status: string;
  meta_title: string;
  meta_description: string;
}

export default function CategoryPage() {
  const { openMediaModal } = useMediaModal();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // View State
  const [isFormView, setIsFormView] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    parent_category: '',
    brand: '',
    ordering_number: 0,
    banner: '',
    category_image: '',
    slug: '',
    status: 'active',
    meta_title: '',
    meta_description: ''
  });

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.success && Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await getBrands();
      setBrands(res.success && Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openForm = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      setFormData({
        name: category.name || '',
        parent_category: category.parent_category?.toString() || '',
        brand: category.brand || '',
        ordering_number: category.ordering_number || 0,
        banner: category.banner || '',
        category_image: category.category_image || '',
        slug: category.slug || '',
        status: category.status || 'active',
        meta_title: category.meta_title || '',
        meta_description: category.meta_description || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', parent_category: '', brand: '', ordering_number: 0,
        banner: '', category_image: '', slug: '', status: 'active',
        meta_title: '', meta_description: ''
      });
    }
    setIsFormView(true);
  };

  const closeForm = () => {
    setIsFormView(false);
    setEditingId(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      parent_category: formData.parent_category ? parseInt(formData.parent_category) : null,
      ordering_number: parseInt(formData.ordering_number.toString())
    };

    try {
      const res = editingId 
        ? await updateCategory(editingId, payload)
        : await createCategory(payload);
        
      if (res.success) {
        setIsFormView(false);
        fetchCategories();
      } else {
        alert(`Error: ${res.error}`);
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  if (isFormView) {
    return (
      <div className="container">
        <div className="formCard">
          <div className="formCardHeader">
            <h2 className="formCardTitle">Category Information</h2>
            <button className="backBtn" onClick={closeForm}>Back to List</button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="formBody">
              
              <div className="formRow">
                <div className="formLabel">Name</div>
                <div className="inputWrapper">
                  <input type="text" name="name" className="inputField" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">Parent Category</div>
                <div className="inputWrapper">
                  <select name="parent_category" className="inputField" value={formData.parent_category} onChange={handleInputChange}>
                    <option value="">No Parent</option>
                    {categories.filter(c => c.id !== editingId).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">Brand</div>
                <div className="inputWrapper">
                  <select name="brand" className="inputField" value={formData.brand} onChange={handleInputChange}>
                    <option value="">Nothing selected</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">Ordering Number</div>
                <div className="inputWrapper">
                  <input type="number" name="ordering_number" className="inputField" placeholder="Order Level" value={formData.ordering_number} onChange={handleInputChange} />
                  <span className="helpText">Higher number has low priority</span>
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">Type</div>
                <div className="inputWrapper">
                  <select className="inputField">
                    <option>Physical</option>
                    <option>Digital</option>
                  </select>
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">Banner</div>
                <div className="inputWrapper">
                  <div className="fileInputWrapper">
                    <div className="fileInputBtn" onClick={() => {
                      openMediaModal({
                        onSelect: (files) => {
                          if (files.length > 0) {
                            setFormData(prev => ({ ...prev, banner: files[0].url }));
                          }
                        }
                      });
                    }}>Browse</div>
                    <input type="text" name="banner" className="fileInputText" placeholder="Choose File (URL for now)" value={formData.banner} onChange={handleInputChange} />
                  </div>
                  <span className="helpText">This image is visible in category page.</span>
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">Category Image</div>
                <div className="inputWrapper">
                  <div className="fileInputWrapper">
                    <div className="fileInputBtn" onClick={() => {
                      openMediaModal({
                        onSelect: (files) => {
                          if (files.length > 0) {
                            setFormData(prev => ({ ...prev, category_image: files[0].url }));
                          }
                        }
                      });
                    }}>Browse</div>
                    <input type="text" name="category_image" className="fileInputText" placeholder="Choose File (URL for now)" value={formData.category_image} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">Slug</div>
                <div className="inputWrapper">
                  <input type="text" name="slug" className="inputField" placeholder="Slug" value={formData.slug} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">Status</div>
                <div className="inputWrapper">
                  <select name="status" className="inputField" value={formData.status} onChange={handleInputChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">Meta Title</div>
                <div className="inputWrapper">
                  <input type="text" name="meta_title" className="inputField" placeholder="Meta Title" value={formData.meta_title} onChange={handleInputChange} />
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">Meta Description</div>
                <div className="inputWrapper">
                  <textarea name="meta_description" className="inputField" placeholder="Meta Description" value={formData.meta_description} onChange={handleInputChange} rows={3} />
                </div>
              </div>

            </div>
            
            <div className="formFooter">
              <button type="button" className="backBtn" onClick={closeForm}>Cancel</button>
              <button type="submit" className="submitBtnCard">
                {editingId ? 'Update Category' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Categories</h1>
        <button className="addBtn" onClick={() => openForm()}>+ Add New Category</button>
      </header>

      <div className="tableContainer">
        {loading ? (
          <p style={{ padding: '2rem' }}>Loading categories...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Slug</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>
                    {cat.category_image ? (
                      <img src={cat.category_image} alt={cat.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : '-'}
                  </td>
                  <td>{cat.name}</td>
                  <td>{cat.brand || '-'}</td>
                  <td>{cat.slug}</td>
                  <td>{cat.ordering_number}</td>
                  <td>
                    <span className={`status ${cat.status === 'active' ? 'statusActive' : 'statusInactive'}`}>
                      {cat.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="editBtn" onClick={() => openForm(cat)}>Edit</button>
                      <button className="deleteBtn" onClick={() => handleDelete(cat.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
