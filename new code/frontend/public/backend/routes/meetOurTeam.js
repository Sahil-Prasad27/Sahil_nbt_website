const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (_, res) => {
  const result = await pool.query('SELECT * FROM meet_our_team ORDER BY image_sequence');
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { image, name, description, position, number, image_sequence } = req.body;
  const result = await pool.query(
    `INSERT INTO meet_our_team (image, name, description, position, number, image_sequence)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [image, name, description, position, number, image_sequence]
  );
  res.json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const { image, name, description, position, number, image_sequence } = req.body;
  const result = await pool.query(
    `UPDATE meet_our_team SET image=$1, name=$2, description=$3, position=$4, number=$5, image_sequence=$6 WHERE id=$7 RETURNING *`,
    [image, name, description, position, number, image_sequence, req.params.id]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM meet_our_team WHERE id=$1', [req.params.id]);
  res.json({ deleted: true });
});

module.exports = router;
