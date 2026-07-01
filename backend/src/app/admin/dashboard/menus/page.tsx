"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getMenus, deleteMenu } from '@/actions/menuActions';

export default function MenusPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenus = async () => {
    try {
      const res = await getMenus();
      if (res.success) {
        setMenus(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch menus:', error);
      toast.error('Failed to load menus');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this menu?')) {
      try {
        const res = await deleteMenu(id);
        if (res.success) {
          toast.success('Deleted successfully');
          fetchMenus();
        } else {
          toast.error(res.error || 'Failed to delete menu');
        }
      } catch (error) {
        toast.error('Network error');
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Menus</h1>
        <Link href="/admin/dashboard/menus/create" className="addBtn">
          Create New Menu
        </Link>
      </div>

      <div className="tableContainer">
        {loading ? (
          <p style={{ padding: '24px' }}>Loading menus...</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th style={{ width: '250px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((menu) => (
                <tr key={menu.id}>
                  <td>{menu.name}</td>
                  <td>
                    <div className="actions">
                      <Link href={`/admin/dashboard/menus/${menu.id}/items`} className="manageBtn">
                        Manage Items
                      </Link>
                      <Link href={`/admin/dashboard/menus/create?id=${menu.id}`} className="editBtn">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(menu.id)} className="deleteBtn">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {menus.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ textAlign: 'center', padding: '24px' }}>
                    No menus found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
