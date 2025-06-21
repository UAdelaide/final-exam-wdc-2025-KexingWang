const express = require('express');
const router = express.Router();

// GET /api/walkrequests/open
// Fetch all open walk requests
router.get('/open', async (req, res) => {
  try {
    const [results] = await req.db.query(`
      SELECT
        wr.request_id,
        d.name              AS dog_name,
        wr.requested_time,
        wr.duration_minutes,
        wr.location,
        u.username          AS owner_username
      FROM WalkRequests AS wr
      INNER JOIN Dogs AS d
        ON wr.dog_id = d.dog_id
      INNER JOIN Users AS u
        ON d.owner_id = u.user_id
      WHERE wr.status = 'open'
    `);

    // Respond with the array of open walkrequests objects in JSON format
    res.json(results);
  } catch (err) {
    // Log the error details
    console.error('Error fetching open walk requests:', err);
    // Send a 500 Internal Server Error response with an error message
    res.status(500).json({ error: 'Failed to fetch open walk requests' });
  }
});

module.exports = router;
