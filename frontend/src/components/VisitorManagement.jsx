import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';

const VisitorManagement = () => {
  const [visitors, setVisitors] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    visitorId: '',
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      const res = await axios.get('/api/visitors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Visitors response:', res.data);
      setVisitors(res.data);
    } catch (err) {
      console.error('Error fetching visitors:', err);
      console.error('Error response:', err.response);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Creating visitor with token:', token);
      console.log('Form data:', formData);
      const res = await axios.post('/api/visitors', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Create visitor response:', res.data);
      setOpen(false);
      setFormData({ visitorId: '', name: '', email: '', phone: '' });
      fetchVisitors();
    } catch (err) {
      console.error('Error creating visitor:', err);
      console.error('Error response:', err.response);
    }
  };

  const generateVisitorId = () => {
    const nextId = `V${String(visitors.length + 1).padStart(3, '0')}`;
    setFormData({ ...formData, visitorId: nextId });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <div>
          <Typography variant="h4" gutterBottom>
            Visitor Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage library visitors.
          </Typography>
        </div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Visitor
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Registered Visitors ({visitors.length})
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Visitor ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visitors.map((visitor) => (
                      <TableRow key={visitor._id}>
                        <TableCell>{visitor.visitorId}</TableCell>
                        <TableCell>{visitor.name}</TableCell>
                        <TableCell>{visitor.email}</TableCell>
                        <TableCell>{visitor.phone}</TableCell>
                        <TableCell>
                          {new Date(visitor.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Visitor</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Visitor ID"
              value={formData.visitorId}
              onChange={(e) => setFormData({ ...formData, visitorId: e.target.value })}
              margin="normal"
              required
              helperText="Unique identifier for the visitor (e.g., V001, V002)"
            />
            <Button
              type="button"
              variant="outlined"
              size="small"
              onClick={generateVisitorId}
              sx={{ mt: 1, mb: 2 }}
            >
              Auto Generate ID
            </Button>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create Visitor</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default VisitorManagement;