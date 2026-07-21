'use client';

import React, { useState, useEffect } from 'react';
import { getSetting, updateSetting } from '@/actions/settingActions';
import toast, { Toaster } from 'react-hot-toast';

export default function FeatureActivationPage() {
  const [isOtpEnabled, setIsOtpEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSetting() {
      const res = await getSetting('otp_registration');
      if (res.success) {
        setIsOtpEnabled(res.value === '1');
      }
      setLoading(false);
    }
    loadSetting();
  }, []);

  const handleToggle = async () => {
    const newValue = !isOtpEnabled;
    setIsOtpEnabled(newValue);
    
    const res = await updateSetting('otp_registration', newValue ? '1' : '0');
    if (res.success) {
      toast.success(`OTP Registration ${newValue ? 'Enabled' : 'Disabled'}`);
    } else {
      toast.error('Failed to update setting');
      setIsOtpEnabled(!newValue); // revert
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading settings...</div>;

  return (
    <div style={{ padding: '30px' }}>
      <Toaster />
      <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>Feature Activation</h1>
      
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '500px'
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '5px' }}>OTP Based Registration</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Enable or disable OTP verification during customer registration.
          </p>
        </div>
        
        {/* Toggle Switch */}
        <div style={{ cursor: 'pointer' }} onClick={handleToggle}>
          <div style={{
            width: '50px',
            height: '26px',
            backgroundColor: isOtpEnabled ? '#10B981' : '#ccc',
            borderRadius: '26px',
            position: 'relative',
            transition: 'background-color 0.3s ease'
          }}>
            <div style={{
              width: '22px',
              height: '22px',
              backgroundColor: '#fff',
              borderRadius: '50%',
              position: 'absolute',
              top: '2px',
              left: isOtpEnabled ? '26px' : '2px',
              transition: 'left 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
