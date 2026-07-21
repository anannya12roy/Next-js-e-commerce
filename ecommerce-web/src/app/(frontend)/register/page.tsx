"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/components/Auth.module.css';
import { getOtpSetting, registerUser } from '@/actions/authActions';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isOtpEnabled, setIsOtpEnabled] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSetting() {
      const res = await getOtpSetting();
      if (res.success && res.value === '1') {
        setIsOtpEnabled(true);
      }
    }
    loadSetting();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (isOtpEnabled) {
      // Proceed to OTP step
      setStep(2);
    } else {
      // Direct registration
      await performRegistration();
    }
  };

  const performRegistration = async () => {
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phone', phone);
    
    const res = await registerUser(formData);
    setLoading(false);
    
    if (res.success) {
      router.push('/login');
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '1234') { // Mock OTP validation
      await performRegistration();
    } else {
      setError('Invalid OTP. Use 1234 for testing.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create an account</h1>
          <p className={styles.subtitle}>Join us today to get started.</p>
        </div>
        {error && (
          <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>
        )}

          {step === 1 ? (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="firstName">First name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    className={styles.input} 
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="lastName">Last name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    className={styles.input} 
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="email">Email address</label>
                <input 
                  type="email" 
                  id="email" 
                  className={styles.input} 
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="phone">Phone number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className={styles.input} 
                  placeholder="+88017xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  className={styles.input} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  className={styles.input} 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Creating...' : isOtpEnabled ? 'Proceed to OTP' : 'Create Account'}
              </button>
            </form>
          ) : (
            <form className={styles.form} onSubmit={handleOtpVerify}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="otp">Enter OTP sent to your email/phone</label>
                <input 
                  type="text" 
                  id="otp" 
                  className={styles.input} 
                  placeholder="1234"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Verifying...' : 'Verify & Register'}
              </button>
              <button type="button" onClick={() => setStep(1)} style={{ background: 'transparent', border: 'none', color: '#666', marginTop: '10px', cursor: 'pointer', display: 'block', width: '100%' }}>
                Go Back
              </button>
            </form>
          )}

        <div className={styles.footer}>
          Already have an account? 
          <Link href="/login" className={styles.footerLink}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
