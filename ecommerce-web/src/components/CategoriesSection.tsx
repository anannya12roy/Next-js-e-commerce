import React from 'react';
import Link from 'next/link';
import styles from './Categories.module.css';

const categories = [
  { id: 1, name: 'Fashion & Apparel', image: '/images/cat1.jpg?v=2', items: '120+ Items' },
  { id: 2, name: 'Electronics', image: '/images/cat2.jpg?v=2', items: '85 Items' },
  { id: 3, name: 'Home & Living', image: '/images/cat3.jpg?v=2', items: '64 Items' },
  { id: 4, name: 'Beauty & Health', image: '/images/cat4.jpg?v=2', items: '92 Items' },
];

export default function CategoriesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Shop by Category</h2>
          <Link href="/categories" className={styles.viewAll}>
            View All Categories <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        
        <div className={styles.grid}>
          {categories.map((category) => (
            <Link href={`/category/${category.id}`} key={category.id} className={styles.card}>
              <div className={styles.imagePlaceholder}>
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className={styles.categoryImage}
                />
              </div>
              <div className={styles.content}>
                <h3 className={styles.name}>{category.name}</h3>
                <p className={styles.items}>{category.items}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
