const { Pool } = require('pg');
require('dotenv').config();

// Database connection configuration
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: 'postgres', // Connect to default postgres database first
  password: process.env.PGPASSWORD || 'postgres',
  port: process.env.PGPORT || 5432,
});

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // Create database if it doesn't exist
    await client.query('CREATE DATABASE numpath');
    console.log('✅ Database created successfully');
  } catch (error) {
    // Database might already exist, which is fine
    if (error.code !== '42P04') { // 42P04 is the error code for "database already exists"
      console.error('Error creating database:', error);
      process.exit(1);
    }
    console.log('ℹ️  Database already exists');
  } finally {
    await client.release();
  }

  // Connect to the new database
  const db = new Pool({
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: 'numpath',
    password: process.env.PGPASSWORD || 'postgres',
    port: process.env.PGPORT || 5432,
  });

  const dbClient = await db.connect();

  try {
    // Create users table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20),
        date_of_birth DATE,
        gender VARCHAR(20),
        birth_place VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create profiles table
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        useremail VARCHAR(100) NOT NULL,
        name VARCHAR(100) NOT NULL,
        dob DATE NOT NULL,
        tim TIME NOT NULL,
        place VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (useremail) REFERENCES users(email) ON DELETE CASCADE
      )
    `);

    // Create indexes
    await dbClient.query('CREATE INDEX IF NOT EXISTS idx_user_email ON users(email)');
    await dbClient.query('CREATE INDEX IF NOT EXISTS idx_profile_useremail ON profiles(useremail)');

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  } finally {
    await dbClient.release();
    await db.end();
    await pool.end();
  }
}

initializeDatabase().then(() => {
  console.log('✅ Database initialization completed');  
  process.exit(0);
}).catch(error => {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
});
