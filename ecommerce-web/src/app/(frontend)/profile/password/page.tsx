"use client";

import React, { useState } from 'react';
import styles from '../Profile.module.css';

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Change Password</h1>
      </div>

      <form onSubmit={handlePasswordChange} style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
        <div className={styles.formGroup}>
          <label className={styles.infoLabel}>New Password</label>
          <input 
            type="password" 
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter new password"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.infoLabel}>Confirm New Password</label>
          <input 
            type="password" 
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm new password"
          />
        </div>
        <button type="submit" className={styles.saveBtn} style={{ alignSelf: 'flex-start', marginTop: '8px' }}>Update Password</button>
      </form>
    </>
  );
}
