const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Move secret to environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_here';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Query database
    const result = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
    
    // Check if admin exists
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const admin = result.rows[0];
    
    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: admin.id,
        email: admin.email
        // Add other relevant claims
      }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );

    // Successful login
    res.json({ 
      token,
      user: {
        id: admin.id,
        email: admin.email
        // Exclude password and other sensitive data
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
});

module.exports = router;