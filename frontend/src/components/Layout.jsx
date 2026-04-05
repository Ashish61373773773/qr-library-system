import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, AppBar, Typography, Avatar } from '@mui/material';
import { Dashboard, QrCodeScanner, QrCode, History, People, LibraryBooks } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 280;

const Layout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Visitor Management', icon: <People />, path: '/visitors' },
    { text: 'Scan QR', icon: <QrCodeScanner />, path: '/scan' },
    { text: 'Generate QR', icon: <QrCode />, path: '/generate' },
    { text: 'Visitor Log', icon: <History />, path: '/log' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #1565c0 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        height: 70,
      }}>
        <Toolbar sx={{ height: 70, px: 3 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 3,
            p: 1,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          }}>
            <LibraryBooks sx={{ mr: 1, fontSize: 32 }} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              fontSize: '1.5rem',
              background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            QR Library System
          </Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Admin Panel
            </Typography>
            <Avatar sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              width: 40,
              height: 40,
              fontWeight: 'bold'
            }}>
              L
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: location.pathname === item.path ? 'inherit' : 'action.active' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: 'background.default',
        minHeight: '100vh',
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(25, 118, 210, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(56, 142, 60, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(255, 119, 198, 0.03) 0%, transparent 50%)
        `,
        backgroundAttachment: 'fixed',
      }}>
        <Toolbar sx={{ height: 70 }} />
        <Box className="fade-in-up" sx={{ maxWidth: '1200px', mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;