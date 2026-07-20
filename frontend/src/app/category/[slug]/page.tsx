"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import shopStyles from '@/app/shop/Shop.module.css';
import productStyles from '@/components/Product.module.css';
import categoryStyles from './Category.module.css';

// Using the same product list for demonstration, in a real app this would be filtered by category ID
const categoryProducts = [
  { id: 1, name: 'Minimalist Chair', price: 120.00, originalPrice: 150.00, image: '/images/prod1.jpg?v=2', hoverImage: '/images/h1.jpg?v=2', badge: 'Sale', category: 'Furniture' },
  { id: 4, name: 'Wooden Coffee Table', price: 340.00, originalPrice: 400.00, image: '/images/prod4.jpg?v=2', hoverImage: '/images/h4.jpg?v=2', badge: 'Sale', category: 'Furniture' },
  { id: 8, name: 'Velvet Sofa', price: 899.00, originalPrice: null, image: '/images/prod8.jpg?v=2', hoverImage: '/images/h3.jpg?v=2', badge: 'Popular', category: 'Furniture' },
  { id: 11, name: 'Leather Lounge Chair', price: 420.00, originalPrice: null, image: '/images/new3.jpg?v=2', hoverImage: '/images/h2.jpg?v=2', badge: null, category: 'Furniture' },
];

export default function CategoryPage() {
  const params = useParams();
  const [gridCols, setGridCols] = useState<3 | 4 | 5>(3);

  // Format slug to readable name (e.g., "living-room" -> "Living Room")
  const slugStr = typeof params.slug === 'string' ? params.slug : 'Category';
  const categoryName = slugStr
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className={shopStyles.pageContainer}>
      {/* Category Banner */}
      <div className={categoryStyles.banner}>
        <img 
          src="/images/hero.jpg?v=2" 
          alt={categoryName} 
          className={categoryStyles.bannerImage}
        />
        <div className={categoryStyles.bannerContent}>
          <h1 className={categoryStyles.bannerTitle}>{categoryName}</h1>
          <p className={categoryStyles.bannerSubtitle}>
            Explore our beautifully curated {categoryName.toLowerCase()} selection. Designed for modern living.
          </p>
        </div>
      </div>

      <div className={shopStyles.main}>
        {/* Sidebar Filters */}
        <aside className={shopStyles.sidebar}>
          <div className={shopStyles.filterSection}>
            <h3 className={shopStyles.filterTitle}>Price Range</h3>
            <div className={shopStyles.priceInputGroup}>
              <input type="number" placeholder="Min" className={shopStyles.priceInput} />
              <span className={shopStyles.priceSeparator}>-</span>
              <input type="number" placeholder="Max" className={shopStyles.priceInput} />
            </div>
            <button className={shopStyles.applyBtn}>Apply Filter</button>
          </div>

          <div className={shopStyles.filterSection}>
            <h3 className={shopStyles.filterTitle}>Color</h3>
            <div className={shopStyles.colorList}>
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
                  className={shopStyles.colorSwatch} 
                  style={{ backgroundColor: c.color }}
                  title={c.name}
                  defaultChecked={i === 0}
                />
              ))}
            </div>
          </div>

          <div className={shopStyles.filterSection}>
            <h3 className={shopStyles.filterTitle}>Size</h3>
            <div className={shopStyles.sizeList}>
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size, i) => (
                <label key={size} className={shopStyles.sizeBox}>
                  <input type="checkbox" defaultChecked={i === 2} />
                  {size}
                </label>
              ))}
            </div>
          </div>

          <div className={shopStyles.filterSection}>
            <h3 className={shopStyles.filterTitle}>Availability</h3>
            <div className={shopStyles.filterList}>
              <label className={shopStyles.filterItem}>
                <input type="checkbox" className={shopStyles.checkbox} defaultChecked />
                <span className={shopStyles.filterLabel}>In Stock</span>
              </label>
              <label className={shopStyles.filterItem}>
                <input type="checkbox" className={shopStyles.checkbox} />
                <span className={shopStyles.filterLabel}>Pre-order</span>
              </label>
              <label className={shopStyles.filterItem}>
                <input type="checkbox" className={shopStyles.checkbox} />
                <span className={shopStyles.filterLabel}>Out of Stock</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid Content */}
        <div className={shopStyles.content}>
          <div className={shopStyles.toolbar}>
            <div className={shopStyles.resultCount}>
              Showing <strong>1-{categoryProducts.length}</strong> of <strong>{categoryProducts.length}</strong> results
            </div>

            <div className={shopStyles.gridToggle}>
              <button 
                className={`${shopStyles.gridBtn} ${gridCols === 3 ? shopStyles.active : ''}`}
                onClick={() => setGridCols(3)}
                aria-label="View 3 items per row"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 4h4v16H4zM10 4h4v16h-4zM16 4h4v16h-4z" />
                </svg>
              </button>
              <button 
                className={`${shopStyles.gridBtn} ${gridCols === 4 ? shopStyles.active : ''}`}
                onClick={() => setGridCols(4)}
                aria-label="View 4 items per row"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 4h3.5v16H2zM7.5 4h3.5v16H7.5zM13 4h3.5v16H13zM18.5 4h3.5v16H18.5z" />
                </svg>
              </button>
              <button 
                className={`${shopStyles.gridBtn} ${gridCols === 5 ? shopStyles.active : ''}`}
                onClick={() => setGridCols(5)}
                aria-label="View 5 items per row"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 4h3v16H1zM5.5 4h3v16h-3zM10.5 4h3v16h-3zM15.5 4h3v16h-3zM20 4h3v16h-3z" />
                </svg>
              </button>
            </div>

            <div className={shopStyles.sortGroup}>
              <span className={shopStyles.sortLabel}>Sort by:</span>
              <select className={shopStyles.sortSelect} defaultValue="featured">
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          <div className={`${shopStyles.grid} ${shopStyles[`grid${gridCols}`]}`}>
            {categoryProducts.map((product) => {
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
                    <Link 
                      href={`/product/${product.name.toLowerCase().replace(/ /g, '-')}`} 
                      className={productStyles.name}
                    >
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
