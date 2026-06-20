const express = require('express');
const router = express.Router();
const { markAttendance, getMyAttendance, getAllAttendance, getMyStats } = require('../controllers/attendanceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/mark', protect, markAttendance);
router.get('/my', protect, getMyAttendance);
router.get('/stats', protect, getMyStats);
router.get('/all', protect, adminOnly, getAllAttendance);

module.exports = router;