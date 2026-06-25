import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Helper to get random item from array
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
// Helper to get random number in range
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
// Helper to get random date within past N days
const getRandomDate = (pastDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() - getRandomInt(0, pastDays));
  return date;
};

async function seed() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('Connected to MySQL server.');
    const dbName = process.env.DB_NAME || 'ecommerce';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.query(`USE \`${dbName}\`;`);

    // --- Schema Creation ---

    // Users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Media
    await connection.query(`
      CREATE TABLE IF NOT EXISTS media (
        id INT AUTO_INCREMENT PRIMARY KEY,
        original_name VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100),
        size INT,
        url VARCHAR(1024) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Brands
    await connection.query(`
      CREATE TABLE IF NOT EXISTS brands (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo VARCHAR(1024),
        status VARCHAR(50) DEFAULT 'active',
        meta_title VARCHAR(255),
        meta_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Categories
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        parent_category INT NULL,
        brand VARCHAR(255),
        ordering_number INT DEFAULT 0,
        banner VARCHAR(1024),
        category_image VARCHAR(1024),
        slug VARCHAR(255) NOT NULL UNIQUE,
        status VARCHAR(50) DEFAULT 'active',
        meta_title VARCHAR(255),
        meta_description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_category) REFERENCES categories(id) ON DELETE SET NULL
      );
    `);

    // Products
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100),
        stock INT DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Orders
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        subtotal DECIMAL(10, 2) NOT NULL,
        discount_amount DECIMAL(10, 2) DEFAULT 0,
        total_amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    // Order Items
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `);

    console.log('Tables checked/created.');

    // --- Data Seeding ---
    
    // 1. Admin User
    const [adminRows]: any = await connection.query('SELECT id FROM users WHERE email = ?', ['admin@gmail.com']);
    if (adminRows.length === 0) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await connection.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', ['admin@gmail.com', hashedPassword, 'admin']);
    }

    // Check if we already have mock data (to avoid duplication on multiple seeds)
    const [existingProducts]: any = await connection.query('SELECT COUNT(*) as count FROM products');
    if (existingProducts[0].count > 0) {
      console.log('Database already contains data, skipping mock data generation.');
      return;
    }

    console.log('Seeding mock data...');

    // 2. Mock Users
    const mockUsers = [];
    const hashedMockPassword = await bcrypt.hash('password123', 10);
    for (let i = 1; i <= 50; i++) {
      const createdDate = getRandomDate(90); // Over last 90 days
      const email = `customer${i}@example.com`;
      const [result]: any = await connection.query(
        'INSERT INTO users (email, password, role, created_at) VALUES (?, ?, ?, ?)',
        [email, hashedMockPassword, 'user', createdDate]
      );
      mockUsers.push({ id: result.insertId, created_at: createdDate });
    }

    // 3. Mock Products
    const productCategories = ['Electronics', 'Clothing', 'Home', 'Books', 'Toys'];
    const mockProducts = [];
    for (let i = 1; i <= 20; i++) {
      const price = getRandomInt(10, 500) + 0.99;
      const [result]: any = await connection.query(
        'INSERT INTO products (name, price, category, stock) VALUES (?, ?, ?, ?)',
        [`Product ${i}`, price, getRandomItem(productCategories), getRandomInt(10, 200)]
      );
      mockProducts.push({ id: result.insertId, price });
    }

    // 4. Mock Orders & Order Items
    const orderStatuses = ['completed', 'completed', 'completed', 'processing', 'unfulfilled', 'pending'];
    
    for (let i = 1; i <= 150; i++) {
      const user = getRandomItem(mockUsers);
      // Order date should be on or after user creation
      const orderDate = new Date(user.created_at.getTime() + getRandomInt(0, 30) * 24*60*60*1000); 
      if (orderDate > new Date()) orderDate.setTime(new Date().getTime()); // Don't exceed current date

      // Determine items
      const numItems = getRandomInt(1, 4);
      let subtotal = 0;
      const orderItems = [];
      
      for(let j=0; j<numItems; j++) {
        const product = getRandomItem(mockProducts);
        const quantity = getRandomInt(1, 3);
        subtotal += product.price * quantity;
        orderItems.push({ productId: product.id, quantity, price: product.price });
      }

      // Apply random discount to some orders
      let discountAmount = 0;
      if (Math.random() > 0.7) { // 30% chance of discount
        discountAmount = subtotal * (getRandomInt(5, 20) / 100); // 5-20% discount
      }
      const totalAmount = subtotal - discountAmount;
      const status = getRandomItem(orderStatuses);

      const [orderResult]: any = await connection.query(
        'INSERT INTO orders (user_id, status, subtotal, discount_amount, total_amount, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [user.id, status, subtotal, discountAmount, totalAmount, orderDate]
      );
      const orderId = orderResult.insertId;

      for (const item of orderItems) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.productId, item.quantity, item.price]
        );
      }
    }

    console.log('Mock data successfully seeded!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit();
  }
}

seed();
