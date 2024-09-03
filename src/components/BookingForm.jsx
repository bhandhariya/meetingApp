import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Paper,
  Typography,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    padding: '20px',
    margin: 'auto',
    maxWidth: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  formElement: {
    marginBottom: '15px',
    width: '100%',
  },
  button: {
    marginTop: '20px',
  },
}));

const BookingForm = () => {
  const classes = useStyles();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/rooms')
      .then(response => {
        if (Array.isArray(response.data.room)) {
          setRooms(response.data.room);
        } else {
          console.error('Expected an array of rooms, but got:', response.data);
          setRooms([]); // Set to empty array if the response is not what we expected
        }
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
        setRooms([]); // Handle the case where the request fails
      });

    axios.get('http://localhost:3000/api/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleBooking = async () => {
    try {
      const attendees = selectedUsers.map(userId => {
        const user = users.find(user => user.id === userId);
        return { id: user.id, name: user.name };
      });

      const payload = {
        roomId: selectedRoom,
        startTime: new Date(`${date} ${startTime}`),
        endTime: new Date(`${date} ${endTime}`),
        userId: 'user1', // Static user ID
        name: 'Alice Johnson', // Static user name
        attendees,
        purpose: 'Team Meeting'
      };

      const response = await axios.post('http://localhost:3000/api/bookings', payload);

      alert(response.data.message);
      // Reset the form after successful booking
      setSelectedRoom('');
      setDate('');
      setStartTime('');
      setEndTime('');
      setSelectedUsers([]);
    } catch (error) {
      console.error('Booking failed:', error);
      alert(error.response.data.message);
    }
  };

  const handleUserChange = (event) => {
    const value = event.target.value;
    setSelectedUsers(value);
  };

  return (
    <Grid container justifyContent="center">
      <Paper className={classes.formContainer} elevation={3}>
        <Typography variant="h5" align="center" gutterBottom>
          Book a Meeting Room
        </Typography>
        <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }}>
          <FormControl className={classes.formElement}>
            <InputLabel>Select Room</InputLabel>
            <Select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              required
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {rooms.map(room => (
                <MenuItem key={room._id} value={room._id}>{room.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formElement}>
            <InputLabel>Select Attendees</InputLabel>
            <Select
              multiple
              value={selectedUsers}
              onChange={handleUserChange}
              renderValue={(selected) => selected.map(id => users.find(user => user.id === id)?.name).join(', ')}
            >
              {users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  <Checkbox checked={selectedUsers.indexOf(user.id) > -1} />
                  <ListItemText primary={user.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={classes.formElement}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            label="Start Time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={classes.formElement}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            label="End Time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={classes.formElement}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            fullWidth
          >
            Book Room
          </Button>
        </form>
      </Paper>
    </Grid>
  );
};

export default BookingForm;
