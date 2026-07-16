"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getCircularById, getCircularItems, searchProductByBarcode, addCircularItem, removeCircularItem } from '@/actions/circularDiscountActions';

export default function CircularDiscountDetailsPage() {
  const { id } = useParams();
  const circularId = Number(id);

  const [circular, setCircular] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Item State
  const [barcodeInput, setBarcodeInput] = useState('');
  const [foundProduct, setFoundProduct] = useState<any>(null);
  const [discountPercent, setDiscountPercent] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  
  const fetchData = async () => {
    try {
      const circRes = await getCircularById(circularId);
      if (circRes.success) setCircular(circRes.data);

      const itemsRes = await getCircularItems(circularId);
      if (itemsRes.success) setItems(itemsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [circularId]);

  const handleSearchBarcode = async () => {
    if (!barcodeInput) return;
    const res = await searchProductByBarcode(barcodeInput);
    if (res.success) {
      setFoundProduct(res.data);
    } else {
      alert('Product not found with this barcode');
      setFoundProduct(null);
    }
  };

  const handleAddItem = async () => {
    if (!foundProduct) return;
    
    const payload = {
      circular_id: circularId,
      product_id: foundProduct.id,
      barcode: foundProduct.barcode,
      discount_percent: discountPercent ? Number(discountPercent) : 0,
      discount_amount: discountAmount ? Number(discountAmount) : 0,
      // Default to parent start/end time unless overriden
      start_time: circular?.start_time,
      end_time: circular?.end_time,
      status: 'Active'
    };

    const res = await addCircularItem(payload);
    if (res.success) {
      // Reset form
      setBarcodeInput('');
      setFoundProduct(null);
      setDiscountPercent('');
      setDiscountAmount('');
      fetchData();
    } else {
      alert(\`Error: \${res.error}\`);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (confirm('Remove this product from the circular?')) {
      const res = await removeCircularItem(itemId);
      if (res.success) {
        fetchData();
      }
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (!circular) return <div style={{ padding: '20px' }}>Circular not found</div>;

  return (
    <div className="container">
      {/* Header matching screenshot */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/admin/dashboard/marketing/circular-discount">
            <button className="backBtn" style={{ padding: '5px 15px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px' }}>
              « Back
            </button>
          </Link>
          <h2 style={{ fontSize: '20px', margin: 0 }}>Circular Number : {circular.circular_number}</h2>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select className="inputField" style={{ width: '150px' }}>
            <option>All Category</option>
          </select>
          <button className="submitBtnCard" style={{ backgroundColor: '#ff8a00', padding: '5px 15px' }}>Export</button>
          <button className="submitBtnCard" style={{ backgroundColor: '#00bbf9', padding: '5px 15px' }}>Import</button>
        </div>
      </div>

      {/* Add / Search Panel matching screenshot layout closely */}
      <div className="formCard" style={{ padding: '15px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', color: '#555' }}>Bar code</label>
            <input 
              type="text" 
              className="inputField" 
              placeholder="Enter Barcode" 
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', color: '#555' }}>Type</label>
            <select className="inputField"><option>All</option></select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', color: '#555' }}>Status</label>
            <select className="inputField"><option>Select Now</option></select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', color: '#555' }}>Amount (or %)</label>
            <div style={{ display: 'flex', gap: '5px' }}>
              <input 
                type="number" 
                className="inputField" 
                placeholder="%" 
                style={{ width: '40%' }}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
              />
              <input 
                type="number" 
                className="inputField" 
                placeholder="Amount" 
                style={{ width: '60%' }}
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="submitBtnCard" style={{ backgroundColor: '#ff8a00' }} onClick={handleSearchBarcode}>Search Product</button>
          {foundProduct && (
            <button className="submitBtnCard" style={{ backgroundColor: '#00c389' }} onClick={handleAddItem}>
              Add {foundProduct.name} to Circular
            </button>
          )}
          <button className="submitBtnCard" style={{ backgroundColor: '#00bbf9' }}>Export</button>
          <button className="submitBtnCard" style={{ backgroundColor: '#ff4d6d' }} onClick={() => {
            setBarcodeInput(''); setFoundProduct(null); setDiscountAmount(''); setDiscountPercent('');
          }}>Reset</button>
        </div>
      </div>

      {/* Items Table */}
      <div className="tableContainer">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Barcode</th>
              <th>Disc Percent</th>
              <th>Disc Amount Price</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', padding: '20px' }}>Total Data : 0</td></tr>
            ) : (
              items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.product_name}</td>
                  <td>{item.barcode}</td>
                  <td>{item.discount_percent}%</td>
                  <td>৳ {item.discount_amount}</td>
                  <td>{new Date(item.start_time).toLocaleString()}</td>
                  <td>{new Date(item.end_time).toLocaleString()}</td>
                  <td>
                    <span style={{ color: item.status === 'Active' ? '#00c389' : 'red' }}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="iconBtn deleteBtn" onClick={() => handleDeleteItem(item.id)}>🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {items.length > 0 && <div style={{ padding: '10px', fontSize: '14px', fontWeight: 'bold' }}>Total Data : {items.length}</div>}
      </div>
    </div>
  );
}
