const mysql = require('mysql2/promise');

async function createTables() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce',
  });
  
  try {
    console.log('Creating menus table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS menus (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        identifier VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Creating menu_items table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        menu_id INT NOT NULL,
        type VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        category_id INT DEFAULT NULL,
        parent_id INT DEFAULT NULL,
        sort_order INT DEFAULT 0,
        target VARCHAR(50) DEFAULT '_self',
        highlight_color VARCHAR(50) DEFAULT NULL,
        url VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);
    console.log('Creating coupons table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        discount_type ENUM('percentage', 'fixed') NOT NULL DEFAULT 'fixed',
        discount_amount DECIMAL(10, 2) NOT NULL,
        min_spend DECIMAL(10, 2) DEFAULT 0,
        max_discount DECIMAL(10, 2) DEFAULT NULL,
        start_date DATETIME,
        end_date DATETIME,
        usage_limit_total INT DEFAULT NULL,
        usage_limit_per_user INT DEFAULT NULL,
        used_count INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        condition_type ENUM('none', 'first_purchase', 'next_purchase', 'total_orders', 'category', 'product') DEFAULT 'none',
        condition_value JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Creating circular_discounts table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS circular_discounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        circular_number VARCHAR(255) NOT NULL UNIQUE,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        status ENUM('Active', 'Inactive') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Creating circular_discount_items table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS circular_discount_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        circular_id INT NOT NULL,
        product_id INT NOT NULL,
        barcode VARCHAR(255) NOT NULL,
        discount_percent DECIMAL(5, 2) DEFAULT 0,
        discount_amount DECIMAL(10, 2) DEFAULT 0,
        start_time DATETIME,
        end_time DATETIME,
        status ENUM('Active', 'Inactive') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (circular_id) REFERENCES circular_discounts(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    console.log('Creating orders table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT DEFAULT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) DEFAULT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        shipping_address TEXT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_status ENUM('Pending', 'Paid', 'Failed') DEFAULT 'Pending',
        order_status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Creating order_items table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT DEFAULT NULL,
        variant_id INT DEFAULT NULL,
        product_name VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
        FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
      )
    `);

    console.log('Creating settings table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(255) NOT NULL UNIQUE,
        setting_value VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Inserting default settings...');
    await pool.query(`
      INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('otp_registration', '0')
    `);

    console.log('Tables created successfully!');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
  process.exit(0);
}

createTables();
