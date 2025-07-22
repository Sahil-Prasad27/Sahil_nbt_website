const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL pool connection

// GET all testimonials
router.get('/', async (_, res) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { name, email, message, rating } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO testimonials (name, email, message, rating) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, message, rating]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating testimonial:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT (update) a testimonial by ID
router.put('/:id', async (req, res) => {
  const { name, email, message, rating } = req.body;
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE testimonials SET name = $1, email = $2, message = $3, rating = $4 WHERE id = $5 RETURNING *',
      [name, email, message, rating, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating testimonial:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a testimonial by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM testimonials WHERE id = $1', [id]);
    res.json({ deleted: true });
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
