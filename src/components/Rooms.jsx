import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  formContainer: {
    padding: '30px',
    margin: '30px auto',
    maxWidth: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  formElement: {
    marginBottom: '20px',
    width: '100%',
  },
  button: {
    marginTop: '20px',
    padding: '12px 0',
    fontSize: '16px',
    backgroundColor: '#1976d2',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
  roomList: {
    marginTop: '30px',
    padding: '0',
  },
  roomItem: {
    backgroundColor: '#f1f1f1',
    margin: '10px 0',
    borderRadius: '5px',
    padding: '10px 15px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  },
  noRoomsText: {
    marginTop: '20px',
    color: '#888',
  },
}));

const Rooms = () => {
  const classes = useStyles();
  const [roomName, setRoomName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/rooms');
      console.log(response,'jjki');
      
      setRooms(response.data.room);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim() || !capacity || !location.trim()) {
      alert('All fields are required');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/rooms', {
        name: roomName,
        capacity: parseInt(capacity, 10), // Ensure capacity is a number
        location,
      });
      setRoomName(''); // Clear input after room creation
      setCapacity('');
      setLocation('');
      fetchRooms(); // Refresh the room list after adding a new room
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Error creating room');
    }
  };

  return (
    <Box>
      <Paper className={classes.formContainer} elevation={3}>
        <Typography variant="h5" align="center" gutterBottom>
          Create a New Meeting Room
        </Typography>
        <TextField
          label="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className={classes.formElement}
          required
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          type="number"
          className={classes.formElement}
          required
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={classes.formElement}
          required
          variant="outlined"
          fullWidth
        />
        <Button
          variant="contained"
          className={classes.button}
          onClick={handleCreateRoom}
          fullWidth
        >
          Create Room
        </Button>
      </Paper>
      <List className={classes.roomList}>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <ListItem key={room._id} className={classes.roomItem}>
              <ListItemText
                primary={room.name}
                secondary={`Capacity: ${room.capacity}, Location: ${room.location}`}
              />
            </ListItem>
          ))
        ) : (
          <Typography align="center" className={classes.noRoomsText}>
            No rooms available. Please create one!
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default Rooms;
