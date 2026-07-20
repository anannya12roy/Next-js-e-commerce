"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from '@/app/profile/Profile.module.css';

const user = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
};

export default function ProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    console.log('Logging out...');
    router.push('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userCard}>
        <div className={styles.avatar}>
          {user.firstName[0]}{user.lastName[0]}
        </div>
        <div>
          <div className={styles.userName}>{user.firstName} {user.lastName}</div>
          <div className={styles.userEmail}>{user.email}</div>
        </div>
      </div>

      <nav className={styles.nav}>
        <Link 
          href="/profile" 
          className={`${styles.navLink} ${pathname === '/profile' ? styles.active : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          My Profile
        </Link>
        <Link 
          href="/profile/orders" 
          className={`${styles.navLink} ${pathname === '/profile/orders' ? styles.active : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          My Orders
        </Link>
        <Link 
          href="/profile/wishlist" 
          className={`${styles.navLink} ${pathname === '/profile/wishlist' ? styles.active : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          Wishlist
        </Link>
        <Link 
          href="/profile/password" 
          className={`${styles.navLink} ${pathname === '/profile/password' ? styles.active : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          Change Password
        </Link>
        <Link 
          href="/profile/subscribe" 
          className={`${styles.navLink} ${pathname === '/profile/subscribe' ? styles.active : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Subscribe
        </Link>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </nav>
    </aside>
  );
}
