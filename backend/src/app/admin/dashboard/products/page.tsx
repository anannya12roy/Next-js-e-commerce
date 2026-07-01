'use client';

import React, { useEffect, useState } from 'react';
import { getProducts, updateProductStatus } from '@/actions/productActions';
import { getCategories } from '@/actions/categoryActions';
import { getBrands } from '@/actions/brandActions';
import Link from 'next/link';

// Icon SVGs
const EyeIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EditIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const PlusIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>;
const TrashIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const CopyIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;

const ToggleSwitch = ({ checked, onChange, size = 'normal' }: any) => {
  const w = size === 'small' ? 32 : 40;
  const h = size === 'small' ? 18 : 22;
  const dotSize = size === 'small' ? 14 : 18;
  const transform = checked ? `translateX(${w - dotSize - 4}px)` : 'translateX(0)';
  return (
    <div 
      style={{
        width: w, height: h, borderRadius: h,
        backgroundColor: checked ? '#10b981' : '#e5e7eb', // Green when checked, gray when not
        position: 'relative', cursor: 'pointer', transition: '0.3s'
      }}
      onClick={onChange}
    >
      <div style={{
        width: dotSize, height: dotSize, borderRadius: '50%', backgroundColor: 'white',
        position: 'absolute', top: 2, left: 2, transform, transition: '0.3s'
      }} />
    </div>
  );
};

export default function AllProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [prodRes, catRes, brandRes] = await Promise.all([
        getProducts(),
        getCategories(),
        getBrands()
      ]);

      if (prodRes.success && prodRes.data) setProducts(prodRes.data);
      if (catRes.success && catRes.data) setCategories(catRes.data);
      if (brandRes.success && brandRes.data) setBrands(brandRes.data);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleToggle = async (productId: number, field: string, currentValue: boolean) => {
    // Optimistic UI update
    const newValue = !currentValue;
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, [field]: newValue } : p));
    
    // API call
    const res = await updateProductStatus(productId, field, newValue);
    if (!res.success) {
      // Revert on failure
      alert('Failed to update status: ' + res.error);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, [field]: currentValue } : p));
    }
  };

  const selectStyle = { backgroundColor: 'white', color: '#111827', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', outline: 'none' };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f4f7fa', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header Filters Card */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', margin: 0 }}>All Product</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select style={selectStyle}><option>Bulk Action</option></select>
            <select style={{ ...selectStyle, width: '150px' }}><option>Sort By</option></select>
            <input type="text" placeholder="Type & Enter" style={{ ...selectStyle, width: '200px' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#4b5563', marginBottom: '6px' }}>By Brand</label>
            <select style={{ ...selectStyle, width: '100%' }}>
              <option>Nothing Selected</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#4b5563', marginBottom: '6px' }}>By Category</label>
            <select style={{ ...selectStyle, width: '100%' }}>
              <option>Nothing Selected</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#4b5563', marginBottom: '6px' }}>Sub Category</label>
            <select style={{ ...selectStyle, width: '100%' }}><option>Nothing Selected</option></select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#4b5563', marginBottom: '6px' }}>Sub Sub Category</label>
            <select style={{ ...selectStyle, width: '100%' }}><option>Nothing Selected</option></select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#4b5563', marginBottom: '6px' }}>By Status</label>
            <select style={{ ...selectStyle, width: '100%' }}>
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: '#4b5563', marginBottom: '6px' }}>By Variant</label>
            <select style={{ ...selectStyle, width: '100%' }}>
              <option>All Variant</option>
              <option>Size</option>
              <option>Color</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
          <div style={{ width: '200px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#4b5563', marginBottom: '6px' }}>Stock availability</label>
            <select style={{ ...selectStyle, width: '100%' }}>
              <option>All Stock</option>
              <option>In Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>
          <button style={{ padding: '8px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>Search</button>
          <button style={{ padding: '8px 24px', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>Export</button>
          <button style={{ padding: '8px 24px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>Reset</button>
          <button style={{ padding: '8px 12px', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
        </div>
      </div>

      {/* Table Card */}
      <div style={{ backgroundColor: 'white', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', color: '#374151' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#ffffff' }}>
              <th style={{ padding: '16px 12px', textAlign: 'left', width: '40px' }}><input type="checkbox" /></th>
              <th style={{ padding: '16px 12px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '16px 12px', textAlign: 'left' }}>Style Code</th>
              <th style={{ padding: '16px 12px', textAlign: 'left' }}>SKU</th>
              <th style={{ padding: '16px 12px', textAlign: 'left' }}>OfferCollection</th>
              <th style={{ padding: '16px 12px', textAlign: 'left' }}>Page Section</th>
              <th style={{ padding: '16px 12px', textAlign: 'left' }}>Info</th>
              <th style={{ padding: '16px 12px', textAlign: 'left' }}>Total Stock</th>
              <th style={{ padding: '16px 12px', textAlign: 'left' }}>Published</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', width: '160px' }}>Quick Action</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', width: '180px' }}>Options</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={11} style={{ padding: '24px', textAlign: 'center' }}>Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={11} style={{ padding: '24px', textAlign: 'center' }}>No products found.</td></tr>
            ) : products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '16px 12px' }}><input type="checkbox" /></td>
                <td style={{ padding: '16px 12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    {product.thumbnail ? (
                      <img src={product.thumbnail} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', backgroundColor: '#f3f4f6' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '4px' }} />
                    )}
                    <div>
                      <div style={{ fontWeight: 500, color: '#111827', marginBottom: '4px' }}>{product.name}</div>
                      <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '2px' }}>
                        Category : <span style={{ color: '#3b82f6' }}>{product.category_name || 'Uncategorized'}</span>
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '11px' }}>
                        Brand : <span style={{ color: '#111827' }}>{product.brand_name || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 12px', color: '#9ca3af' }}>{product.style_code || '-'}</td>
                <td style={{ padding: '16px 12px', color: '#6b7280' }}>
                  {product.sku ? product.sku : (product.variants && product.variants.length > 0 ? product.variants[0].sku : '-')}
                </td>
                <td style={{ padding: '16px 12px' }}></td>
                <td style={{ padding: '16px 12px' }}></td>
                <td style={{ padding: '16px 12px', lineHeight: '1.6' }}>
                  <div style={{ fontWeight: 500, color: '#111827', fontSize: '11px' }}>Num of Sale : <span style={{ color: '#4b5563', fontWeight: 'normal' }}>0 times</span></div>
                  <div style={{ fontWeight: 500, color: '#111827', fontSize: '11px' }}>Base Price : <span style={{ color: '#4b5563', fontWeight: 'normal' }}>{parseFloat(product.price).toFixed(2)}</span></div>
                  <div style={{ fontWeight: 500, color: '#111827', fontSize: '11px' }}>Rating: <span style={{ color: '#4b5563', fontWeight: 'normal' }}>0</span></div>
                </td>
                <td style={{ padding: '16px 12px', color: '#4b5563', lineHeight: '1.6', fontSize: '11px' }}>
                  {product.variants && product.variants.length > 0 ? (
                    product.variants.map((v: any, i: number) => (
                      <div key={i}>{v.sku || product.sku || '-'} | {v.variant_name} - {v.opening_qty || 0} items</div>
                    ))
                  ) : (
                    <div>{product.stock || 0} items</div>
                  )}
                </td>
                <td style={{ padding: '16px 12px' }}>
                  <ToggleSwitch checked={product.is_published} onChange={() => handleToggle(product.id, 'is_published', product.is_published)} />
                </td>
                <td style={{ padding: '16px 12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px 8px', alignItems: 'center', fontSize: '11px' }}>
                    <span style={{ fontWeight: 600 }}>Featured :</span><ToggleSwitch size="small" checked={product.is_featured} onChange={() => handleToggle(product.id, 'is_featured', product.is_featured)} />
                    <span style={{ fontWeight: 600 }}>New Arrival :</span><ToggleSwitch size="small" checked={product.is_new_arrival} onChange={() => handleToggle(product.id, 'is_new_arrival', product.is_new_arrival)} />
                    <span style={{ fontWeight: 600 }}>Hot Deal :</span><ToggleSwitch size="small" checked={product.is_hot_deal} onChange={() => handleToggle(product.id, 'is_hot_deal', product.is_hot_deal)} />
                    <span style={{ fontWeight: 600 }}>Premium Quality :</span><ToggleSwitch size="small" checked={product.is_premium_quality} onChange={() => handleToggle(product.id, 'is_premium_quality', product.is_premium_quality)} />
                    <span style={{ fontWeight: 600 }}>Today Deal :</span><ToggleSwitch size="small" checked={product.is_today_deal} onChange={() => handleToggle(product.id, 'is_today_deal', product.is_today_deal)} />
                    <span style={{ fontWeight: 600 }}>Limited Time Deal :</span><ToggleSwitch size="small" checked={product.is_limited_deal} onChange={() => handleToggle(product.id, 'is_limited_deal', product.is_limited_deal)} />
                  </div>
                </td>
                <td style={{ padding: '16px 12px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><EyeIcon /></button>
                    <button style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><EditIcon /></button>
                    <button style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><PlusIcon /></button>
                    <button style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: '#ffe4e6', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><TrashIcon /></button>
                    <button style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><CopyIcon /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
