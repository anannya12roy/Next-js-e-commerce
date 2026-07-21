'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>NEXORA</Link>
            <p className={styles.description}>
              We are a premium e-commerce brand offering the best products with exceptional quality. Shop with us and experience the difference.
            </p>
            <div className={styles.socials}>
              {/* Dummy Social Icons */}
              <a href="#" className={styles.socialIcon} aria-label="Facebook">Fb</a>
              <a href="#" className={styles.socialIcon} aria-label="Twitter">Tw</a>
              <a href="#" className={styles.socialIcon} aria-label="Instagram">Ig</a>
            </div>
          </div>
          
          <div className={styles.linkCol}>
            <h4 className={styles.title}>Shop</h4>
            <ul className={styles.list}>
              <li><Link href="/shop">All Products</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              <li><Link href="/new">New Arrivals</Link></li>
              <li><Link href="/sale">On Sale</Link></li>
            </ul>
          </div>

          <div className={styles.linkCol}>
            <h4 className={styles.title}>Support</h4>
            <ul className={styles.list}>
              <li><Link href="/pages/faq">FAQ</Link></li>
              <li><Link href="/pages/shipping">Shipping & Returns</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/pages/terms">Terms of Service</Link></li>
            </ul>
          </div>

          <div className={styles.subscribeCol}>
            <h4 className={styles.title}>Stay in the Loop</h4>
            <p className={styles.subtitle}>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className={styles.input} />
              <button type="submit" className={styles.btn}>Subscribe</button>
            </form>
          </div>

        </div>
        
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Nexora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
