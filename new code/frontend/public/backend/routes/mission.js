const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (_, res) => {
  const result = await pool.query('SELECT * FROM our_mission ORDER BY id');
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { title, description, students, courses, success_rate } = req.body;
  const result = await pool.query(
    `INSERT INTO our_mission (title, description, students, courses, success_rate) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, description, students, courses, success_rate]
  );
  res.json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const { title, description, students, courses, success_rate } = req.body;
  const result = await pool.query(
    `UPDATE our_mission SET title=$1, description=$2, students=$3, courses=$4, success_rate=$5 WHERE id=$6 RETURNING *`,
    [title, description, students, courses, success_rate, req.params.id]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM our_mission WHERE id=$1', [req.params.id]);
  res.json({ deleted: true });
});

module.exports = router;
