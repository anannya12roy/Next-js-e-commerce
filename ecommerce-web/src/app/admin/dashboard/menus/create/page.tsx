"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { getMenu, createMenu, updateMenu } from '@/actions/menuActions';

function CreateMenuForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const editId = idParam ? parseInt(idParam) : null;

  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('Mega Menu');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(!!editId);

  useEffect(() => {
    if (editId) {
      const fetchMenu = async () => {
        try {
          const res = await getMenu(editId);
          if (res.success) {
            setName(res.data.name);
            setIdentifier(res.data.identifier);
          } else {
            toast.error(res.error || 'Menu not found');
            router.push('/admin/dashboard/menus');
          }
        } catch (error) {
          toast.error('Failed to load menu');
        } finally {
          setLoading(false);
        }
      };
      fetchMenu();
    }
  }, [editId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!identifier.trim()) {
      toast.error('Identifier is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { name, identifier };
      const res = editId 
        ? await updateMenu(editId, payload)
        : await createMenu(payload);

      if (res.success) {
        toast.success(editId ? 'Menu updated successfully' : 'Menu created successfully');
        router.push('/admin/dashboard/menus');
      } else {
        toast.error(res.error || 'Failed to save menu');
      }
    } catch (error) {
      toast.error('Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '24px' }}>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">{editId ? 'Edit Menu' : 'Create Menu'}</h1>
        <button 
          onClick={() => router.push('/admin/dashboard/menus')} 
          className="addBtn"
          style={{ backgroundColor: '#f9fafb', color: '#374151', border: '1px solid #d1d5db' }}
        >
          Back to List
        </button>
      </div>

      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label">Name</label>
            <input 
              type="text" 
              className="input" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mega Menu"
              required
            />
          </div>

          <div className="formGroup">
            <label className="label">Menu Identifier</label>
            <select 
              className="input" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            >
              <option value="Mega Menu">Mega Menu</option>
              <option value="Footer Menu">Footer Menu</option>
              <option value="Mobile Menu">Mobile Menu</option>
              <option value="Quick Links">Quick Links</option>
            </select>
          </div>

          <button type="submit" className="submitBtn" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (editId ? 'Update' : 'Create')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CreateMenuPage() {
  return (
    <Suspense fallback={<div style={{ padding: '24px' }}>Loading...</div>}>
      <CreateMenuForm />
    </Suspense>
  );
}
