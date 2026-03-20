import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField
} from '@mui/material';
import axios from 'axios';

const VisitorLog = () => {
  const [checkins, setCheckins] = useState([]);
  const [filteredCheckins, setFilteredCheckins] = useState([]);
  const [search, setSearch] = useState('');

  // ✅ Fetch data on load
  useEffect(() => {
    fetchCheckins();
  }, []);

  // ✅ Filter data
  useEffect(() => {
    const filtered = checkins.filter((checkin) =>
      checkin.visitorId?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCheckins(filtered);
  }, [search, checkins]);

  // ✅ API call function (OUTSIDE useEffect)
  const fetchCheckins = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first ❌");
        return;
      }

      const res = await axios.get('http://localhost:5000/api/checkins', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCheckins(res.data);

    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Visitor Log
      </Typography>

      <Typography variant="body1" color="text.secondary" gutterBottom>
        View all check-in and check-out records.
      </Typography>

      {/* 🔍 Search */}
      <Box sx={{ mt: 3, mb: 2 }}>
        <TextField
          label="Search by Visitor ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
        />
      </Box>

      {/* 📊 Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Visitor ID</TableCell>
              <TableCell>Book ID</TableCell>
              <TableCell>Check-in Time</TableCell>
              <TableCell>Check-out Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredCheckins.map((checkin) => (
              <TableRow key={checkin._id}>
                <TableCell>{checkin.visitorId}</TableCell>
                <TableCell>{checkin.bookId || 'N/A'}</TableCell>
                <TableCell>
                  {new Date(checkin.checkinTime).toLocaleString()}
                </TableCell>
                <TableCell>
                  {checkin.checkoutTime
                    ? new Date(checkin.checkoutTime).toLocaleString()
                    : 'N/A'}
                </TableCell>
                <TableCell>{checkin.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
};

export default VisitorLog;