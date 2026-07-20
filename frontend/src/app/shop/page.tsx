"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Shop.module.css';
import productStyles from '@/components/Product.module.css';

// Using the same product list for the shop, plus some more for scrolling
const shopProducts = [
  { id: 1, name: 'Minimalist Chair', price: 120.00, originalPrice: 150.00, image: '/images/prod1.jpg?v=2', hoverImage: '/images/h1.jpg?v=2', badge: 'Sale', category: 'Furniture' },
  { id: 2, name: 'Ceramic Table Lamp', price: 85.00, originalPrice: null, image: '/images/prod2.jpg?v=2', hoverImage: '/images/h2.jpg?v=2', badge: 'New', category: 'Lighting' },
  { id: 3, name: 'Linen Throw Pillow', price: 35.00, originalPrice: null, image: '/images/prod3.jpg?v=2', hoverImage: '/images/h3.jpg?v=2', badge: null, category: 'Decor' },
  { id: 4, name: 'Wooden Coffee Table', price: 340.00, originalPrice: 400.00, image: '/images/prod4.jpg?v=2', hoverImage: '/images/h4.jpg?v=2', badge: 'Sale', category: 'Furniture' },
  { id: 5, name: 'Textured Wool Rug', price: 210.00, originalPrice: null, image: '/images/prod5.jpg?v=2', hoverImage: '/images/h1.jpg?v=2', badge: null, category: 'Decor' },
  { id: 6, name: 'Abstract Wall Art', price: 95.00, originalPrice: null, image: '/images/prod6.jpg?v=2', hoverImage: '/images/h2.jpg?v=2', badge: null, category: 'Art' },
  { id: 7, name: 'Glass Vase', price: 25.00, originalPrice: 35.00, image: '/images/prod7.jpg?v=2', hoverImage: '/images/prod7.jpg?v=2', badge: 'Sale', category: 'Decor' },
  { id: 8, name: 'Velvet Sofa', price: 899.00, originalPrice: null, image: '/images/prod8.jpg?v=2', hoverImage: '/images/h3.jpg?v=2', badge: 'Popular', category: 'Furniture' },
  { id: 9, name: 'Modern Table Lamp', price: 65.00, originalPrice: null, image: '/images/new1.jpg?v=2', hoverImage: '/images/h4.jpg?v=2', badge: 'New', category: 'Lighting' },
  { id: 10, name: 'Cotton Weave Rug', price: 145.00, originalPrice: 180.00, image: '/images/new2.jpg?v=2', hoverImage: '/images/h1.jpg?v=2', badge: 'Sale', category: 'Decor' },
  { id: 11, name: 'Leather Lounge Chair', price: 420.00, originalPrice: null, image: '/images/new3.jpg?v=2', hoverImage: '/images/h2.jpg?v=2', badge: null, category: 'Furniture' },
  { id: 12, name: 'Minimalist Clock', price: 45.00, originalPrice: null, image: '/images/new4.jpg?v=2', hoverImage: '/images/h3.jpg?v=2', badge: null, category: 'Decor' }
];

export default function ShopPage() {
  const [gridCols, setGridCols] = useState<3 | 4 | 5>(3);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shop All</h1>
        <p className={styles.subtitle}>Find exactly what you're looking for with our advanced filters.</p>
      </div>

      <div className={styles.main}>
        {/* Sidebar Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Categories</h3>
            <div className={styles.filterList}>
              {['All Categories', 'Furniture', 'Lighting', 'Decor', 'Art'].map((cat, i) => (
                <label key={cat} className={styles.filterItem}>
                  <input type="checkbox" className={styles.checkbox} defaultChecked={i === 0} />
                  <span className={styles.filterLabel}>{cat}</span>
                  <span className={styles.filterCount}>{Math.floor(Math.random() * 50) + 10}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Price Range</h3>
            <div className={styles.priceInputGroup}>
              <input type="number" placeholder="Min" className={styles.priceInput} />
              <span className={styles.priceSeparator}>-</span>
              <input type="number" placeholder="Max" className={styles.priceInput} />
            </div>
            <button className={styles.applyBtn}>Apply Filter</button>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Color</h3>
            <div className={styles.colorList}>
              {[
                { name: 'Black', color: '#111827' },
                { name: 'White', color: '#ffffff' },
                { name: 'Gray', color: '#9ca3af' },
                { name: 'Beige', color: '#f5f5dc' },
                { name: 'Navy', color: '#1e3a8a' },
                { name: 'Brown', color: '#78350f' }
              ].map((c, i) => (
                <input 
                  key={c.name}
                  type="radio" 
                  name="colorFilter"
                  className={styles.colorSwatch} 
                  style={{ backgroundColor: c.color }}
                  title={c.name}
                  defaultChecked={i === 0}
                />
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Size</h3>
            <div className={styles.sizeList}>
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size, i) => (
                <label key={size} className={styles.sizeBox}>
                  <input type="checkbox" defaultChecked={i === 2} />
                  {size}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Availability</h3>
            <div className={styles.filterList}>
              <label className={styles.filterItem}>
                <input type="checkbox" className={styles.checkbox} defaultChecked />
                <span className={styles.filterLabel}>In Stock</span>
              </label>
              <label className={styles.filterItem}>
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.filterLabel}>Pre-order</span>
              </label>
              <label className={styles.filterItem}>
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.filterLabel}>Out of Stock</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid Content */}
        <div className={styles.content}>
          <div className={styles.toolbar}>
            <div className={styles.resultCount}>
              Showing <strong>1-12</strong> of <strong>{shopProducts.length}</strong> results
            </div>

            <div className={styles.gridToggle}>
              <button 
                className={`${styles.gridBtn} ${gridCols === 3 ? styles.active : ''}`}
                onClick={() => setGridCols(3)}
                aria-label="View 3 items per row"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 4h4v16H4zM10 4h4v16h-4zM16 4h4v16h-4z" />
                </svg>
              </button>
              <button 
                className={`${styles.gridBtn} ${gridCols === 4 ? styles.active : ''}`}
                onClick={() => setGridCols(4)}
                aria-label="View 4 items per row"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 4h3.5v16H2zM7.5 4h3.5v16H7.5zM13 4h3.5v16H13zM18.5 4h3.5v16H18.5z" />
                </svg>
              </button>
              <button 
                className={`${styles.gridBtn} ${gridCols === 5 ? styles.active : ''}`}
                onClick={() => setGridCols(5)}
                aria-label="View 5 items per row"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 4h3v16H1zM5.5 4h3v16h-3zM10.5 4h3v16h-3zM15.5 4h3v16h-3zM20 4h3v16h-3z" />
                </svg>
              </button>
            </div>

            <div className={styles.sortGroup}>
              <span className={styles.sortLabel}>Sort by:</span>
              <select className={styles.sortSelect} defaultValue="featured">
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          <div className={`${styles.grid} ${styles[`grid${gridCols}`]}`}>
            {shopProducts.map((product) => {
              let discountPercent = 0;
              if (product.originalPrice && product.originalPrice > product.price) {
                discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
              }

              return (
                <div key={product.id} className={productStyles.card}>
                  <div className={productStyles.imageWrapper}>
                    {discountPercent > 0 ? (
                      <span className={`${productStyles.badge} ${productStyles.discountBadge}`}>
                        -{discountPercent}%
                      </span>
                    ) : product.badge ? (
                      <span className={productStyles.badge}>{product.badge}</span>
                    ) : null}
                    
                    {/* Primary Image */}
                    <div className={productStyles.imagePlaceholder}>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className={productStyles.productImage}
                      />
                    </div>
                    
                    {/* Secondary (Hover) Image */}
                    <div className={`${productStyles.imagePlaceholder} ${productStyles.hoverImage}`}>
                      <img 
                        src={product.hoverImage} 
                        alt={`${product.name} hover`} 
                        className={productStyles.productImage}
                      />
                    </div>
                    
                    <div className={productStyles.actionOverlay}>
                      <button className={productStyles.addToCartBtn}>Add to Cart</button>
                    </div>
                  </div>
                  
                  <div className={productStyles.content}>
                    <Link href={`/product/${product.id}`} className={productStyles.name}>
                      {product.name}
                    </Link>
                    <div className={productStyles.priceContainer}>
                      {product.originalPrice ? (
                        <>
                          <span className={productStyles.priceDiscounted}>${product.price.toFixed(2)}</span>
                          <span className={productStyles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className={productStyles.price}>${product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
