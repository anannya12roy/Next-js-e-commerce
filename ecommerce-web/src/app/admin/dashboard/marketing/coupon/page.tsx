"use client";

import React, { useState, useEffect } from 'react';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/actions/couponActions';

export default function CouponPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // View State
  const [isFormView, setIsFormView] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'fixed',
    discount_amount: 0,
    min_spend: 0,
    max_discount: '',
    start_date: '',
    end_date: '',
    usage_limit_total: '',
    usage_limit_per_user: '',
    condition_type: 'none',
    condition_value: '',
    is_active: '1'
  });

  const fetchCoupons = async () => {
    try {
      const res = await getCoupons();
      setCoupons(res.success && Array.isArray(res.data) ? (res.data as any[]) : []);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openForm = (coupon?: any) => {
    if (coupon) {
      setEditingId(coupon.id);
      setFormData({
        code: coupon.code || '',
        discount_type: coupon.discount_type || 'fixed',
        discount_amount: coupon.discount_amount || 0,
        min_spend: coupon.min_spend || 0,
        max_discount: coupon.max_discount || '',
        start_date: coupon.start_date ? new Date(coupon.start_date).toISOString().slice(0, 16) : '',
        end_date: coupon.end_date ? new Date(coupon.end_date).toISOString().slice(0, 16) : '',
        usage_limit_total: coupon.usage_limit_total || '',
        usage_limit_per_user: coupon.usage_limit_per_user || '',
        condition_type: coupon.condition_type || 'none',
        condition_value: coupon.condition_value || '',
        is_active: coupon.is_active ? '1' : '0'
      });
    } else {
      setEditingId(null);
      setFormData({
        code: '', discount_type: 'fixed', discount_amount: 0, min_spend: 0,
        max_discount: '', start_date: '', end_date: '', usage_limit_total: '',
        usage_limit_per_user: '', condition_type: 'none', condition_value: '', is_active: '1'
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
    
    // Format payload
    const payload = {
      ...formData,
      discount_amount: Number(formData.discount_amount),
      min_spend: Number(formData.min_spend),
      max_discount: formData.max_discount ? Number(formData.max_discount) : null,
      usage_limit_total: formData.usage_limit_total ? Number(formData.usage_limit_total) : null,
      usage_limit_per_user: formData.usage_limit_per_user ? Number(formData.usage_limit_per_user) : null,
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      is_active: formData.is_active === '1',
      // For conditions like 'category' or 'product', parse condition_value into JSON if it's meant to be an array.
      // For simplicity here, we assume it's just stored as string or JSON string.
    };

    try {
      const res = editingId 
        ? await updateCoupon(editingId, payload)
        : await createCoupon(payload);
        
      if (res.success) {
        setIsFormView(false);
        fetchCoupons();
      } else {
        alert(`Error: ${res.error}`);
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(id);
        fetchCoupons();
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
            <h2 className="formCardTitle">{editingId ? 'Edit Coupon' : 'Add New Coupon'}</h2>
            <button className="backBtn" onClick={closeForm}>Back to List</button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="formBody">
              
              <div className="formRow">
                <div className="formLabel">Coupon Code *</div>
                <div className="inputWrapper">
                  <input 
                    type="text" 
                    className="inputField" 
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required 
                    placeholder="e.g. SUMMER50"
                  />
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">Discount Type</div>
                <div className="inputWrapper">
                  <select 
                    className="inputField" 
                    name="discount_type"
                    value={formData.discount_type}
                    onChange={handleInputChange}
                  >
                    <option value="fixed">Fixed Amount</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">Discount Amount *</div>
                <div className="inputWrapper">
                  <input 
                    type="number" 
                    className="inputField" 
                    name="discount_amount"
                    value={formData.discount_amount}
                    onChange={handleInputChange}
                    required 
                    min="0" step="0.01"
                  />
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">Minimum Spend</div>
                <div className="inputWrapper">
                  <input 
                    type="number" 
                    className="inputField" 
                    name="min_spend"
                    value={formData.min_spend}
                    onChange={handleInputChange}
                    min="0" step="0.01"
                  />
                </div>
              </div>

              {formData.discount_type === 'percentage' && (
                <div className="formRow">
                  <div className="formLabel">Max Discount Amount</div>
                  <div className="inputWrapper">
                    <input 
                      type="number" 
                      className="inputField" 
                      name="max_discount"
                      value={formData.max_discount}
                      onChange={handleInputChange}
                      min="0" step="0.01"
                    />
                  </div>
                </div>
              )}

              <div className="formRow">
                <div className="formLabel">Start Date</div>
                <div className="inputWrapper">
                  <input 
                    type="datetime-local" 
                    className="inputField" 
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">End Date</div>
                <div className="inputWrapper">
                  <input 
                    type="datetime-local" 
                    className="inputField" 
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">Total Usage Limit</div>
                <div className="inputWrapper">
                  <input 
                    type="number" 
                    className="inputField" 
                    name="usage_limit_total"
                    value={formData.usage_limit_total}
                    onChange={handleInputChange}
                    placeholder="Leave empty for unlimited"
                  />
                </div>
              </div>

              <div className="formRow">
                <div className="formLabel">Condition Type</div>
                <div className="inputWrapper">
                  <select 
                    className="inputField" 
                    name="condition_type"
                    value={formData.condition_type}
                    onChange={handleInputChange}
                  >
                    <option value="none">None (Applies to all)</option>
                    <option value="first_purchase">First Purchase Only</option>
                    <option value="next_purchase">Next Purchase Only</option>
                    <option value="total_orders">Based on Total Orders</option>
                    <option value="category">Category Specific</option>
                    <option value="product">Product Specific</option>
                  </select>
                </div>
              </div>

              {formData.condition_type !== 'none' && formData.condition_type !== 'first_purchase' && formData.condition_type !== 'next_purchase' && (
                <div className="formRow">
                  <div className="formLabel">Condition Value</div>
                  <div className="inputWrapper">
                    <input 
                      type="text" 
                      className="inputField" 
                      name="condition_value"
                      value={formData.condition_value}
                      onChange={handleInputChange}
                      placeholder={
                        formData.condition_type === 'total_orders' ? "e.g. 5 (min orders required)" : 
                        "e.g. [1, 2] (JSON array of IDs)"
                      }
                    />
                    <span className="helpText">
                      For categories/products, input an array of IDs like: [1, 5]
                    </span>
                  </div>
                </div>
              )}

              <div className="formRow">
                <div className="formLabel">Status</div>
                <div className="inputWrapper">
                  <select 
                    className="inputField" 
                    name="is_active"
                    value={formData.is_active}
                    onChange={handleInputChange}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="formFooter">
              <button type="button" className="backBtn" onClick={closeForm}>Cancel</button>
              <button type="submit" className="submitBtnCard">Save Coupon</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Coupons</h1>
        <div className="headerActions">
          <button className="addBtn" onClick={() => openForm()}>
            <span className="plusIcon">+</span> Add New Coupon
          </button>
        </div>
      </div>

      <div className="tableContainer">
        <table className="table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Condition</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No coupons found.</td></tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td><strong>{coupon.code}</strong></td>
                  <td>{coupon.discount_type === 'percentage' ? 'Percentage' : 'Fixed'}</td>
                  <td>{coupon.discount_amount} {coupon.discount_type === 'percentage' ? '%' : ''}</td>
                  <td>
                    {coupon.condition_type === 'none' ? 'All Orders' : 
                     coupon.condition_type === 'first_purchase' ? 'First Purchase' :
                     coupon.condition_type === 'next_purchase' ? 'Next Purchase' :
                     coupon.condition_type === 'total_orders' ? `Min ${coupon.condition_value} orders` :
                     coupon.condition_type}
                  </td>
                  <td>
                    <span className={`badge ${coupon.is_active ? 'badgeSuccess' : 'badgeError'}`}>
                      {coupon.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actionsCell">
                    <button className="iconBtn editBtn" onClick={() => openForm(coupon)} title="Edit">✏️</button>
                    <button className="iconBtn deleteBtn" onClick={() => handleDelete(coupon.id)} title="Delete">🗑️</button>
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
