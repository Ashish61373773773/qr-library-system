import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVisits: 0,
    currentVisitors: 0,
    averageDuration: 0,
    recentActivity: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/checkins/stats/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Mock data for chart
  const chartData = [
    { hour: '9', visitors: 5 },
    { hour: '10', visitors: 12 },
    { hour: '11', visitors: 8 },
    { hour: '12', visitors: 15 },
    { hour: '13', visitors: 20 },
    { hour: '14', visitors: 18 },
    { hour: '15', visitors: 25 },
    { hour: '16', visitors: 22 },
    { hour: '17', visitors: 16 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Library Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Real-time overview of library activity and visitor statistics.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Visits
              </Typography>
              <Typography variant="h5">
                {stats.totalVisits}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Current Visitors
              </Typography>
              <Typography variant="h5">
                {stats.currentVisitors}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Duration
              </Typography>
              <Typography variant="h5">
                {stats.averageDuration} min
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Peak Hours
              </Typography>
              <Typography variant="h5">
                2-4 PM
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hourly Visitor Traffic
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              {stats.recentActivity.map((activity, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    Visitor {activity.visitorId} {activity.status === 'checked-in' ? 'checked in' : 'checked out'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(activity.checkinTime).toLocaleTimeString()}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;