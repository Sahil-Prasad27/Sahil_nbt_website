const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (_, res) => {
  const result = await pool.query('SELECT * FROM our_courses ORDER BY id');
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { description, course_available_count, student_enrolled, avg_rating } = req.body;
  const result = await pool.query(
    `INSERT INTO our_courses (description, course_available_count, student_enrolled, avg_rating)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [description, course_available_count, student_enrolled, avg_rating]
  );
  res.json(result.rows[0]);
});

router.put('/:id', async (req, res) => {
  const { description, course_available_count, student_enrolled, avg_rating } = req.body;
  const result = await pool.query(
    `UPDATE our_courses SET description=$1, course_available_count=$2, student_enrolled=$3, avg_rating=$4 WHERE id=$5 RETURNING *`,
    [description, course_available_count, student_enrolled, avg_rating, req.params.id]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM our_courses WHERE id=$1', [req.params.id]);
  res.json({ deleted: true });
});

module.exports = router;
