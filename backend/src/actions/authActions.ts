'use server';

import pool from '@/lib/db';
import { cookies } from 'next/headers';

export async function loginUser(email: string, password: string) {
  try {
    const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return { success: false, error: 'Invalid email or password' };
    }

    const user = rows[0];
    
    // For now we check plain text password based on existing logic.
    if (user.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Role check
    if (user.role === 'customer' || user.role === 'guest') {
      return { success: false, error: 'Access denied: You do not have permission to access the admin dashboard' };
    }

    // Set cookie for middleware validation
    const cookieStore = await cookies();
    cookieStore.set('auth_token', user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });

    return {
      success: true,
      token: 'dummy-jwt-token-12345',
      user: { id: user.id, email: user.email, role: user.role }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
