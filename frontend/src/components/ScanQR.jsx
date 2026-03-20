import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Alert, Card, CardContent } from '@mui/material';
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
      <Typography variant="h4" gutterBottom>
        Scan QR Code
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Use your camera to scan visitor QR codes for check-in/check-out.
      </Typography>

      <Box sx={{ mt: 3 }}>
        {!scanning ? (
          <Button variant="contained" onClick={startScanning}>
            Start Scanning
          </Button>
        ) : (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Scanning...
              </Typography>
              <div id="qr-reader" style={{ width: '100%', maxWidth: '400px' }}></div>
              <Button variant="outlined" onClick={stopScanning} sx={{ mt: 2 }}>
                Stop Scanning
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>

      {scannedData && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Scanned Data
            </Typography>
            <Typography>Visitor ID: {scannedData.visitorId}</Typography>
            {scannedData.bookId && <Typography>Book ID: {scannedData.bookId}</Typography>}
          </CardContent>
        </Card>
      )}

      {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
};

export default ScanQR;