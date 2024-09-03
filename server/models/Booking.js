// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    id: String,
    name: String
  },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'MeetingRoom' },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  attendees: [
    {
      id: String,
      name: String
    }
  ],
  rejectRemark:{
    type:String
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
