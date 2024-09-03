const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Approve or reject a booking
router.post('/approve/:bookingId', async (req, res) => {
  const { bookingId } = req.params;
  const { managerId, status } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found.' });
  }

  booking.status = status;
  booking.manager = managerId;

  await booking.save();

  res.status(200).json({ message: `Booking ${status}.`, booking });
});

module.exports = router;
