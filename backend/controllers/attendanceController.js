const Attendance = require('../models/Attendance');

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { hoursLogged, note } = req.body;

    // Check if already marked today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await Attendance.findOne({
      volunteer: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for today!' });
    }

    const attendance = await Attendance.create({
      volunteer: req.user.id,
      hoursLogged,
      note
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my attendance
exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ volunteer: req.user.id })
      .sort({ date: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all attendance (admin)
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate('volunteer', 'name email city')
      .sort({ date: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my stats
exports.getMyStats = async (req, res) => {
  try {
    const records = await Attendance.find({ volunteer: req.user.id });
    const totalDays = records.length;
    const totalHours = records.reduce((sum, r) => sum + r.hoursLogged, 0);
    res.status(200).json({ totalDays, totalHours });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};