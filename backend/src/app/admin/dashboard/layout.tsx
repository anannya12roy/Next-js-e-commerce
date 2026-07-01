"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../admin-global.css';
import { MediaModalProvider } from '@/contexts/MediaModalContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [productsOpen, setProductsOpen] = useState(true);
  const [attributesOpen, setAttributesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const match = (text: string) => !searchTerm || text.toLowerCase().includes(searchTerm.toLowerCase());

  const productsMenu = [
    { label: 'Add New product', href: '/admin/dashboard/products/add', bullet: 'solid' },
    { label: 'All Products', href: '/admin/dashboard/products', bullet: 'solid' },
    { label: 'Product Info Export', href: '#', bullet: 'solid' },
    { label: 'Product Stock Visibility', href: '#', bullet: 'solid' },
    { label: 'Gift Vouchers', href: '#', bullet: 'solid' },
    { label: 'Update Gift Voucher', href: '#', bullet: 'solid' },
    { label: 'Update Product Stocks', href: '#', bullet: 'solid' },
    { label: 'Products Ordering', href: '#', bullet: 'solid' },
    { label: 'Product Collection', href: '#', bullet: 'solid' },
    { label: 'Digital Products', href: '#', bullet: 'solid' },
    { label: 'Bulk Import', href: '#', bullet: 'solid' },
    { label: 'Category Bulk Link', href: '#', bullet: 'solid' },
    { label: 'Category', href: '/admin/dashboard/category', bullet: 'solid' },
    { label: 'Brand', href: '/admin/dashboard/category/brand', bullet: 'solid' },
    { label: 'Product Reviews', href: '/admin/dashboard/category/reviews', bullet: 'solid' },
  ];

  const attributesMenu = [
    { label: 'Attribute', href: '/admin/dashboard/attributes', bullet: 'solid' },
    { label: 'Colors', href: '/admin/dashboard/features/colors', bullet: 'hollow' },
    { label: 'Fit', href: '/admin/dashboard/features/fit', bullet: 'hollow' },
    { label: 'Fabrication', href: '/admin/dashboard/features/fabrication', bullet: 'hollow' },
    { label: 'Embellishment', href: '/admin/dashboard/features/embellishment', bullet: 'hollow' },
    { label: 'Item Segment', href: '/admin/dashboard/features/segment', bullet: 'hollow' },
    { label: 'Sleeve Length', href: '/admin/dashboard/features/sleeve-length', bullet: 'hollow' },
    { label: 'Product Composition', href: '/admin/dashboard/features/product-composition', bullet: 'hollow' },
    { label: 'Author', href: '/admin/dashboard/features/author', bullet: 'hollow' },
    { label: 'Publication', href: '/admin/dashboard/features/publication', bullet: 'hollow' },
  ];

  const filteredProducts = productsMenu.filter(item => match(item.label));
  const filteredAttributes = attributesMenu.filter(item => match(item.label));

  const HomeIcon = () => (
    <svg className="navIcon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const DashboardIcon = () => (
    <svg className="navIcon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const ListIcon = () => (
    <svg className="navIcon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );

  const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
    <svg className={`chevron ${expanded ? 'chevronExpanded' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const MediaIcon = () => (
    <svg className="navIcon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const AttributesIcon = () => (
    <svg className="navIcon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );

  return (
    <MediaModalProvider>
      <div className="layoutContainer">
        <aside className="sidebar">
          <div className="logoContainer">
            <span className="logoText">NEXORA</span>
          </div>
          
          <div className="searchContainer">
            <input 
              type="text" 
              placeholder="Search in menu" 
              className="searchInput" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <nav className="nav">
            {match('Home') && (
              <Link href="/" className="navItem">
                <div className="navItemContent">
                  <HomeIcon /> Home
                </div>
              </Link>
            )}
            
            {match('Dashboard') && (
              <Link href="/admin/dashboard" className={`navItem ${pathname === '/admin/dashboard' ? 'active' : ''}`}>
                <div className="navItemContent">
                  <DashboardIcon /> Dashboard
                </div>
              </Link>
            )}

            {match('Media') && (
              <Link href="/admin/dashboard/media" className={`navItem ${pathname?.includes('/media') ? 'active' : ''}`}>
                <div className="navItemContent">
                  <MediaIcon /> Media
                </div>
              </Link>
            )}

            {match('Menus') && (
              <Link href="/admin/dashboard/menus" className={`navItem ${pathname?.includes('/admin/dashboard/menus') ? 'active' : ''}`}>
                <div className="navItemContent">
                  <ListIcon /> Menus
                </div>
              </Link>
            )}

            {/* Products Accordion */}
            {(match('Products') || filteredProducts.length > 0) && (
              <div className="navItemWrapper">
                <div 
                  className={`navItem ${pathname?.includes('/products') || productsOpen || searchTerm ? 'active' : ''}`}
                  onClick={() => setProductsOpen(!productsOpen)}
                >
                  <div className="navItemContent">
                    <ListIcon /> Products
                  </div>
                  <ChevronIcon expanded={productsOpen || !!searchTerm} />
                </div>
                
                {(productsOpen || searchTerm) && (
                  <div className="submenu">
                    {filteredProducts.map((item, index) => (
                      <Link key={index} href={item.href} className={`subNavItem ${pathname === item.href ? 'activeSub' : ''}`}>
                        {item.bullet === 'solid' ? (
                          <span className="bullet"></span>
                        ) : (
                          <span style={{ fontSize: '10px', marginRight: '8px', opacity: 0.5 }}>○</span>
                        )}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Attributes Accordion */}
            {(match('Attributes') || filteredAttributes.length > 0) && (
              <div className="navItemWrapper">
                <div 
                  className={`navItem ${pathname?.includes('/admin/dashboard/attributes') || attributesOpen || searchTerm ? 'active' : ''}`}
                  onClick={() => setAttributesOpen(!attributesOpen)}
                >
                  <div className="navItemContent">
                    <AttributesIcon /> Attributes
                  </div>
                  <ChevronIcon expanded={attributesOpen || !!searchTerm} />
                </div>
                
                {(attributesOpen || searchTerm) && (
                  <div className="submenu">
                    {filteredAttributes.map((item, index) => (
                      <Link key={index} href={item.href} className={`subNavItem ${pathname === item.href ? 'activeSub' : ''}`}>
                        {item.bullet === 'solid' ? (
                          <span className="bullet"></span>
                        ) : (
                          <span style={{ fontSize: '10px', marginRight: '8px', opacity: 0.5 }}>○</span>
                        )}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

          </nav>
        </aside>
        <main className="mainContent">
          {children}
        </main>
      </div>
    </MediaModalProvider>
  );
}
