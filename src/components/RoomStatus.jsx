import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoomStatus = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/rooms')
      .then(response => setBookings(response.data))
      .catch(error => console.error('Error fetching room status:', error));
  }, []);

  return (
    <div>
      <h2>Room Status</h2>
      <ul>
        {bookings.map(booking => (
          <li key={booking._id}>
            Room: {booking.room.name}, Booked By: {booking.user.name}, 
            From: {new Date(booking.startTime).toLocaleString()}, 
            To: {new Date(booking.endTime).toLocaleString()}, 
            Status: {booking.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomStatus;
