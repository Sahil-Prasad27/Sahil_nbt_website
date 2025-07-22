const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (_, res) => {
  const result = await pool.query('SELECT * FROM our_services ORDER BY id');
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { image, title, description, points, price } = req.body;
  const result = await pool.query(
    `INSERT INTO our_services (image, title, description, points, price) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [image, title, description, points, price]
  );
  res.json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const { image, title, description, points, price } = req.body;
  const result = await pool.query(
    `UPDATE our_services SET image=$1, title=$2, description=$3, points=$4, price=$5 WHERE id=$6 RETURNING *`,
    [image, title, description, points, price, req.params.id]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM our_services WHERE id=$1', [req.params.id]);
  res.json({ deleted: true });
});

module.exports = router;
