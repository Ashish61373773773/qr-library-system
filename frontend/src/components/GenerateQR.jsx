import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Grid, Alert } from '@mui/material';
import { QrCode as QrCodeIcon, Download } from '@mui/icons-material';
import QRCode from 'qrcode.react';

const GenerateQR = () => {
  const [visitorId, setVisitorId] = useState('');
  const [bookId, setBookId] = useState('');
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState('');

  const generateQR = () => {
    if (!visitorId.trim()) {
      setError('Please enter a Visitor ID');
      return;
    }

    setError('');
    setGenerated(true);
  };

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code-canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `qr-${visitorId}${bookId ? `-${bookId}` : ''}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const resetForm = () => {
    setVisitorId('');
    setBookId('');
    setGenerated(false);
    setError('');
  };

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
          🎯 Generate QR Code
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom sx={{
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          Create QR codes for visitor check-in and book borrowing.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            },
          }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <QrCodeIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  QR Code Generator
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Visitor ID"
                value={visitorId}
                onChange={(e) => setVisitorId(e.target.value)}
                margin="normal"
                required
                placeholder="e.g., V001, V002"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Book ID (Optional)"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                margin="normal"
                placeholder="e.g., B001, B002"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={generateQR}
                  disabled={!visitorId.trim()}
                  className="button-hover"
                  sx={{
                    flex: 1,
                    borderRadius: 3,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                  }}
                >
                  Generate QR
                </Button>

                {generated && (
                  <Button
                    variant="outlined"
                    onClick={resetForm}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      fontWeight: 'bold',
                    }}
                  >
                    Reset
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {generated ? (
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
              },
            }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'success.main', fontWeight: 'bold' }}>
                  ✅ QR Code Generated
                </Typography>

                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 3,
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #e8f5e8 100%)',
                  border: '2px solid #4caf50',
                }}>
                  <QRCode
                    id="qr-code-canvas"
                    value={JSON.stringify({ visitorId: visitorId.trim(), bookId: bookId.trim() || null })}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Visitor ID: <strong>{visitorId}</strong>
                  {bookId && <> | Book ID: <strong>{bookId}</strong></>}
                </Typography>

                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  <Typography variant="body2">
                    <strong>Self Check-in URL:</strong> Visitors can scan their QR code at:<br/>
                    <code style={{background: '#f5f5f5', padding: '2px 4px', borderRadius: '2px'}}>
                      {window.location.origin}/checkin
                    </code>
                  </Typography>
                </Alert>

                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={downloadQR}
                  className="button-hover"
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    px: 4,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #388e3c 30%, #4caf50 90%)',
                    boxShadow: '0 4px 15px rgba(56, 142, 60, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2e7d32 30%, #388e3c 90%)',
                    },
                  }}
                >
                  Download QR Code
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              border: '2px dashed #dee2e6',
            }}>
              <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                <QrCodeIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" gutterBottom>
                  QR Code Preview
                </Typography>
                <Typography variant="body2">
                  Enter visitor details and click "Generate QR" to create your code
                </Typography>
              </Box>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default GenerateQR;