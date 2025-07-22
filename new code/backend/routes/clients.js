// backend/routes/clients.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add a new client
router.post('/', async (req, res) => {
  const {
    client_name,
    company_name,
    task,
    duration,
    link,
    status,
    contact_email,
    notes
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO client (client_name, company_name, task, duration, link, status, contact_email, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [client_name, company_name, task, duration, link, status, contact_email, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Failed to add client' });
  }
});

// Get all clients
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM client ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

module.exports = router;
