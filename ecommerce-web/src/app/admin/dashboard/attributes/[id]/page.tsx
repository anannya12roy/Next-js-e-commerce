"use client";

import React, { useState, useEffect, use } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { getAttribute, createAttributeValue, updateAttributeValue, deleteAttributeValue } from '@/actions/attributeActions';

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
  const attributeId = parseInt(resolvedParams.id);
  const router = useRouter();

  const [attribute, setAttribute] = useState<Attribute | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [value, setValue] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchAttributeAndValues = async () => {
    try {
      const res = await getAttribute(attributeId);
      if (res.success) {
        setAttribute(res.data as any);
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
    fetchAttributeAndValues();
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

      const res = editingId 
        ? await updateAttributeValue(editingId, payload)
        : await createAttributeValue(payload);

      if (res.success) {
        toast.success(editingId ? 'Value updated successfully!' : 'Value added successfully!');
        resetForm();
        fetchAttributeAndValues();
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
        const res = await deleteAttributeValue(id);
        if (res.success) {
          toast.success('Value deleted successfully');
          fetchAttributeAndValues();
        } else {
          toast.error(res.error || 'Failed to delete value');
        }
      } catch (error) {
        console.error('Delete failed:', error);
        toast.error('Network error occurred');
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Attribute Detail</h1>
        <button 
          className="exportBtn" 
          style={{ backgroundColor: '#6b7280' }} 
          onClick={() => router.push('/admin/dashboard/attributes')}
        >
          Back to List
        </button>
      </div>

      <div className="contentWrapper">
        
        {/* Main Content Area */}
        <div className="mainCol">
          <div className="cardHeader">
            {loading ? 'Loading...' : attribute?.name}
          </div>
          {loading ? (
            <p style={{ padding: '24px' }}>Loading values...</p>
          ) : (
            <table className="table">
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
                          className={`actionBtn editBtn`} 
                          onClick={() => handleEdit(val)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className={`actionBtn deleteBtn`} 
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
                    <td colSpan={4} className="emptyState">No values found for this attribute.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Sidebar Area */}
        <div className="sideCol">
          <div className="formCard">
            <div className="cardHeader">
              {editingId ? 'Edit Attribute Value' : 'Add New Attribute Value'}
            </div>
            <form onSubmit={handleSubmit} className="formBody">
              <div className="formGroup">
                <label className="label">Attribute Name</label>
                <input 
                  type="text" 
                  className="input" 
                  value={attribute?.name || ''}
                  disabled
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>

              <div className="formGroup">
                <label className="label">Attribute Value *</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g. Red, XL" 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              </div>

              <div className="formGroup">
                <label className="label">Sort Order</label>
                <input 
                  type="number" 
                  className="input" 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                {editingId && (
                  <button type="button" className="exportBtn" style={{ backgroundColor: '#9ca3af' }} onClick={resetForm}>
                    Cancel
                  </button>
                )}
                <button type="submit" className="submitBtn" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>

          <div className="formCard">
            <div className="cardHeader">
              Select Excel File
            </div>
            <div className="formBody">
              <div className="uploadGroup">
                <input type="file" className="input" style={{ flex: 1, padding: '6px' }} />
                <button className="uploadBtn">Upload</button>
                <button className="exportBtn">Export</button>
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
