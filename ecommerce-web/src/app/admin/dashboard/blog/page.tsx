"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBlogs } from '@/actions/blogActions';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    const res = await getBlogs();
    if (res.success && res.data) {
      setBlogs(res.data as any);
    }
    setIsLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="cardHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>All Posts</span>
          <Link href="/admin/dashboard/blog/create">
            <button className="actionButton" style={{ backgroundColor: '#f97316' }}>
              Add New Post
            </button>
          </Link>
        </div>
        <div className="cardBody">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Title</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Is Featured</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600 }}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '16px', textAlign: 'center' }}>No posts found.</td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px' }}>{blog.title}</td>
                      <td style={{ padding: '12px 16px' }}>{blog.category_name || '-'}</td>
                      <td style={{ padding: '12px 16px' }}>{blog.is_featured ? 'Yes' : 'No'}</td>
                      <td style={{ padding: '12px 16px' }}>{new Date(blog.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
