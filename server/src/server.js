const express = require('express');
const cors = require('cors');
require('dotenv').config();

const uploadRoutes = require('./uploadRoutes');
const clipRoutes = require('./clipRoutes');
const { startCleanup } = require('./cleanup');

const app = express();
const PORT = process.env.PORT || 5000;
startCleanup();

// Middleware
app.use(cors());
app.use(express.json());

// Main route
app.get('/', (req, res) => {
  res.send('Welcome to the 4Clips API!');
});

// Video upload routes
app.use('/api/videos', uploadRoutes);

app.use('/api/clips', clipRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`4Clips server is running on port ${PORT}`);
});
