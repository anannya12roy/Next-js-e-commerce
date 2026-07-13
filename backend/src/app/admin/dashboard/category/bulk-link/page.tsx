"use client";

import React, { useState } from 'react';
import { getCategories } from '@/actions/categoryActions';
import toast from 'react-hot-toast';

export default function CategoryBulkLinkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDownloadSkeleton = () => {
    // Generate the exact skeleton CSV as shown in screenshot 1
    const csvContent = 'product_id,category_id\n27907,"167,8,33"\n';
    downloadCsv(csvContent, 'category_link.csv');
  };

  const handleDownloadCategory = async () => {
    try {
      const res = await getCategories();
      if (res.success && res.data) {
        let csvContent = 'ID,Name,Parent Category ID\n';
        res.data.forEach((cat: any) => {
          csvContent += `"${cat.id}","${cat.name.replace(/"/g, '""')}","${cat.parent_category || ''}"\n`;
        });
        downloadCsv(csvContent, 'categories_id.csv');
      } else {
        toast.error('Failed to download categories');
      }
    } catch (e) {
      toast.error('Error downloading categories');
    }
  };

  const downloadCsv = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = () => {
    if (!file) {
      toast.error('Please select a file first.');
      return;
    }
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      toast.success('Category links uploaded successfully! (Mock)');
      setIsUploading(false);
      setFile(null);
    }, 1500);
  };

  const orangeBtnStyle = {
    backgroundColor: '#f37920',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginRight: '8px'
  };

  const greenBtnStyle = {
    backgroundColor: '#04c071',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  return (
    <div className="container">
      {/* First Card: Instructions & Downloads */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="cardHeader">
          Category Bulk Upload
        </div>
        <div className="cardBody">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button type="button" style={orangeBtnStyle} onClick={handleDownloadSkeleton}>
              Download XLSX
            </button>
            
            <button type="button" style={greenBtnStyle} onClick={handleDownloadCategory}>
              Download Category
            </button>
          </div>
        </div>
      </div>

      {/* Second Card: File Upload */}
      <div className="card">
        <div className="cardHeader">
          Upload File
        </div>
        <div className="cardBody">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ 
              display: 'flex', 
              border: '1px solid #e5e7eb', 
              borderRadius: '4px', 
              overflow: 'hidden',
              flex: 1,
              maxWidth: '600px'
            }}>
              <div style={{ 
                flex: 1, 
                padding: '8px 12px', 
                color: file ? '#333' : '#9ca3af',
                backgroundColor: '#fff',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {file ? file.name : 'Choose File'}
              </div>
              <label style={{ 
                backgroundColor: '#e5e7eb', 
                padding: '8px 16px', 
                cursor: 'pointer', 
                color: '#4b5563',
                fontSize: '14px',
                borderLeft: '1px solid #d1d5db'
              }}>
                Browse
                <input 
                  type="file" 
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          </div>
          
          <div>
            <button 
              type="button" 
              style={{ ...orangeBtnStyle, opacity: isUploading ? 0.7 : 1, cursor: isUploading ? 'not-allowed' : 'pointer', display: 'inline-block', width: 'auto' }} 
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload XLSX'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
