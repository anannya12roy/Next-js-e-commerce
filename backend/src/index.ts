import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    // Check if user exists
    const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/dashboard', async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Order Metrics
    const [orderMetrics]: any = await pool.query(`
      SELECT 
        COUNT(id) as totalOrders,
        SUM(CASE WHEN discount_amount > 0 THEN 1 ELSE 0 END) as discountedOrders,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as ordersInProcess,
        SUM(CASE WHEN status = 'unfulfilled' THEN 1 ELSE 0 END) as ordersUnfulfilled,
        SUM(total_amount) as netRevenue,
        SUM(subtotal) as totalRevenue,
        SUM(discount_amount) as discountedRevenue
      FROM orders
    `);

    // 2. User Metrics
    const [userMetrics]: any = await pool.query(`
      SELECT 
        COUNT(id) as totalCustomers,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as newCustomers
      FROM users WHERE role = 'user'
    `);

    // 3. Sales Performance (Line Chart - Last 30 days)
    const [salesPerformance]: any = await pool.query(`
      SELECT DATE(created_at) as date, SUM(total_amount) as revenue
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // 4. Top Products
    const [topProducts]: any = await pool.query(`
      SELECT p.name, SUM(oi.quantity) as sold, SUM(oi.price * oi.quantity) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.id
      ORDER BY revenue DESC
      LIMIT 5
    `);

    // 5. Monthly Sales
    const [monthlySales]: any = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_amount) as revenue
      FROM orders
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY month
      ORDER BY month ASC
    `);

    const data = orderMetrics[0];
    const users = userMetrics[0];

    const totalSalesPercentage = 12.5;

    res.json({
      metrics: {
        totalOrders: parseInt(data.totalOrders) || 0,
        discountedOrders: parseInt(data.discountedOrders) || 0,
        ordersInProcess: parseInt(data.ordersInProcess) || 0,
        orderUnfulfilled: parseInt(data.ordersUnfulfilled) || 0,
        totalRevenue: parseFloat(data.totalRevenue) || 0,
        discountedRevenue: parseFloat(data.discountedRevenue) || 0,
        netRevenue: parseFloat(data.netRevenue) || 0,
        totalSalesPercentage,
        salesPerformance: parseFloat(data.netRevenue) || 0,
        newCustomers: parseInt(users.newCustomers) || 0,
        totalCustomers: parseInt(users.totalCustomers) || 0
      },
      charts: {
        salesPerformance,
        topProducts,
        monthlySales
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Media CRUD ---

// Upload file
app.post('/api/media/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    
    const file = req.file;
    const url = `http://localhost:${port}/uploads/${file.filename}`;
    
    const [result]: any = await pool.query(
      `INSERT INTO media (original_name, filename, mime_type, size, url) VALUES (?, ?, ?, ?, ?)`,
      [file.originalname, file.filename, file.mimetype, file.size, url]
    );
    
    res.status(201).json({ 
      id: result.insertId, 
      message: 'File uploaded successfully',
      url
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all media
app.get('/api/media', async (req: Request, res: Response): Promise<void> => {
  try {
    const [media]: any = await pool.query('SELECT * FROM media ORDER BY created_at DESC');
    res.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete media
app.delete('/api/media/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query('SELECT filename FROM media WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'File not found' });
      return;
    }
    
    const filename = rows[0].filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await pool.query('DELETE FROM media WHERE id = ?', [req.params.id]);
    
    res.json({ message: 'File deleted' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Brand CRUD ---

// Get all brands
app.get('/api/brands', async (req: Request, res: Response): Promise<void> => {
  try {
    const [brands]: any = await pool.query('SELECT * FROM brands ORDER BY id DESC');
    res.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single brand
app.get('/api/brands/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM brands WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create brand
app.post('/api/brands', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, logo, status, meta_title, meta_description } = req.body;
    const [result]: any = await pool.query(
      `INSERT INTO brands (name, logo, status, meta_title, meta_description) VALUES (?, ?, ?, ?, ?)`,
      [name, logo, status || 'active', meta_title, meta_description]
    );
    res.status(201).json({ id: result.insertId, message: 'Brand created' });
  } catch (error) {
    console.error('Error creating brand:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update brand
app.put('/api/brands/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, logo, status, meta_title, meta_description } = req.body;
    await pool.query(
      `UPDATE brands SET name=?, logo=?, status=?, meta_title=?, meta_description=? WHERE id=?`,
      [name, logo, status || 'active', meta_title, meta_description, req.params.id]
    );
    res.json({ message: 'Brand updated' });
  } catch (error) {
    console.error('Error updating brand:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete brand
app.delete('/api/brands/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await pool.query('DELETE FROM brands WHERE id = ?', [req.params.id]);
    res.json({ message: 'Brand deleted' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Category CRUD ---

// Get all categories
app.get('/api/categories', async (req: Request, res: Response): Promise<void> => {
  try {
    const [categories]: any = await pool.query('SELECT * FROM categories ORDER BY ordering_number ASC');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single category
app.get('/api/categories/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create category
app.post('/api/categories', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, parent_category, brand, ordering_number, banner, category_image, slug, status, meta_title, meta_description } = req.body;
    const [result]: any = await pool.query(
      `INSERT INTO categories 
      (name, parent_category, brand, ordering_number, banner, category_image, slug, status, meta_title, meta_description) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, parent_category || null, brand, ordering_number || 0, banner, category_image, slug, status || 'active', meta_title, meta_description]
    );
    res.status(201).json({ id: result.insertId, message: 'Category created' });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Slug must be unique' });
      return;
    }
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update category
app.put('/api/categories/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, parent_category, brand, ordering_number, banner, category_image, slug, status, meta_title, meta_description } = req.body;
    await pool.query(
      `UPDATE categories SET 
        name=?, parent_category=?, brand=?, ordering_number=?, banner=?, category_image=?, slug=?, status=?, meta_title=?, meta_description=?
       WHERE id=?`,
      [name, parent_category || null, brand, ordering_number || 0, banner, category_image, slug, status || 'active', meta_title, meta_description, req.params.id]
    );
    res.json({ message: 'Category updated' });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Slug must be unique' });
      return;
    }
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete category
app.delete('/api/categories/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the E-Commerce API');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
