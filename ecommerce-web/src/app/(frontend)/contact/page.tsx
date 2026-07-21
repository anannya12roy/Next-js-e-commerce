"use client";

import React, { useState } from 'react';
import styles from './Contact.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for reaching out! Your message has been sent successfully.");
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.subtitle}>We'd love to hear from you. Please fill out this form.</p>
      </div>

      <div className={styles.main}>
        <div className={styles.grid}>
          {/* Contact Information Side */}
          <div className={styles.infoSide}>
            <h2 className={styles.infoTitle}>Get in touch</h2>
            <p className={styles.infoDesc}>
              Whether you have a question about products, delivery, pricing, or anything else, our team is ready to answer all your questions.
            </p>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className={styles.infoDetail}>
                <h4>Phone</h4>
                <p>+880 1712-345678</p>
                <p>Mon-Fri from 9am to 6pm.</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className={styles.infoDetail}>
                <h4>Email</h4>
                <p>support@nexora.com</p>
                <p>We typically reply within 24 hours.</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className={styles.infoDetail}>
                <h4>Office</h4>
                <p>House #42, Road #7, Block C, Banani</p>
                <p>Dhaka 1213, Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Contact Form Side */}
          <div className={styles.formSide}>
            <h2 className={styles.formTitle}>Send us a message</h2>
            <p className={styles.formDesc}>If you need help with an order, please include your Order ID.</p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="firstName">First name</label>
                  <input 
                    type="text" 
                    id="firstName"
                    name="firstName"
                    className={styles.input} 
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="lastName">Last name</label>
                  <input 
                    type="text" 
                    id="lastName"
                    name="lastName"
                    className={styles.input} 
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="email">Email address</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  className={styles.input} 
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="phone">Phone number (Optional)</label>
                <input 
                  type="tel" 
                  id="phone"
                  name="phone"
                  className={styles.input} 
                  placeholder="+88017xxxxxxxx"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="message">Message</label>
                <textarea 
                  id="message"
                  name="message"
                  className={styles.textarea} 
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className={styles.submitBtn}>Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
