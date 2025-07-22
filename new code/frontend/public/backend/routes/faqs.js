const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all FAQs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faq ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// POST - Add new FAQ
router.post('/', async (req, res) => {
  const { question, answer } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO faq (question, answer) VALUES ($1, $2) RETURNING *',
      [question, answer]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add FAQ' });
  }
});

// PUT - Update FAQ by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  try {
    const result = await pool.query(
      'UPDATE faq SET question = $1, answer = $2 WHERE id = $3 RETURNING *',
      [question, answer, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

// DELETE - Delete FAQ by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM faq WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

module.exports = router;
