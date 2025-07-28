import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Box, Snackbar, Alert, Typography, CircularProgress } from '@mui/material';
import BulkImport from './components/BulkImport';
import SingleCard from './components/SingleCard';

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // লোডিং স্টেট যোগ করা হয়েছে
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'info' 
  });

  // অ্যাপ লোড হওয়ার পর লোডিং স্টেট বন্ধ করুন
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // লোডিং স্টেট থাকলে লোডিং স্পিনার দেখান
  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        স্কুল আইডি কার্ড জেনারেটর
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 3 }}>
        <Tab label="একক কার্ড" />
        <Tab label="বাল্ক জেনারেট" />
      </Tabs>
      
      <Box>
        {tabValue === 0 ? (
          <SingleCard />
        ) : (
          <BulkImport 
            setSnackbar={setSnackbar}
          />
        )}
      </Box>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;