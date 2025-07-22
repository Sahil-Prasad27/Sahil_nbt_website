const { Pool } = require('pg');
require('dotenv').config();

// Configure connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Connected to Supabase PostgreSQL');
  }
});

module.exports = pool;