const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const contentRoutes = require('./routes/content');

const app = express();

// Connect to MongoDB (cached for serverless reuse)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log('Connected to MongoDB');
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Health check
app.get('/', (req, res) => {
  res.json({
    name: 'Efo Kodjo API',
    status: 'running',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Routes
app.use('/api/content', contentRoutes);

// Local dev: start as a normal server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

module.exports = app;
