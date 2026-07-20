"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './ProductDetails.module.css';

export default function ProductDetailsPage() {
  const params = useParams();
  
  // Format slug to readable name (e.g., "minimalist-chair" -> "Minimalist Chair")
  const slugStr = typeof params.slug === 'string' ? params.slug : 'Product';
  const productName = slugStr
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const [activeImage, setActiveImage] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [activeSize, setActiveSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');

  const images = [
    '/images/prod1.jpg?v=2',
    '/images/h1.jpg?v=2',
    '/images/prod2.jpg?v=2',
    '/images/h2.jpg?v=2'
  ];

  const colors = [
    { name: 'Black', hex: '#111827' },
    { name: 'Oatmeal', hex: '#d7cec7' },
    { name: 'Navy', hex: '#1e3a8a' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const toggleAccordion = (section: string) => {
    if (openAccordion === section) {
      setOpenAccordion(null);
    } else {
      setOpenAccordion(section);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link>
        <span className={styles.separator}>/</span>
        <Link href="/shop">Shop</Link>
        <span className={styles.separator}>/</span>
        <span style={{ color: '#111827', fontWeight: 500 }}>{productName}</span>
      </div>

      <div className={styles.main}>
        {/* Left: Image Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImageContainer}>
            <img src={images[activeImage]} alt={productName} className={styles.mainImage} />
          </div>
          <div className={styles.thumbnailList}>
            {images.map((img, index) => (
              <div 
                key={index} 
                className={`${styles.thumbnail} ${activeImage === index ? styles.active : ''}`}
                onClick={() => setActiveImage(index)}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className={styles.info}>
          <h1 className={styles.title}>{productName}</h1>
          
          <div className={styles.priceContainer}>
            <span className={styles.price}>$120.00</span>
            <span className={styles.originalPrice}>$150.00</span>
            <span className={styles.discountBadge}>Save 20%</span>
          </div>

          <p className={styles.description}>
            Experience ultimate comfort and modern design with the {productName}. 
            Crafted from premium materials, this piece seamlessly blends into any contemporary living space 
            while offering exceptional durability and style.
          </p>

          <div className={styles.selectorSection}>
            <h3 className={styles.selectorTitle}>
              Color: {colors[activeColor].name}
            </h3>
            <div className={styles.colorOptions}>
              {colors.map((color, index) => (
                <button
                  key={color.name}
                  className={`${styles.colorBtn} ${activeColor === index ? styles.active : ''}`}
                  onClick={() => setActiveColor(index)}
                  title={color.name}
                >
                  <div className={styles.colorInner} style={{ backgroundColor: color.hex }} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.selectorSection}>
            <h3 className={styles.selectorTitle}>
              Size: {activeSize}
              <span className={styles.sizeGuide}>Size Guide</span>
            </h3>
            <div className={styles.sizeOptions}>
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${activeSize === size ? styles.active : ''}`}
                  onClick={() => setActiveSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actionRow}>
            <div className={styles.quantityControl}>
              <button 
                className={styles.qtyBtn} 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className={styles.qtyValue}>{quantity}</span>
              <button 
                className={styles.qtyBtn} 
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            
            <button className={styles.addBtn}>
              Add to Cart - ${(120.00 * quantity).toFixed(2)}
            </button>
            
            <button className={styles.wishlistBtn} aria-label="Add to Wishlist">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <div className={styles.accordion}>
            <div className={styles.accordionItem}>
              <button 
                className={styles.accordionHeader}
                onClick={() => toggleAccordion('details')}
              >
                Product Details
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ transform: openAccordion === 'details' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {openAccordion === 'details' && (
                <div className={styles.accordionContent}>
                  Designed for longevity, this piece uses sustainably sourced materials. 
                  The clean lines and ergonomic structure provide optimal support. 
                  <br/><br/>
                  • Premium construction<br/>
                  • Minimalist aesthetic<br/>
                  • Sustainably sourced<br/>
                  • Made in Italy
                </div>
              )}
            </div>

            <div className={styles.accordionItem}>
              <button 
                className={styles.accordionHeader}
                onClick={() => toggleAccordion('shipping')}
              >
                Shipping & Returns
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style={{ transform: openAccordion === 'shipping' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {openAccordion === 'shipping' && (
                <div className={styles.accordionContent}>
                  Free standard shipping on all orders over $100. 
                  Returns are accepted within 30 days of purchase for a full refund. 
                  Items must be in original condition with tags attached.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
