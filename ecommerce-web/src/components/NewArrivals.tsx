'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './NewArrivals.module.css';

const newItems = [
  { id: 9, name: 'Modern Table Lamp', price: 65.00, image: '/images/new1.jpg?v=2' },
  { id: 10, name: 'Cotton Weave Rug', price: 145.00, image: '/images/new2.jpg?v=2' },
  { id: 11, name: 'Leather Lounge Chair', price: 420.00, image: '/images/new3.jpg?v=2' },
  { id: 12, name: 'Minimalist Clock', price: 45.00, image: '/images/new4.jpg?v=2' },
  { id: 13, name: 'Ceramic Vase Set', price: 55.00, image: '/images/new5.jpg?v=2' },
];

export default function NewArrivals() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 274; // approximate width of card + gap (250 + 24)
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      
      if (direction === 'left') {
        if (scrollLeft <= 0) {
          // Wrap to end
          sliderRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      } else {
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          // Wrap to start
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      scroll('right');
    }, 4000); // Auto-slide every 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>New Arrivals</h2>
          <div className={styles.headerRight}>
            <div className={styles.navArrows}>
              <button className={styles.arrowBtn} onClick={() => scroll('left')} aria-label="Previous">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <button className={styles.arrowBtn} onClick={() => scroll('right')} aria-label="Next">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
            <Link href="/new" className={styles.viewAllTop}>
              View All <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        <div className={styles.bannerGrid}>
          
          <div className={styles.featureBox}>
            <div className={styles.content}>
              <h3 className={styles.featureTitle}>Spring Collection</h3>
              <p className={styles.subtitle}>Refresh your space with our latest curated items.</p>
              <Link href="/new" className={styles.btn}>
                Shop Collection
              </Link>
            </div>
          </div>
          
          <div className={styles.sliderContainer}>
            <div className={styles.slider} ref={sliderRef}>
              {newItems.map((item) => (
                <div key={item.id} className={styles.card}>
                  <div className={styles.imagePlaceholder}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.cardContent}>
                    <Link href={`/product/${item.id}`} className={styles.name}>
                      {item.name}
                    </Link>
                    <span className={styles.price}>${item.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
