"use client";

import React from 'react';
import styles from './StoreLocator.module.css';

const stores = [
  {
    id: 1,
    name: "Jamuna Future Park",
    address: "GC-014 A, Zone-C, Ground Floor, Jamuna Future Park, Dhaka",
    hours: "10",
    contact: "01730068048",
    image: "/images/prod1.jpg?v=store1",
  },
  {
    id: 2,
    name: "Banasree",
    address: "House No: C-4, Block- C, 1st Floor, Banasree Main Road, Rampura, Dhaka",
    hours: "10",
    contact: "01730068032",
    image: "/images/prod2.jpg?v=store2",
  },
  {
    id: 3,
    name: "Wari",
    address: "A. K. Famous Tower, 2nd floor, 41, Rankin Street, Wari, Dhaka",
    hours: "10",
    contact: "01730068023",
    image: "/images/prod3.jpg?v=store3",
  },
  {
    id: 4,
    name: "Uttara",
    address: "Rajlaxmi Complex, 3rd Floor, Sector 3, Uttara, Dhaka",
    hours: "10",
    contact: "01730068024",
    image: "/images/prod4.jpg?v=store4",
  },
  {
    id: 5,
    name: "Mirpur",
    address: "Mirpur Shopping Center, Section 2, Mirpur, Dhaka",
    hours: "10",
    contact: "01730068025",
    image: "/images/prod1.jpg?v=store5",
  },
  {
    id: 6,
    name: "Dhanmondi",
    address: "Shimanto Square, 1st Floor, Dhanmondi 2, Dhaka",
    hours: "10",
    contact: "01730068026",
    image: "/images/prod2.jpg?v=store6",
  }
];

export default function StoreLocatorPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.main}>
        <h1 className={styles.pageTitle}>Our Stores</h1>
        
        <div className={styles.storeGrid}>
          {stores.map((store) => (
            <div key={store.id} className={styles.storeCard}>
              <img src={store.image} alt={store.name} className={styles.storeImage} />
              
              <div className={styles.storeInfo}>
                <h2 className={styles.storeName}>{store.name}</h2>
                <div className={styles.storeAddress}>{store.address}</div>
                
                <div className={styles.metaList}>
                  <div className={styles.metaItem}>
                    <div className={styles.metaIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <span>Business Hours: {store.hours}</span>
                  </div>
                  
                  <div className={styles.metaItem}>
                    <div className={styles.metaIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <span>Contact: {store.contact}</span>
                  </div>
                  
                  <div className={styles.metaItem}>
                    <div className={styles.metaIcon}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <span>Location</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
