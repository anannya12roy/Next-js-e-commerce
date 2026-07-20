"use client";

import React, { useState } from 'react';
import styles from './Profile.module.css';

// Dummy user data
const user = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+880 1712-345678',
  address: 'House #42, Road #7, Block C, Banani\nDhaka 1213, Bangladesh',
};

export default function ProfilePage() {
  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Personal Information</h1>
        <button className={styles.editBtn}>Edit Profile</button>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>First Name</span>
          <span className={styles.infoValue}>{user.firstName}</span>
        </div>

        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>Last Name</span>
          <span className={styles.infoValue}>{user.lastName}</span>
        </div>

        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>Email Address</span>
          <span className={styles.infoValue}>{user.email}</span>
        </div>

        <div className={styles.infoGroup}>
          <span className={styles.infoLabel}>Phone Number</span>
          <span className={styles.infoValue}>{user.phone}</span>
        </div>

        <div className={`${styles.infoGroup} ${styles.fullWidth}`}>
          <span className={styles.infoLabel}>Shipping Address</span>
          <span className={styles.infoValue} style={{ whiteSpace: 'pre-line' }}>
            {user.address}
          </span>
        </div>
      </div>
    </>
  );
}
