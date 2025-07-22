const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// === MIDDLEWARE ===
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// === ROUTES ===
// ✅ Import route modules
try {
  app.use('/clients', require('./routes/clients'));
  app.use('/faqs', require('./routes/faqs'));
  app.use('/api/mission', require('./routes/mission'));
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/meet-our-team', require('./routes/meetOurTeam'));
  app.use('/api/services', require('./routes/services'));
  app.use('/api/courses', require('./routes/courses'));
  app.use('/api/contact', require('./routes/contact'));
  app.use('/api/overview', require('./routes/overview'));
  app.use('/api/coupons', require('./routes/coupons'));
  app.use('/api/testimonials', require('./routes/testimonials'));
} catch (err) {
  console.error('❌ Route error:', err.message);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// === SERVER LISTENER ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});