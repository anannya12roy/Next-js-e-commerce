"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getBrands, createBrand, updateBrand, deleteBrand } from '@/actions/brandActions';
import { useMediaModal } from '@/contexts/MediaModalContext';

interface Brand {
  id: number;
  name: string;
  logo: string;
  status: string;
  meta_title: string;
  meta_description: string;
}

export default function BrandPage() {
  const { openMediaModal } = useMediaModal();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  
  // View State
  const [isFormView, setIsFormView] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    status: 'active',
    meta_title: '',
    meta_description: ''
  });

  const fetchBrands = async () => {
    try {
      const res = await getBrands();
      setBrands(res.success && Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openForm = (brand?: Brand) => {
    if (brand) {
      setEditingId(brand.id);
      setFormData({
        name: brand.name || '',
        logo: brand.logo || '',
        status: brand.status || 'active',
        meta_title: brand.meta_title || '',
        meta_description: brand.meta_description || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', logo: '', status: 'active',
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
    try {
      const res = editingId 
        ? await updateBrand(editingId, formData)
        : await createBrand(formData);
        
      if (res.success) {
        setIsFormView(false);
        fetchBrands();
        toast.success(editingId ? 'Brand updated successfully!' : 'Brand created successfully!');
      } else {
        toast.error(`Error: ${res.error || 'Something went wrong'}`);
      }
    } catch (error: any) {
      console.error('Save failed:', error);
      toast.error(`Error: ${error.message || 'Network error occurred'}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      try {
        await deleteBrand(id);
        fetchBrands();
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
            <h2 className="formCardTitle">Brand Information</h2>
            <button className="backBtn" onClick={closeForm}>Back to List</button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="formBody">
              
              <div className="formRow">
                <div className="formLabel">Name</div>
                <div className="inputWrapper">
                  <input type="text" name="name" className="inputField" placeholder="Brand Name" value={formData.name} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">Logo</div>
                <div className="inputWrapper">
                  <div className="fileInputWrapper">
                    <div className="fileInputBtn" onClick={() => {
                      openMediaModal({
                        onSelect: (files) => {
                          if (files.length > 0) {
                            setFormData(prev => ({ ...prev, logo: files[0].url }));
                          }
                        }
                      });
                    }}>Browse</div>
                    <input type="text" name="logo" className="fileInputText" placeholder="Choose File (URL for now)" value={formData.logo} onChange={handleInputChange} />
                  </div>
                  <span className="helpText">Upload the brand logo here.</span>
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
                {editingId ? 'Update Brand' : 'Save'}
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
        <h1 className="title">Brands</h1>
        <button className="addBtn" onClick={() => openForm()}>+ Add New Brand</button>
      </header>

      <div className="tableContainer">
        {loading ? (
          <p style={{ padding: '2rem' }}>Loading brands...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Logo</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td>{brand.id}</td>
                  <td>
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : '-'}
                  </td>
                  <td>{brand.name}</td>
                  <td>
                    <span className={`status ${brand.status === 'active' ? 'statusActive' : 'statusInactive'}`}>
                      {brand.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="editBtn" onClick={() => openForm(brand)}>Edit</button>
                      <button className="deleteBtn" onClick={() => handleDelete(brand.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No brands found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
