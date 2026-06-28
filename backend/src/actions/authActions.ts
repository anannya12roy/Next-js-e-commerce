'use server';

import pool from '@/lib/db';

export async function loginUser(email: string, password: string) {
  try {
    if (email === 'admin@gmail.com' && password === '123456') {
      return {
        success: true,
        token: 'dummy-jwt-token-12345',
        user: { id: 1, email: 'admin@gmail.com', role: 'admin' }
      };
    } else {
      return { success: false, error: 'Invalid email or password' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
