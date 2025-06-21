const express = require('express');
const router = express.Router();

/**
 * GET /api/walkers/summary
 * Fetches summary statistics for all walkers
 */
router.get('/summary', async (req, res) => {
  try {
    // Execute SQL query to aggregate walker statistics
    const [results] = await req.db.query(`
      SELECT
        u.username AS walker_username,
        COUNT(DISTINCT wr.rating_id) AS total_ratings,
        ROUND(AVG(wr.rating), 1)    AS average_rating,
        COUNT(DISTINCT CASE
          WHEN wreq.status = 'completed'
          THEN wa.request_id
          ELSE NULL
        END)                        AS completed_walks
      FROM Users AS u
      LEFT JOIN WalkApplications AS wa
        ON u.user_id = wa.walker_id
      LEFT JOIN WalkRequests AS wreq
        ON wa.request_id = wreq.request_id
      LEFT JOIN WalkRatings AS wr
        ON wr.request_id = wa.request_id
       AND wr.walker_id = u.user_id
      WHERE u.role = 'walker'
      GROUP BY u.user_id;
    `);

    // Respond with the array of walkers objects in JSON format
    res.json(results);
  } catch (err) {
    // Log the error details
    console.error('Error fetching walker summaries:', err);
    // Send a 500 Internal Server Error response with an error message
    res.status(500).json({ error: 'Failed to fetch walker summaries' });
  }
});

module.exports = router;
