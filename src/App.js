import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BookingForm from './components/BookingForm';
import Rooms from './components/Rooms';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
        <Sidebar />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Header />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              overflowY: 'auto',
              bgcolor: 'background.default',
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/bookings" element={<BookingForm />} />
              <Route path="/rooms" element={<Rooms />} />
              {/* Add more routes as needed */}
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
