import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Paper, Typography, Link } from '@mui/material';

const AuthLayout: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="sm" sx={{ my: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            BandMate
          </Typography>
          <Typography variant="h5">
            Rehearsal Scheduler
          </Typography>
        </Box>
        
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Outlet />
        </Paper>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} BandMate. All rights reserved.
          </Typography>
          <Typography variant="body2">
            <Link component={RouterLink} to="/privacy" color="primary">
              Privacy Policy
            </Link>
            {' • '}
            <Link component={RouterLink} to="/terms" color="primary">
              Terms of Service
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;