const express = require('express');
const router = express.Router();
const { createTask, getAllTasks, getMyTasks, updateTaskStatus } = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, adminOnly, createTask);
router.get('/', protect, adminOnly, getAllTasks);
router.get('/my', protect, getMyTasks);
router.put('/:id', protect, updateTaskStatus);

module.exports = router;