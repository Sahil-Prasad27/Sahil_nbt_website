const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (_, res) => {
  const result = await pool.query('SELECT * FROM contact_us ORDER BY id');
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { full_name, email_address, subject, message } = req.body;
  const result = await pool.query(
    `INSERT INTO contact_us (full_name, email_address, subject, message) VALUES ($1,$2,$3,$4) RETURNING *`,
    [full_name, email_address, subject, message]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM contact_us WHERE id=$1', [req.params.id]);
  res.json({ deleted: true });
});

module.exports = router;
