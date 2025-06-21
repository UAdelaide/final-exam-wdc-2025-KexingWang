const express = require('express');
const router = express.Router();
const db = require('../models/db');

// get /api/dogs Fetches all dogs with their owner information
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        dog_id,
        name AS dog_name,
        size,
        owner_id
      FROM Dogs
    `);

    // Respond with the array of dog objects in JSON format
    res.json(results);
  } catch (err) {
    // Log the error details
    console.error('Error fetching dogs:', err);
    // Send a 500 Internal Server Error response with an error message
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

module.exports = router;