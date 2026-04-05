import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Button, Alert, Card, CardContent,
  Chip, Stack, Dialog, DialogTitle, DialogContent,
  DialogActions, Avatar, CheckCircle, Error, QrCode
} from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

const SelfCheckin = () => {
  const [scannedData, setScannedData] = useState(null);
  const [visitorInfo, setVisitorInfo] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (scanning) {
      scannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 300, height: 300 } },
        false
      );
      scannerRef.current.render(onScanSuccess, onScanError);
    } else if (scannerRef.current) {
      scannerRef.current.clear();
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [scanning]);

  const onScanSuccess = async (decodedText) => {
    setScanning(false);
    try {
      const parsedData = JSON.parse(decodedText);
      setScannedData(parsedData);

      // Get visitor info first
      const visitorRes = await axios.get(`/api/visitors/${parsedData.visitorId}`);
      setVisitorInfo(visitorRes.data);

      // Perform check-in/check-out
      const checkinRes = await axios.post('/api/checkins/scan', parsedData);

      setMessage(checkinRes.data.message);
      setError('');
      setShowResult(true);

      // Auto-hide result after 5 seconds
      setTimeout(() => {
        setShowResult(false);
        resetScanner();
      }, 5000);

    } catch (err) {
      console.error('Scan error:', err);
      setError('Invalid QR code or visitor not found');
      setMessage('');
      setShowResult(true);

      setTimeout(() => {
        setShowResult(false);
        resetScanner();
      }, 3000);
    }
  };

  const onScanError = (error) => {
    console.warn(`QR Code scan error: ${error}`);
  };

  const startScanning = () => {
    setScanning(true);
    setScannedData(null);
    setVisitorInfo(null);
    setMessage('');
    setError('');
    setShowResult(false);
  };

  const stopScanning = () => {
    setScanning(false);
  };

  const resetScanner = () => {
    setScannedData(null);
    setVisitorInfo(null);
    setMessage('');
    setError('');
    setShowResult(false);
    setScanning(false);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Card sx={{
        maxWidth: 600,
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        borderRadius: 4,
        overflow: 'visible'
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              mx: 'auto',
              mb: 2,
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
            }}>
              <QrCode sx={{ fontSize: 40, color: 'white' }} />
            </Avatar>
            <Typography variant="h3" gutterBottom sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Library Self Check-in
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Scan your QR code to check in or check out
            </Typography>
          </Box>

          {/* Scanner Area */}
          <Box sx={{ mb: 4 }}>
            {!scanning ? (
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={startScanning}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.2rem',
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                      boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Start Scanning
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', color: 'primary.main' }}>
                  📱 Position QR code within the frame
                </Typography>
                <Box
                  id="qr-reader"
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    maxWidth: 400,
                    mx: 'auto'
                  }}
                />
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={stopScanning}
                    sx={{ borderRadius: 2 }}
                  >
                    Stop Scanning
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* Instructions */}
          <Card sx={{
            bgcolor: 'grey.50',
            border: '2px solid',
            borderColor: 'primary.light',
            borderRadius: 2
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                📋 How to Check-in:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body1">• Get your QR code from the library admin</Typography>
                <Typography variant="body1">• Click "Start Scanning" above</Typography>
                <Typography variant="body1">• Position your QR code in front of the camera</Typography>
                <Typography variant="body1">• Wait for confirmation message</Typography>
              </Stack>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Result Dialog */}
      <Dialog
        open={showResult}
        onClose={() => setShowResult(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          {error ? (
            <Error sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
          ) : (
            <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
          )}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          {visitorInfo && (
            <Box sx={{ mb: 2 }}>
              <Avatar sx={{
                width: 60,
                height: 60,
                bgcolor: 'primary.main',
                mx: 'auto',
                mb: 1
              }}>
                {visitorInfo.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {visitorInfo.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {visitorInfo.visitorId}
              </Typography>
            </Box>
          )}

          {message && (
            <Alert severity="success" sx={{
              borderRadius: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              ✅ {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{
              borderRadius: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}>
              ❌ {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            onClick={() => setShowResult(false)}
            variant="contained"
            sx={{ borderRadius: 2, px: 4 }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SelfCheckin;