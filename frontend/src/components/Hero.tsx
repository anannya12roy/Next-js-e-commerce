import React from 'react';
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.badge}>New Collection 2026</span>
          <h1 className={styles.title}>Discover Your Next Favorite Thing</h1>
          <p className={styles.subtitle}>
            Shop the latest trends with exclusive deals. Premium quality products curated just for you.
          </p>
          <div className={styles.actions}>
            <Link href="/shop" className={styles.primaryBtn}>
              Shop Now
            </Link>
            <Link href="/categories" className={styles.secondaryBtn}>
              Explore Categories
            </Link>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <div className={styles.imagePlaceholder}>
            <img 
              src="/images/hero.jpg?v=2" 
              alt="Hero image" 
              className={styles.heroImage} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
