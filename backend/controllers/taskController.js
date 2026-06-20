const Task = require('../models/Task');

// Create task (admin only)
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;
    const task = await Task.create({
      title, description, assignedTo, dueDate,
      assignedBy: req.user.id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks (admin)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my tasks (volunteer)
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('assignedBy', 'name');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task status (volunteer)
exports.updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};