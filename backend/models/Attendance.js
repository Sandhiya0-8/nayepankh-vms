const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  hoursLogged: { type: Number, default: 0 },
  note: { type: String },
  markedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attendance', attendanceSchema);