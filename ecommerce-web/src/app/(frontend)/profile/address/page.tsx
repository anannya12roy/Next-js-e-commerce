"use client";

import React, { useState } from 'react';
import styles from '../Profile.module.css';

const dummyAddresses = [
  { id: 1, phone: '08862423473', address: 'Consequatur sunt in', country: 'Bangladesh', district: 'Dhaka', area: 'Dhaka', isDefault: true },
  { id: 2, phone: '4427273214', address: 'Enim eu aute molesti', country: 'Bangladesh', district: 'Bogora', area: 'Adamighi', isDefault: false },
];

export default function AddressBookPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [addresses, setAddresses] = useState(dummyAddresses);

  // Form State
  const [country, setCountry] = useState('');
  const [district, setDistrict] = useState('');
  const [area, setArea] = useState('');
  const [phone, setPhone] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress = {
      id: Date.now(),
      phone,
      address: addressDetails,
      country,
      district,
      area,
      isDefault
    };
    
    if (isDefault) {
      setAddresses(addresses.map(a => ({ ...a, isDefault: false })).concat(newAddress));
    } else {
      setAddresses([...addresses, newAddress]);
    }
    
    setIsCreating(false);
    // Reset
    setCountry(''); setDistrict(''); setArea(''); setPhone(''); setAddressDetails(''); setIsDefault(false);
  };

  if (isCreating) {
    return (
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
        <div className={styles.darkHeader}>Address Book</div>
        <div className={styles.addressContent}>
          <div className={styles.sectionTitleWithIcon} style={{ marginBottom: '24px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            CREATE ADDRESS
          </div>
          
          <form className={styles.addressForm} onSubmit={handleSave}>
            <div className={styles.formRow}>
              <div>
                <label className={styles.infoLabel}>Country *</label>
                <select className={styles.select} value={country} onChange={(e) => setCountry(e.target.value)} required>
                  <option value="">Please select</option>
                  <option value="Bangladesh">Bangladesh</option>
                </select>
              </div>
              <div>
                <label className={styles.infoLabel}>District *</label>
                <select className={styles.select} value={district} onChange={(e) => setDistrict(e.target.value)} required>
                  <option value="">Please select</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Bogora">Bogora</option>
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div>
                <label className={styles.infoLabel}>Area *</label>
                <select className={styles.select} value={area} onChange={(e) => setArea(e.target.value)} required>
                  <option value="">Please select</option>
                  <option value="Dhaka">Dhaka</option>
                  <option value="Adamighi">Adamighi</option>
                </select>
              </div>
              <div>
                <label className={styles.infoLabel}>Phone *</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="Enter phone number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className={styles.infoLabel}>Address *</label>
              <textarea 
                className={styles.textarea} 
                placeholder="Address Details"
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
                required
              ></textarea>
            </div>

            <div className={styles.checkboxRow}>
              <input 
                type="checkbox" 
                id="defaultAddr" 
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <label htmlFor="defaultAddr">Make default address</label>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.addNewBtn} onClick={() => setIsCreating(false)}>BACK LIST</button>
              <button type="submit" className={styles.addNewBtn}>SAVE ADDRESS</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
      <div className={styles.darkHeader}>Address Book</div>
      
      <div className={styles.addressContent}>
        <div className={styles.sectionHeaderRow}>
          <div className={styles.sectionTitleWithIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="10" r="2"></circle>
            </svg>
            SAVED ADDRESS
          </div>
          <button className={styles.addNewBtn} onClick={() => setIsCreating(true)}>Add New</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>PHONE</th>
                <th>ADDRESS</th>
                <th>COUNTRY</th>
                <th>DISTRICT</th>
                <th>AREA</th>
                <th>DEFAULT</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((addr) => (
                <tr key={addr.id}>
                  <td>{addr.phone}</td>
                  <td>{addr.address}</td>
                  <td>{addr.country}</td>
                  <td>{addr.district}</td>
                  <td>{addr.area}</td>
                  <td>
                    <span className={`${styles.defaultPill} ${addr.isDefault ? styles['default-yes'] : styles['default-no']}`}>
                      {addr.isDefault ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <button className={styles.actionBtn}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </button>
                    <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDelete(addr.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
