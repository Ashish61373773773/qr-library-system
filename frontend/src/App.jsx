import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ScanQR from './components/ScanQR';
import GenerateQR from './components/GenerateQR';
import VisitorLog from './components/VisitorLog';

const theme = createTheme();

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {isAuthenticated ? (
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scan" element={<ScanQR />} />
              <Route path="/generate" element={<GenerateQR />} />
              <Route path="/log" element={<VisitorLog />} />
            </Routes>
          </Layout>
        ) : (
          <Login onLogin={setIsAuthenticated} />
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;