'use server';

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getSetting(key: string) {
  try {
    const [rows]: any = await pool.query('SELECT setting_value FROM settings WHERE setting_key = ?', [key]);
    if (rows && rows.length > 0) {
      return { success: true, value: rows[0].setting_value };
    }
    return { success: false, error: 'Setting not found' };
  } catch (error) {
    console.error('Error fetching setting:', error);
    return { success: false, error: 'Failed to fetch setting' };
  }
}

export async function updateSetting(key: string, value: string) {
  try {
    await pool.query(
      'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      [key, value, value]
    );
    revalidatePath('/admin/dashboard/feature-activation');
    return { success: true };
  } catch (error) {
    console.error('Error updating setting:', error);
    return { success: false, error: 'Failed to update setting' };
  }
}
