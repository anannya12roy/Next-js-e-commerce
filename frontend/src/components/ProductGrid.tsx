import React from 'react';
import Link from 'next/link';
import styles from './Product.module.css';

const products = [
  { 
    id: 1, 
    name: 'Minimalist Chair', 
    price: 120.00, 
    originalPrice: 150.00, 
    image: '/images/prod1.jpg?v=2', 
    hoverImage: '/images/h1.jpg?v=2', 
    badge: 'Sale' 
  },
  { 
    id: 2, 
    name: 'Ceramic Table Lamp', 
    price: 85.00, 
    originalPrice: null, 
    image: '/images/prod2.jpg?v=2', 
    hoverImage: '/images/h2.jpg?v=2', 
    badge: 'New' 
  },
  { 
    id: 3, 
    name: 'Linen Throw Pillow', 
    price: 35.00, 
    originalPrice: null, 
    image: '/images/prod3.jpg?v=2', 
    hoverImage: '/images/h3.jpg?v=2', 
    badge: null 
  },
  { 
    id: 4, 
    name: 'Wooden Coffee Table', 
    price: 340.00, 
    originalPrice: 400.00, 
    image: '/images/prod4.jpg?v=2', 
    hoverImage: '/images/h4.jpg?v=2', 
    badge: 'Sale' 
  },
  { 
    id: 5, 
    name: 'Textured Wool Rug', 
    price: 210.00, 
    originalPrice: null, 
    image: '/images/prod5.jpg?v=2', 
    hoverImage: '/images/h1.jpg?v=2', 
    badge: null 
  },
  { 
    id: 6, 
    name: 'Abstract Wall Art', 
    price: 95.00, 
    originalPrice: null, 
    image: '/images/prod6.jpg?v=2', 
    hoverImage: '/images/h2.jpg?v=2', 
    badge: null 
  },
  { 
    id: 7, 
    name: 'Glass Vase', 
    price: 25.00, 
    originalPrice: 35.00, 
    image: '/images/prod7.jpg?v=2', 
    hoverImage: '/images/prod7.jpg?v=2', // Reusing same for vase hover
    badge: 'Sale' 
  },
  { 
    id: 8, 
    name: 'Velvet Sofa', 
    price: 899.00, 
    originalPrice: null, 
    image: '/images/prod8.jpg?v=2', 
    hoverImage: '/images/h3.jpg?v=2', 
    badge: 'Popular' 
  },
];

export default function ProductGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Trending Now</h2>
          <p className={styles.subtitle}>Discover the most loved items this week.</p>
        </div>
        
        <div className={styles.grid}>
          {products.map((product) => {
            let discountPercent = 0;
            if (product.originalPrice && product.originalPrice > product.price) {
              discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            }

            return (
              <div key={product.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  {discountPercent > 0 ? (
                    <span className={`${styles.badge} ${styles.discountBadge}`}>
                      -{discountPercent}%
                    </span>
                  ) : product.badge ? (
                    <span className={styles.badge}>{product.badge}</span>
                  ) : null}
                  
                  {/* Primary Image */}
                <div className={styles.imagePlaceholder}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={styles.productImage}
                  />
                </div>
                
                {/* Secondary (Hover) Image */}
                <div className={`${styles.imagePlaceholder} ${styles.hoverImage}`}>
                  <img 
                    src={product.hoverImage} 
                    alt={`${product.name} hover`} 
                    className={styles.productImage}
                  />
                </div>
                  
                  <div className={styles.actionOverlay}>
                    <button className={styles.addToCartBtn}>Add to Cart</button>
                  </div>
                </div>
                
                <div className={styles.content}>
                  <Link href={`/product/${product.id}`} className={styles.name}>
                    {product.name}
                  </Link>
                  <div className={styles.priceContainer}>
                    {product.originalPrice ? (
                      <>
                        <span className={styles.priceDiscounted}>${product.price.toFixed(2)}</span>
                        <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className={styles.price}>${product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className={styles.footer}>
          <Link href="/shop" className={styles.viewAllBtn}>
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
