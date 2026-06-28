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

    // Add image and status columns
    await connection.query(`
      ALTER TABLE product_features 
      ADD COLUMN image VARCHAR(255) NULL,
      ADD COLUMN status VARCHAR(50) DEFAULT 'Active'
    `);
    console.log('Added image and status to product_features');

  } catch(e) {
    console.error(e);
  } finally {
    if(connection) await connection.end();
  }
}
run();
