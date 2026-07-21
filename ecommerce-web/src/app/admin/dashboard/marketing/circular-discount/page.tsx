"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCirculars, createCircular, updateCircular, deleteCircular } from '@/actions/circularDiscountActions';

export default function CircularDiscountPage() {
  const [circulars, setCirculars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // View State
  const [isFormView, setIsFormView] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    circular_number: '',
    start_time: '',
    end_time: '',
    status: 'Active'
  });

  const fetchCirculars = async () => {
    try {
      const res = await getCirculars();
      setCirculars(res.success && Array.isArray(res.data) ? (res.data as any[]) : []);
    } catch (error) {
      console.error('Failed to fetch circulars:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCirculars();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openForm = (circular?: any) => {
    if (circular) {
      setEditingId(circular.id);
      setFormData({
        circular_number: circular.circular_number || '',
        start_time: circular.start_time ? new Date(circular.start_time).toISOString().slice(0, 16) : '',
        end_time: circular.end_time ? new Date(circular.end_time).toISOString().slice(0, 16) : '',
        status: circular.status || 'Active'
      });
    } else {
      setEditingId(null);
      setFormData({
        circular_number: '', start_time: '', end_time: '', status: 'Active'
      });
    }
    setIsFormView(true);
  };

  const closeForm = () => {
    setIsFormView(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      start_time: formData.start_time ? new Date(formData.start_time).toISOString() : null,
      end_time: formData.end_time ? new Date(formData.end_time).toISOString() : null,
    };

    try {
      const res = editingId 
        ? await updateCircular(editingId, payload)
        : await createCircular(payload);
        
      if (res.success) {
        setIsFormView(false);
        fetchCirculars();
      } else {
        alert(`Error: ${res.error}`);
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this circular and all its items?')) {
      try {
        await deleteCircular(id);
        fetchCirculars();
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
            <h2 className="formCardTitle">{editingId ? 'Edit Circular' : 'Create Circular'}</h2>
            <button className="backBtn" onClick={closeForm}>Back to List</button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="formBody">
              <div className="formRow">
                <div className="formLabel">Circular Number *</div>
                <div className="inputWrapper">
                  <input 
                    type="text" 
                    className="inputField" 
                    name="circular_number"
                    value={formData.circular_number}
                    onChange={handleInputChange}
                    required 
                    placeholder="e.g. 35467475"
                  />
                </div>
              </div>

              <div className="formRow" style={{ alignItems: 'center' }}>
                <div className="formLabel" style={{ flex: '0 0 200px' }}>Start Date</div>
                <div className="inputWrapper" style={{ flex: '1' }}>
                  <input 
                    type="datetime-local" 
                    className="inputField" 
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="formRow" style={{ alignItems: 'center' }}>
                <div className="formLabel" style={{ flex: '0 0 200px' }}>End Date</div>
                <div className="inputWrapper" style={{ flex: '1' }}>
                  <input 
                    type="datetime-local" 
                    className="inputField" 
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="formRow" style={{ alignItems: 'center' }}>
                <div className="formLabel" style={{ flex: '0 0 200px' }}>Status</div>
                <div className="inputWrapper" style={{ flex: '1' }}>
                  <select 
                    className="inputField" 
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '20px', backgroundColor: '#fff', borderTop: 'none', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
              <button type="button" onClick={closeForm} style={{ backgroundColor: '#1c2434', color: 'white', padding: '10px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>Back</button>
              <button type="submit" style={{ backgroundColor: '#f28b24', color: 'white', padding: '10px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">All Circular</h1>
        <div className="headerActions">
          <button className="addBtn" style={{ backgroundColor: '#00c389' }} onClick={() => openForm()}>
            Create Circular Discount
          </button>
        </div>
      </div>

      {/* Filter Section mapping to screenshot */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div className="formCard" style={{ flex: 1, padding: '15px' }}>
           <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" className="inputField" placeholder="CNo. to Active/Deactivate" />
              <select className="inputField"><option>All Status</option></select>
           </div>
           <div style={{ textAlign: 'right', marginTop: '10px' }}>
              <button className="submitBtnCard" style={{ backgroundColor: '#00c389' }}>Update</button>
           </div>
        </div>
        
        <div className="formCard" style={{ flex: 2, padding: '15px' }}>
           <div style={{ display: 'flex', gap: '10px' }}>
              <select className="inputField"><option>All Status</option></select>
              <input type="text" className="inputField" placeholder="Type & Enter" />
              <input type="text" className="inputField" placeholder="Type Discount Percentage & Enter" />
           </div>
           <div style={{ textAlign: 'right', marginTop: '10px' }}>
              <button className="submitBtnCard" style={{ backgroundColor: '#ff8a00', marginRight: '10px' }}>Sort</button>
              <button className="submitBtnCard" style={{ backgroundColor: '#ff4d6d' }}>Reset</button>
           </div>
        </div>
      </div>

      <div className="tableContainer">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Circular Number</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
            ) : circulars.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No circulars found.</td></tr>
            ) : (
              circulars.map((circular, index) => (
                <tr key={circular.id}>
                  <td>{index + 1}</td>
                  <td>{circular.circular_number}</td>
                  <td>{new Date(circular.start_time).toLocaleString()}</td>
                  <td>{new Date(circular.end_time).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${circular.status === 'Active' ? 'badgeSuccess' : 'badgeError'}`} style={circular.status === 'Active' ? {backgroundColor: '#00c389'} : {}}>
                      {circular.status}
                    </span>
                  </td>
                  <td className="actionsCell">
                    <Link href={`/admin/dashboard/marketing/circular-discount/${circular.id}`}>
                      <button className="iconBtn" style={{ backgroundColor: '#2196f3', color: 'white', padding: '5px 10px', borderRadius: '4px', margin: '0 2px' }} title="Add Items">+</button>
                    </Link>
                    <button className="iconBtn editBtn" style={{ backgroundColor: '#00c389', color: 'white', padding: '5px 10px', borderRadius: '4px', margin: '0 2px' }} onClick={() => openForm(circular)} title="Edit">✏️</button>
                    <button className="iconBtn deleteBtn" style={{ backgroundColor: '#ff4d6d', color: 'white', padding: '5px 10px', borderRadius: '4px', margin: '0 2px' }} onClick={() => handleDelete(circular.id)} title="Delete">🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
