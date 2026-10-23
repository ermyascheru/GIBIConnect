const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or same-origin) or any local dev server
    callback(null, true);
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve API Routes
app.use('/api', routes);

// Admin Dashboard Route
app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/admin-dashboard.html'));
});

// Serve Frontend Static SPA Assets & Routes
const frontendDir = path.resolve(__dirname, '../../frontend');
app.use(express.static(frontendDir));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Centralized 404 handler for API endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    data: null,
    error: { code: 'NOT_FOUND', path: req.originalUrl }
  });
});

app.use(errorHandler);

module.exports = app;
