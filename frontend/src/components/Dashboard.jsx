import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { People, AccessTime, TrendingUp, Schedule } from '@mui/icons-material';
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

  const statCards = [
    {
      title: 'Total Visits',
      value: stats.totalVisits,
      icon: <People />,
      color: 'primary.main',
      bgColor: 'primary.light',
    },
    {
      title: 'Current Visitors',
      value: stats.currentVisitors,
      icon: <TrendingUp />,
      color: 'secondary.main',
      bgColor: 'secondary.light',
    },
    {
      title: 'Average Duration',
      value: `${stats.averageDuration} min`,
      icon: <AccessTime />,
      color: 'warning.main',
      bgColor: 'warning.light',
    },
    {
      title: 'Peak Hours',
      value: '2-4 PM',
      icon: <Schedule />,
      color: 'info.main',
      bgColor: 'info.light',
    },
  ];

  return (
    <Box>
      <Box sx={{
        mb: 4,
        p: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 30% 20%, rgba(25, 118, 210, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(56, 142, 60, 0.1) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        },
      }}>
        <Typography variant="h4" gutterBottom sx={{
          color: 'primary.main',
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 2,
          position: 'relative',
          zIndex: 1
        }}>
          📊 Library Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom sx={{
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          Real-time overview of library activity and visitor statistics.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, ${card.bgColor}20 0%, ${card.bgColor}10 100%)`,
                opacity: 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
              },
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                '&::before': {
                  opacity: 1,
                },
              },
            }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Avatar sx={{
                  mx: 'auto',
                  mb: 2,
                  bgcolor: card.bgColor,
                  color: card.color,
                  width: 56,
                  height: 56
                }}>
                  {card.icon}
                </Avatar>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  {card.title}
                </Typography>
                <Typography variant="h4" sx={{ color: card.color, fontWeight: 'bold' }}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
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