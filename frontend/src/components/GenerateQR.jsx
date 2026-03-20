import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Grid } from '@mui/material';
import QRCode from 'qrcode.react';
import axios from 'axios';

const GenerateQR = () => {
  const [visitorId, setVisitorId] = useState('');
  const [bookId, setBookId] = useState('');
  const [qrCode, setQrCode] = useState('');

  const generateQR = async () => {
    if (!visitorId) return;

    try {
      const res = await axios.post('/api/checkins/generate-qr', { visitorId, bookId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setQrCode(res.data.qrCode);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Generate QR Code
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Create QR codes for visitors and books.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generate QR Code
              </Typography>
              <TextField
                fullWidth
                label="Visitor ID"
                value={visitorId}
                onChange={(e) => setVisitorId(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Book ID (Optional)"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                margin="normal"
              />
              <Button
                variant="contained"
                onClick={generateQR}
                sx={{ mt: 2 }}
                disabled={!visitorId}
              >
                Generate QR Code
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          {qrCode && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Generated QR Code
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <QRCode value={JSON.stringify({ visitorId, bookId })} size={256} />
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default GenerateQR;