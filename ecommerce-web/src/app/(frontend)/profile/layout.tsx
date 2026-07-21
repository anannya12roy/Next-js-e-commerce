import React from 'react';
import ProfileSidebar from '@/components/ProfileSidebar';
import styles from './Profile.module.css';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.main}>
        <ProfileSidebar />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
