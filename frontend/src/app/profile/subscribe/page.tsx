"use client";

import React, { useState } from 'react';
import styles from '../Profile.module.css';

export default function SubscribePage() {
  const [email, setEmail] = useState('anannya@gmail.com');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Subscribed successfully with ${email}!`);
  };

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Subscribe</h1>
      </div>

      <div style={{ position: 'relative', marginTop: '20px' }}>
        <div style={{ 
          position: 'absolute', 
          top: '-15px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          backgroundColor: '#e5e7eb',
          padding: '4px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#4b5563',
          zIndex: 1
        }}>
          SUBSCRIBE
        </div>
        
        <div style={{ 
          border: '1px solid #f3f4f6', 
          padding: '40px 32px', 
          borderRadius: '8px',
          position: 'relative' 
        }}>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>Name</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '15px',
                  outline: 'none',
                  width: '100%'
                }}
              />
            </div>
            
            <button type="submit" style={{
              padding: '12px 32px',
              backgroundColor: '#4b5563',
              color: 'white',
              border: 'none',
              borderRadius: '24px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              alignSelf: 'flex-start',
              letterSpacing: '0.5px'
            }}>
              SUBSCRIBE NOW
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
