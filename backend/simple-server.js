const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    port: PORT
  });
});

// API root
app.get('/api', (req, res) => {
  res.json({
    message: 'FitSync AI Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// Basic API routes placeholder
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'Backend is running successfully!',
    timestamp: new Date().toISOString(),
    frontend_url: process.env.FRONTEND_URL
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested API endpoint does not exist'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 FitSync AI Backend Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
});