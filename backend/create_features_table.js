const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecommerce'
    });

    console.log('Connected to DB');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_features (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Product Features table created');

  } catch(e) {
    console.error(e);
  } finally {
    if(connection) await connection.end();
  }
}
run();
