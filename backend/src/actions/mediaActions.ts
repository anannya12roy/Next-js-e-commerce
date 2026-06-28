'use server';

import pool from '@/lib/db';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function getMedia() {
  try {
    const [rows]: any = await pool.query('SELECT * FROM media ORDER BY created_at DESC');
    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching media:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function uploadMedia(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return { success: false, error: 'No file uploaded' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.name);
    const filename = uniqueSuffix + ext;

    // Save to public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;
    
    const [result]: any = await pool.query(
      `INSERT INTO media (original_name, filename, mime_type, size, url) VALUES (?, ?, ?, ?, ?)`,
      [file.name, filename, file.type, file.size, url]
    );
    
    return { 
      success: true,
      id: result.insertId, 
      message: 'File uploaded successfully',
      url
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function deleteMedia(id: number) {
  try {
    const [media]: any = await pool.query('SELECT * FROM media WHERE id = ?', [id]);
    
    if (media.length > 0) {
      const filename = media[0].filename;
      const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
      
      try {
        await unlink(filepath);
      } catch (err: any) {
        if (err.code !== 'ENOENT') {
          console.error('Failed to delete file from disk:', err);
        }
      }
      
      await pool.query('DELETE FROM media WHERE id = ?', [id]);
      return { success: true, message: 'Media deleted successfully' };
    } else {
      return { success: false, error: 'Media not found' };
    }
  } catch (error) {
    console.error('Error deleting media:', error);
    return { success: false, error: 'Internal server error' };
  }
}
