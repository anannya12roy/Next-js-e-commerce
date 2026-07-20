import React from 'react';
import Link from 'next/link';
import styles from './PromoBanner.module.css';

export default function PromoBanner() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.banner}>
          <div className={styles.content}>
            <span className={styles.badge}>Limited Time Offer</span>
            <h2 className={styles.title}>Summer Clearance Sale</h2>
            <p className={styles.subtitle}>Get up to 50% off on selected items. Don't miss out on the biggest sale of the year.</p>
            <Link href="/sale" className={styles.btn}>
              Shop the Sale
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
