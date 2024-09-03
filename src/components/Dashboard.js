import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from '@mui/material';

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [remarkOpen, setRemarkOpen] = useState(false);
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [bookings, setBookings] = useState({ pending: [], approved: [], rejected: [] });
  const [view, setView] = useState('pending'); // State to toggle between views
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [remark, setRemark] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleClickOpen = (attendees) => {
    setSelectedAttendees(attendees);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRemarkOpen(false);
    setRemark('');
  };

  const handleApprove = async (bookingId) => {
    try {
      await axios.post(`http://localhost:3000/api/bookings/approve/${bookingId}`, {
        status: 'approved',
      });
      fetchBookings(); // Refresh the bookings list after approval
    } catch (error) {
      console.error('Error approving booking:', error);
    }
  };

  const handleDisapprove = (bookingId) => {
    setSelectedBookingId(bookingId);
    setRemarkOpen(true);
  };

  const handleSubmitDisapprove = async () => {
    try {
      await axios.post(`http://localhost:3000/api/bookings/approve/${selectedBookingId}`, {
        status: 'rejected',
        remark: remark,
      });
      fetchBookings(); // Refresh the bookings list after disapproval
      handleClose();
    } catch (error) {
      console.error('Error disapproving booking:', error);
    }
  };

  const renderTableRows = (bookings) => (
    bookings.map((booking) => (
      <TableRow key={booking._id}>
        <TableCell>{booking._id}</TableCell>
        <TableCell>{booking.room.name}</TableCell>
        <TableCell>{new Date(booking.startTime).toLocaleDateString()}</TableCell>
        <TableCell>{new Date(booking.startTime).toLocaleTimeString()}</TableCell>
        <TableCell>{Math.round((new Date(booking.endTime) - new Date(booking.startTime)) / (1000 * 60))} minutes</TableCell>
        <TableCell>
          <Button variant="contained" color="primary" onClick={() => handleClickOpen(booking.attendees.map(a => a.name))}>
            {booking.attendees.length} Attendees
          </Button>
        </TableCell>
        {view === 'pending' && (
          <TableCell>
            <Button
              variant="contained"
              color="success"
              sx={{ mr: 1 }}
              onClick={() => handleApprove(booking._id)}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDisapprove(booking._id)}
            >
              Disapprove
            </Button>
          </TableCell>
        )}
        {view === 'rejected' && (
          <TableCell>
            {booking.rejectRemark}
          </TableCell>
        )}
      </TableRow>
    ))
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color={view === 'pending' ? 'primary' : 'default'}
          onClick={() => setView('pending')}
          sx={{ mr: 2 }}
        >
          Pending Bookings
        </Button>
        <Button
          variant="contained"
          color={view === 'approved' ? 'primary' : 'default'}
          onClick={() => setView('approved')}
          sx={{ mr: 2 }}
        >
          Approved Bookings
        </Button>
        <Button
          variant="contained"
          color={view === 'rejected' ? 'primary' : 'default'}
          onClick={() => setView('rejected')}
        >
          Rejected Bookings
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Attendees</TableCell>
              {view === 'pending' && <TableCell>Actions</TableCell>}
              {view === 'rejected' && <TableCell>Remark</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTableRows(bookings[view])}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Meeting Attendees</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedAttendees.map((attendee, index) => (
                  <TableRow key={index}>
                    <TableCell>{attendee}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="primary" onClick={() => alert(`Action for ${attendee}`)}>
                        Perform Action
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={remarkOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Disapprove Booking</DialogTitle>
        <DialogContent>
          <TextField
            label="Remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmitDisapprove} color="error" variant="contained">
            Submit Disapproval
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
