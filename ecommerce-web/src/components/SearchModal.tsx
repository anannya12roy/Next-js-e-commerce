"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SearchModal.module.css';

// Dummy product suggestions
const dummySuggestions = [
  { id: 1, slug: "premium-wireless-headphones", name: "Premium Wireless Headphones", price: "৳2,500", image: "/images/prod1.jpg?v=sh1" },
  { id: 2, slug: "smart-fitness-watch", name: "Smart Fitness Watch", price: "৳3,200", image: "/images/prod2.jpg?v=sh2" },
  { id: 3, slug: "leather-messenger-bag", name: "Leather Messenger Bag", price: "৳4,800", image: "/images/prod3.jpg?v=sh3" },
  { id: 4, slug: "minimalist-desk-lamp", name: "Minimalist Desk Lamp", price: "৳1,500", image: "/images/prod4.jpg?v=sh4" },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(dummySuggestions);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults(dummySuggestions);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Simulate live search filtering
  useEffect(() => {
    if (query.trim() === '') {
      setResults(dummySuggestions);
    } else {
      const lowerQuery = query.toLowerCase();
      setResults(dummySuggestions.filter(p => p.name.toLowerCase().includes(lowerQuery)));
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/shop?q=${encodeURIComponent(query)}`);
    }
  };

  const handleProductClick = (slug: string) => {
    onClose();
    router.push(`/product/${slug}`);
  };

  if (!isOpen && typeof window !== 'undefined') {
    // Keep it in DOM for transitions, handled by CSS opacity
  }

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <form className={styles.searchHeader} onSubmit={handleSubmit}>
          <svg className={styles.searchIcon} width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search for products..." 
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close search">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </form>

        <div className={styles.resultsArea}>
          <h3 className={styles.suggestionsTitle}>
            {query.trim() ? `Search Results (${results.length})` : 'Suggested Products'}
          </h3>
          
          {results.length > 0 ? (
            <div className={styles.resultsGrid}>
              {results.map((product) => (
                <div key={product.id} className={styles.productCard} onClick={() => handleProductClick(product.slug)}>
                  <img src={product.image} alt={product.name} className={styles.productImage} />
                  <div className={styles.productInfo}>
                    <div className={styles.productTitle}>{product.name}</div>
                    <div className={styles.productPrice}>{product.price}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', fontSize: '15px' }}>No products found matching "{query}"</p>
          )}
        </div>
      </div>
    </div>
  );
}
