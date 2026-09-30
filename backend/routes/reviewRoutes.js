const express = require('express');
const { generateReview } = require('../services/aiService');

const router = express.Router();

router.post('/review', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        error: 'Code and language are required',
      });
    }

    const reviewData = await generateReview(code, language);
    res.json(reviewData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      error: 'Failed to generate review',
      details: error.message,
    });
  }
});

module.exports = router;
