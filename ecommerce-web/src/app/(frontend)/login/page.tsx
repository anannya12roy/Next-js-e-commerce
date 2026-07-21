"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/components/Auth.module.css';
import { loginUser } from '@/actions/authActions';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await loginUser(email, password);
    setLoading(false);
    
    if (res.success) {
      if (res.user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } else {
      setError(res.error || 'Invalid email or password');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Enter your details to access your account.</p>
        </div>

        {error && (
          <div style={{ color: '#ef4444', marginBottom: '15px', textAlign: 'center', fontSize: '14px', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '6px' }}>
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              className={styles.input} 
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">
              Password
              <Link href="/forgot-password" className={styles.forgotPassword}>
                Forgot Password?
              </Link>
            </label>
            <input 
              type="password" 
              id="password" 
              className={styles.input} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          Don't have an account? 
          <Link href="/register" className={styles.footerLink}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
