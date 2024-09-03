const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const MeetingRoom = require('../models/MeetingRoom');


const staticUsers = [
  { id: 'user1', name: 'Alice Johnson' },
  { id: 'user2', name: 'Bob Smith' },
  { id: 'user3', name: 'Charlie Davis' },
  // { id: 'user4', name: 'Diana Prince' },
];


// Create a new booking
router.post('/', async (req, res) => {
  const { userId, name,roomId, startTime, endTime, attendees, purpose } = req.body;

  try {
    const room = await MeetingRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check for time conflicts
    const conflictingBookings = await Booking.find({
      room: roomId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (conflictingBookings.length > 0) {
      return res.status(409).json({ message: 'Time conflict with another booking' });
    }

    const booking = new Booking({
      user: { id: userId, name: name }, // Static user
      room: roomId,
      startTime,
      endTime,
      attendees,
      purpose,
      status: 'pending'
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error });
  }
});

// List pending bookings
router.get('/pending', async (req, res) => {
  try {
    const pendingBookings = await Booking.find({ status: 'pending' }).populate('room');
    res.status(200).json(pendingBookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending bookings', error });
  }
});

// List approved bookings
router.get('/approved', async (req, res) => {
  try {
    const approvedBookings = await Booking.find({ status: 'approved' }).populate('room');
    res.status(200).json(approvedBookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching approved bookings', error });
  }
});

// Approve or reject a booking
router.post('/approve/:bookingId', async (req, res) => {
  const { bookingId } = req.params;
  const { status, remark } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;

    if (status === 'rejected') {
      booking.rejectRemark = remark;
    }

    await booking.save();

    res.status(200).json({ message: `Booking ${status}`, booking });
  } catch (error) {
    res.status(500).json({ message: 'Error processing booking', error });
  }
});

// Get all bookings (pending, approved, rejected)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('room')
      .exec();

    const pendingBookings = bookings.filter(booking => booking.status === 'pending');
    const approvedBookings = bookings.filter(booking => booking.status === 'approved');
    const rejectedBookings = bookings.filter(booking => booking.status === 'rejected');

    res.status(200).json({
      pending: pendingBookings,
      approved: approvedBookings,
      rejected: rejectedBookings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
});
module.exports = router;

