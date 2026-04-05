import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Alert, Card, CardContent, Chip, Stack } from '@mui/material';
import { QrCodeScanner, CheckCircle, Error, CameraAlt } from '@mui/icons-material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

const ScanQR = () => {
  const [scannedData, setScannedData] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (scanning) {
      scannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
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
      // Send to backend
      const res = await axios.post('/api/checkins/scan', parsedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError('Invalid QR code or scan failed');
      setMessage('');
    }
  };

  const onScanError = (error) => {
    console.warn(`QR Code scan error: ${error}`);
  };

  const startScanning = () => {
    setScanning(true);
    setScannedData(null);
    setMessage('');
    setError('');
  };

  const stopScanning = () => {
    setScanning(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <QrCodeScanner sx={{ mr: 2, color: 'primary.main', fontSize: 40 }} />
        <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Scan QR Code
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Use your camera to scan visitor QR codes for check-in/check-out.
      </Typography>

      <Box sx={{ mt: 4 }}>
        {!scanning ? (
          <Card sx={{
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f5f5 0%, #e8f5e8 100%)',
            border: '2px dashed #1976d2',
          }}>
            <CameraAlt sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Ready to Scan
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Click the button below to start scanning QR codes
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={startScanning}
              startIcon={<QrCodeScanner />}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              }}
            >
              Start Scanning
            </Button>
          </Card>
        ) : (
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{
                p: 3,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                color: 'white',
                textAlign: 'center'
              }}>
                <Typography variant="h6" gutterBottom>
                  Scanning in Progress...
                </Typography>
                <Typography variant="body2">
                  Position the QR code within the camera frame
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <div id="qr-reader" style={{
                  width: '100%',
                  maxWidth: '400px',
                  margin: '0 auto',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}></div>
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={stopScanning}
                    sx={{ borderRadius: 2 }}
                  >
                    Stop Scanning
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      {scannedData && (
        <Card sx={{ mt: 3, borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircle sx={{ mr: 1, color: 'success.main' }} />
              <Typography variant="h6" gutterBottom>
                Scanned Data
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip label={`Visitor ID: ${scannedData.visitorId}`} color="primary" />
              {scannedData.bookId && <Chip label={`Book ID: ${scannedData.bookId}`} color="secondary" />}
            </Stack>
          </CardContent>
        </Card>
      )}

      {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default ScanQR;