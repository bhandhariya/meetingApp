// models/MeetingRoom.js
const mongoose = require('mongoose');

const meetingRoomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  location: { type: String, required: true },
});

module.exports = mongoose.model('MeetingRoom', meetingRoomSchema);
