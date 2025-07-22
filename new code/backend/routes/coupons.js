const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all coupons
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /coupons error:', err);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

// Add new coupon
router.post('/', async (req, res) => {
  const { code, discount, time_limit } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO coupons (code, discount, time_limit)
       VALUES ($1, $2, $3) RETURNING *`,
      [code, discount, time_limit]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('POST /coupons error:', err);
    res.status(500).json({ error: 'Failed to add coupon' });
  }
});

// Update coupon
router.put('/:code', async (req, res) => {
  const { code } = req.params;
  const { discount, time_limit } = req.body;
  try {
    const result = await pool.query(
      `UPDATE coupons SET discount = $1, time_limit = $2 WHERE code = $3 RETURNING *`,
      [discount, time_limit, code]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /coupons error:', err);
    res.status(500).json({ error: 'Failed to update coupon' });
  }
});

// Delete coupon
router.delete('/:code', async (req, res) => {
  const { code } = req.params;
  try {
    await pool.query('DELETE FROM coupons WHERE code = $1', [code]);
    res.json({ deleted: true });
  } catch (err) {
    console.error('DELETE /coupons error:', err);
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

module.exports = router;
