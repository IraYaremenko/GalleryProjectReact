import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { TextField, Button, Typography, Container, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth } from '../firebase';

const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleAuth = () => {
    if (isRegistering) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log('Registered:', userCredential.user);
          navigate('/upload'); // Redirect to /upload
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log('Signed in:', userCredential.user);
          navigate('/upload'); // Redirect to /upload
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography component="h1" variant="h5">
          {isRegistering ? 'Register' : 'Login'}
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleAuth}
          >
            {isRegistering ? 'Register' : 'Login'}
          </Button>
          <Button
            fullWidth
            variant="text"
            color="secondary"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Switch to Login' : 'Switch to Register'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth;
