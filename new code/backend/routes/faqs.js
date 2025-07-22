const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'https://your-frontend.onrender.com' })); // Replace with frontend URL
app.use(express.json());

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL is missing');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to Supabase PostgreSQL');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err.message, err.stack);
    process.exit(1);
  }
})();

app.get('/faqs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faqs');
    res.json(result.rows);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

app.post('/faqs', async (req, res) => {
  const { question, answer } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO faqs (question, answer) VALUES ($1, $2) RETURNING *',
      [question, answer]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Failed to add FAQ' });
  }
});

app.put('/faqs/:id', async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  try {
    const result = await pool.query(
      'UPDATE faqs SET question = $1, answer = $2 WHERE id = $3 RETURNING *',
      [question, answer, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

app.delete('/faqs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM faqs WHERE id = $1', [id]);
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

app.listen(10000, () => {
  console.log('✅ Server is running on port 10000');
});