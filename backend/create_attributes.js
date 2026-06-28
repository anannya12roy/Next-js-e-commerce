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
      CREATE TABLE IF NOT EXISTS attributes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Attributes table created');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS attribute_values (
        id INT AUTO_INCREMENT PRIMARY KEY,
        attribute_id INT NOT NULL,
        value VARCHAR(255) NOT NULL,
        alias_value VARCHAR(255),
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE CASCADE
      )
    `);
    console.log('Attribute values table created');

  } catch(e) {
    console.error(e);
  } finally {
    if(connection) await connection.end();
  }
}
run();
