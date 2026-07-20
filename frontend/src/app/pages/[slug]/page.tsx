"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import styles from './Page.module.css';

// This is a helper to simulate database content for these informational pages.
const getPageData = (slug: string) => {
  switch (slug) {
    case 'faq':
      return {
        title: "Frequently Asked Questions",
        subtitle: "Everything you need to know about Nexora.",
        content: (
          <>
            <h2>Orders & Payments</h2>
            <h3>What payment methods do you accept?</h3>
            <p>We accept Cash on Delivery (COD), bKash, and all major credit cards via SSLCommerz. Your transactions are secure and encrypted.</p>
            
            <h3>Can I change or cancel my order?</h3>
            <p>You can change or cancel your order within 24 hours of placing it. Please contact our support team immediately if you need to make changes.</p>

            <h2>Shipping & Delivery</h2>
            <h3>How long does delivery take?</h3>
            <p>Inside Dhaka, delivery typically takes 1-2 business days. Outside Dhaka, please allow 3-5 business days for your order to arrive.</p>
            
            <h3>Do you offer international shipping?</h3>
            <p>Currently, we only ship within Bangladesh. We are working hard to expand our reach internationally in the near future.</p>
          </>
        )
      };
    case 'shipping':
      return {
        title: "Shipping & Returns",
        subtitle: "Our policies for delivering joy and handling returns.",
        content: (
          <>
            <h2>Shipping Policy</h2>
            <p>All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
            
            <h3>Domestic Shipping Rates and Estimates</h3>
            <ul>
              <li><strong>Inside Dhaka:</strong> ৳60 (1-2 Days)</li>
              <li><strong>Outside Dhaka:</strong> ৳120 (3-5 Days)</li>
            </ul>

            <h2>Returns Policy</h2>
            <p>We accept returns up to 7 days after delivery, if the item is unused and in its original condition, and we will refund the full order amount minus the shipping costs for the return.</p>
            <p>In the event that your order arrives damaged in any way, please email us as soon as possible with your order number and a photo of the item's condition.</p>
          </>
        )
      };
    case 'terms':
      return {
        title: "Terms of Service",
        subtitle: "Please read these terms carefully before using our services.",
        content: (
          <>
            <h2>1. Introduction</h2>
            <p>Welcome to Nexora. By accessing or using our website, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to all the terms and conditions, you must not access the website.</p>
            
            <h2>2. Products & Services</h2>
            <p>Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.</p>
            <p>We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.</p>

            <h2>3. Pricing</h2>
            <p>Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>

            <h2>4. Contact Information</h2>
            <p>Questions about the Terms of Service should be sent to us at support@nexora.com.</p>
          </>
        )
      };
    default:
      return {
        title: "Page Not Found",
        subtitle: "The page you are looking for does not exist.",
        content: (
          <p>We couldn't find the page you were looking for. Please use the navigation menu to return to the shop.</p>
        )
      };
  }
};

export default function InformationalPage() {
  const { slug } = useParams();
  const pageSlug = typeof slug === 'string' ? slug : 'faq';
  const data = getPageData(pageSlug);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.hero}>
        <h1 className={styles.title}>{data.title}</h1>
        <p className={styles.subtitle}>{data.subtitle}</p>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.card}>
          <div className={styles.prose}>
            {data.content}
          </div>
        </div>
      </div>
    </div>
  );
}
