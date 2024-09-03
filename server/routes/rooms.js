// routes/rooms.js
const express = require('express');
const router = express.Router();
const MeetingRoom = require('../models/MeetingRoom');


router.get('/', async (req, res) => {
  
  try {
    const existingRoom = await MeetingRoom.find()
   

 

    res.status(201).json({ message: 'Room list ', room: existingRoom });
  } catch (error) {
    res.status(500).json({ message: 'Error listing room', error });
  }
});



// Create a new meeting room
router.post('/', async (req, res) => {
  const { name, capacity, location } = req.body;

  try {
    const existingRoom = await MeetingRoom.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room already exists' });
    }

    const newRoom = new MeetingRoom({ name, capacity, location });
    await newRoom.save();

    res.status(201).json({ message: 'Room created successfully', room: newRoom });
  } catch (error) {
    res.status(500).json({ message: 'Error creating room', error });
  }
});

// Edit a meeting room
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, capacity, location } = req.body;

  try {
    const room = await MeetingRoom.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.name = name || room.name;
    room.capacity = capacity || room.capacity;
    room.location = location || room.location;

    await room.save();
    res.status(200).json({ message: 'Room updated successfully', room });
  } catch (error) {
    res.status(500).json({ message: 'Error updating room', error });
  }
});

// Delete a meeting room
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const room = await MeetingRoom.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    await room.remove();
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room', error });
  }
});

module.exports = router;
