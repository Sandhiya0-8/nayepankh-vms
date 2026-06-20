const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer' }).select('-password');
    res.status(200).json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;