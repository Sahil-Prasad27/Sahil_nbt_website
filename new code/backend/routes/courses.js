const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all courses
router.get('/', async (_, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /courses failed:', err.stack);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// CREATE new course
router.post('/', async (req, res) => {
  try {
    const {
      image,           // maps to image_url
      type,
      description_1,
      title,
      description_2,
      educator,
      timeline,
      people,
      rating,
      link
    } = req.body;

    // Validate required fields
    if (!title || !type || !educator) {
      return res.status(400).json({ error: 'Title, type, and educator are required' });
    }

    const result = await pool.query(
      `INSERT INTO courses 
      (image_url, type, description_1, title, description_2, educator, timeline, people, rating, link)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [image, type, description_1, title, description_2, educator, timeline, people, rating, link]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /courses failed:', err.stack);
    res.status(500).json({ error: 'Failed to add course' });
  }
});

// UPDATE a course
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      type,
      description_1,
      title,
      description_2,
      educator,
      timeline,
      people,
      rating,
      link
    } = req.body;

    // Validate required fields
    if (!title || !type || !educator) {
      return res.status(400).json({ error: 'Title, type, and educator are required' });
    }

    const result = await pool.query(
      `UPDATE courses SET 
       image_url=$1, type=$2, description_1=$3, title=$4, description_2=$5,
       educator=$6, timeline=$7, people=$8, rating=$9, link=$10
       WHERE id=$11 RETURNING *`,
      [image, type, description_1, title, description_2, educator, timeline, people, rating, link, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: `Course with id ${id} not found` });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT /courses/:id failed:', err.stack);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// DELETE a course
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: `Course with id ${id} not found` });
    }

    res.json({ deleted: true, course: result.rows[0] });
  } catch (err) {
    console.error('DELETE /courses/:id failed:', err.stack);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

module.exports = router;