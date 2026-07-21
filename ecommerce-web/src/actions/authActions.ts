'use server';

import pool from '@/lib/db';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function loginUser(email: string, password: string) {
  try {
    const [users]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (!users || users.length === 0) {
      // Fallback for hardcoded admin if not in DB
      if (email === 'admin@gmail.com' && password === '123456') {
        const cookieStore = await cookies();
        cookieStore.set('admin_token', 'dummy-jwt-token-12345', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        return { success: true, token: 'dummy-jwt-token-12345', user: { id: 1, email: 'admin@gmail.com', role: 'admin' } };
      }
      return { success: false, error: 'Invalid email or password' };
    }

    const user = users[0];
    let passwordMatch = false;
    
    // Check if the stored password is a bcrypt hash
    if (user.password && user.password.startsWith('$2')) {
      passwordMatch = await bcrypt.compare(password, user.password);
    } else {
      // Fallback for plaintext passwords (if any were created before encryption)
      passwordMatch = password === user.password;
    }

    if (!passwordMatch) {
      return { success: false, error: 'Invalid email or password' };
    }

    const cookieStore = await cookies();
    const tokenName = user.role === 'admin' ? 'admin_token' : 'user_token';
    
    cookieStore.set(tokenName, `dummy-jwt-token-${user.id}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    
    return {
      success: true,
      token: `dummy-jwt-token-${user.id}`,
      user: { id: user.id, email: user.email, role: user.role }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function getOtpSetting() {
  try {
    const [rows]: any = await pool.query('SELECT setting_value FROM settings WHERE setting_key = "otp_registration"');
    if (rows && rows.length > 0) {
      return { success: true, value: rows[0].setting_value };
    }
    return { success: false, error: 'Setting not found' };
  } catch (error) {
    console.error('Error fetching OTP setting:', error);
    return { success: false, error: 'Failed to fetch setting' };
  }
}

export async function registerUser(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const phone = formData.get('phone') as string || null;

    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    // Check if user exists
    const [existing]: any = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing && existing.length > 0) {
      return { success: false, error: 'Email already exists' };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert as customer
    const [result]: any = await pool.query(
      'INSERT INTO users (email, password, phone, role) VALUES (?, ?, ?, "customer")',
      [email, hashedPassword, phone]
    );

    return { success: true, userId: result.insertId };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: 'Internal server error during registration' };
  }
}
