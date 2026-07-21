"use client";

import React, { useState, useEffect, useRef } from 'react';
import { getCategories } from '@/actions/categoryActions';
import { getBrands } from '@/actions/brandActions';
import { exportProducts } from '@/actions/productActions';
import toast from 'react-hot-toast';

const MultiSelect = ({ options, value, onChange, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optValue: any) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v: any) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const removeOption = (e: any, optValue: any) => {
    e.stopPropagation();
    onChange(value.filter((v: any) => v !== optValue));
  };

  return (
    <div className="searchableSelectContainer" ref={dropdownRef}>
      <div 
        className="searchableSelectHeader" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: value.length > 0 ? '4px 12px' : '8px 12px' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', flex: 1 }}>
          {value.length > 0 ? (
            value.map((val: any) => {
              const opt = options.find((o: any) => o.value === val);
              return opt ? (
                <span key={val} className="multiSelectChip">
                  {opt.label}
                  <button type="button" onClick={(e) => removeOption(e, val)} className="multiSelectCloseBtn">&times;</button>
                </span>
              ) : null;
            })
          ) : placeholder}
        </div>
        <span className="dropdownIcon">▼</span>
      </div>
      
      {isOpen && (
        <div className="searchableSelectDropdown">
          <ul className="searchableSelectList">
            {options.map((opt: any) => {
              const isSelected = value.includes(opt.value);
              return (
                <li 
                  key={opt.value} 
                  className={`searchableSelectItem ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleOption(opt.value)}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function ExportProductPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const exportFields = [
    { value: 'name', label: 'Product Name' },
    { value: 'barcode', label: 'Barcode' },
    { value: 'slug', label: 'Slug' },
    { value: 'price', label: 'Price' },
    { value: 'stock', label: 'Stock' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
        
        if (catRes.success) setCategories(catRes.data as any[]);
        if (brandRes.success) setBrands(brandRes.data as any[]);
      } catch (e) {
        console.error("Failed to fetch data:", e);
      }
    };
    fetchData();
  }, []);

  const handleDownload = async () => {
    if (selectedFields.length === 0) {
      toast.error('Please select at least one field to export');
      return;
    }

    setIsExporting(true);
    try {
      const res = await exportProducts(selectedCategory || null, selectedBrand || null);
      if (!res.success) {
        toast.error('Failed to export products');
        setIsExporting(false);
        return;
      }

      const products = res.data as any[];
      if (!products || products.length === 0) {
        toast.error('No products found for the selected criteria');
        setIsExporting(false);
        return;
      }

      // Generate CSV
      const headers = selectedFields.map(f => exportFields.find(ef => ef.value === f)?.label || f);
      const csvRows = [];
      csvRows.push(headers.join(','));

      for (const product of products) {
        const values = selectedFields.map(field => {
          // Some fields might need special mapping, for now just match keys directly
          // We don't have slug in DB from earlier inspection, but we can just use name to generate one or output empty if not there
          let val = product[field];
          if (field === 'slug' && !val) {
             val = product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
          }
          
          if (val === null || val === undefined) val = '';
          
          // Escape quotes for CSV
          const escapedVal = String(val).replace(/"/g, '""');
          return `"${escapedVal}"`;
        });
        csvRows.push(values.join(','));
      }

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "products_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Export successful!');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="cardHeader">
          Product Info Download
        </div>
        
        <div className="cardBody" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="formGroup">
            <label className="label">Select Category</label>
            <select 
              className="select" 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="formGroup">
            <label className="label">Select Brand</label>
            <select 
              className="select" 
              value={selectedBrand} 
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">All Brands</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="formGroup">
            <label className="label">Select What To Export</label>
            <MultiSelect 
              options={exportFields}
              value={selectedFields}
              onChange={setSelectedFields}
              placeholder="Nothing selected"
            />
          </div>

          <div style={{ marginTop: '8px' }}>
            <button 
              onClick={handleDownload}
              disabled={isExporting}
              className="actionButton"
              style={{ backgroundColor: '#0ea5e9' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              {isExporting ? 'Downloading...' : 'Download'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
