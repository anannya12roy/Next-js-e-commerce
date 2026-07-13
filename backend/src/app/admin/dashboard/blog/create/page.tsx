"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { createBlog, getBlogCategories } from '@/actions/blogActions';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function CreateBlogPage() {
  const router = useRouter();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'Blog',
    title: '',
    category_id: '',
    slug: '',
    banner: '',
    short_description: '',
    description: '',
    is_featured: 'no',
    meta_title: '',
    meta_image: '',
    meta_description: '',
    meta_keywords: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await getBlogCategories();
    if (res.success && res.data) {
      setCategories(res.data);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (content: string) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug) {
      toast.error('Title and Slug are required');
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await createBlog(formData);
      if (res.success) {
        toast.success(res.message || 'Blog created successfully');
        // router.push('/admin/dashboard/blog'); // Redirect if list page exists
        setFormData({
          type: 'Blog',
          title: '',
          category_id: '',
          slug: '',
          banner: '',
          short_description: '',
          description: '',
          is_featured: 'no',
          meta_title: '',
          meta_image: '',
          meta_description: '',
          meta_keywords: ''
        });
      } else {
        toast.error(res.error || 'Failed to create blog');
      }
    } catch (e) {
      toast.error('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const formRowStyle = {
    display: 'flex',
    marginBottom: '16px',
    alignItems: 'flex-start'
  };

  const labelStyle = {
    flex: '0 0 25%',
    fontSize: '14px',
    color: '#333',
    paddingTop: '8px',
    fontWeight: 500
  };

  const inputContainerStyle = {
    flex: 1
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#fff',
    color: '#333'
  };
  
  const fileInputStyle = {
    display: 'flex', 
    border: '1px solid #e5e7eb', 
    borderRadius: '4px', 
    overflow: 'hidden',
    width: '100%'
  };

  return (
    <div className="container">
      <div className="card">
        <div className="cardHeader">
          Blog Information
        </div>
        <div className="cardBody">
          
          <div style={formRowStyle}>
            <div style={labelStyle}>Type</div>
            <div style={inputContainerStyle}>
              <select className="input" name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                <option value="Blog">Blog</option>
              </select>
            </div>
          </div>

          <div style={formRowStyle}>
            <div style={labelStyle}>Title <span style={{color: 'red'}}>*</span></div>
            <div style={inputContainerStyle}>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" style={inputStyle} />
            </div>
          </div>

          <div style={formRowStyle}>
            <div style={labelStyle}>Category</div>
            <div style={inputContainerStyle}>
              <select className="input" name="category_id" value={formData.category_id} onChange={handleChange} style={inputStyle}>
                <option value="">--</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={formRowStyle}>
            <div style={labelStyle}>Slug <span style={{color: 'red'}}>*</span></div>
            <div style={inputContainerStyle}>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="Slug" style={inputStyle} />
            </div>
          </div>

          <div style={formRowStyle}>
            <div style={labelStyle}>Banner <small>(1200x630)</small></div>
            <div style={inputContainerStyle}>
              <div style={fileInputStyle}>
                <label style={{ 
                  backgroundColor: '#f3f4f6', 
                  padding: '8px 16px', 
                  cursor: 'pointer', 
                  color: '#4b5563',
                  fontSize: '14px',
                  borderRight: '1px solid #d1d5db'
                }}>
                  Browse
                  <input type="file" style={{ display: 'none' }} />
                </label>
                <div style={{ flex: 1, padding: '8px 12px', color: '#9ca3af', backgroundColor: '#fff', fontSize: '14px' }}>
                  Choose File
                </div>
              </div>
            </div>
          </div>

          <div style={formRowStyle}>
            <div style={labelStyle}>Short Description</div>
            <div style={inputContainerStyle}>
              <textarea name="short_description" value={formData.short_description} onChange={handleChange} rows={4} style={{...inputStyle, resize: 'vertical'}} />
            </div>
          </div>

          <div style={formRowStyle}>
            <div style={labelStyle}>Description <span style={{color: 'red'}}>*</span></div>
            <div style={inputContainerStyle}>
              <ReactQuill theme="snow" value={formData.description} onChange={handleDescriptionChange} style={{ height: '200px', marginBottom: '50px' }} />
            </div>
          </div>

          <div style={formRowStyle}>
            <div style={labelStyle}>Is Featured</div>
            <div style={inputContainerStyle}>
              <select className="input" name="is_featured" value={formData.is_featured} onChange={handleChange} style={inputStyle}>
                <option value="no">no</option>
                <option value="yes">yes</option>
              </select>
            </div>
          </div>

          <div style={formRowStyle}>
            <div style={labelStyle}>Meta Title</div>
            <div style={inputContainerStyle}>
              <input type="text" name="meta_title" value={formData.meta_title} onChange={handleChange} placeholder="Meta Title" style={inputStyle} />
            </div>
          </div>

          <div style={formRowStyle}>
            <div style={labelStyle}>Meta Image <small>(200x200)+</small></div>
            <div style={inputContainerStyle}>
              <div style={fileInputStyle}>
                <label style={{ 
                  backgroundColor: '#f3f4f6', 
                  padding: '8px 16px', 
                  cursor: 'pointer', 
                  color: '#4b5563',
                  fontSize: '14px',
                  borderRight: '1px solid #d1d5db'
                }}>
                  Browse
                  <input type="file" style={{ display: 'none' }} />
                </label>
                <div style={{ flex: 1, padding: '8px 12px', color: '#9ca3af', backgroundColor: '#fff', fontSize: '14px' }}>
                  Choose File
                </div>
              </div>
            </div>
          </div>

          <div style={formRowStyle}>
            <div style={labelStyle}>Meta Description</div>
            <div style={inputContainerStyle}>
              <textarea name="meta_description" value={formData.meta_description} onChange={handleChange} rows={4} style={{...inputStyle, resize: 'vertical'}} />
            </div>
          </div>

          <div style={formRowStyle}>
            <div style={labelStyle}>Meta Keywords</div>
            <div style={inputContainerStyle}>
              <input type="text" name="meta_keywords" value={formData.meta_keywords} onChange={handleChange} placeholder="Meta Keywords" style={inputStyle} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button 
              type="button" 
              className="actionButton"
              style={{ backgroundColor: '#f97316' }} // Orange color from screenshot
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
