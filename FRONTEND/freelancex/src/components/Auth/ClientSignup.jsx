import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Stack, FormControl, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Userservice from '../../services/Userservice';
import { useNavigate, Link } from 'react-router-dom';

const ClientSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    companyname: '',
    walletAddress: '', // changed from wallet
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Map 'wallet' input to 'walletAddress' in state
    setUser({ ...user, [name === 'wallet' ? 'walletAddress' : name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields are filled
    if (!user.name || !user.email || !user.password || !user.companyname || !user.walletAddress) {
      toast.warn('All fields are required.');
      return;
    }

    try {
      setLoading(true);

      setTimeout(async () => {
        const response = await Userservice.newclient(user);
        setLoading(false);

        if (response.data) {
          toast.success('Account created successfully! Please login to your account.', { autoClose: 500 });
          setTimeout(() => navigate("/login"), 2000);
        } else {
          toast.error('User with the same email already exists.');
        }
      }, 2000);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error('An error occurred during account creation.');
    }
  };

  return (
    <motion.div
      className="signup-page"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <Container maxWidth="sm" sx={{ mt: 10 ,marginTop:'100px'}}>
        <FormControl fullWidth required>
          <Box p={4} boxShadow={3} borderRadius={2}>
            <Typography variant="h4" gutterBottom>
              Client Signup
            </Typography>
            <TextField
              required
              fullWidth
              label="Full Name"
              name="name"
              value={user.name}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              required
              fullWidth
              label="Company Name"
              name="companyname"
              value={user.companyname}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />

            <TextField
              required
              fullWidth
              label="Wallet Address"
              name="wallet"
              value={user.walletAddress}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              style={{ marginTop: '40px' ,backgroundColor:'#00d4f7'}}
            >
              {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Sign Up as Client'}
            </Button>
            <Stack direction="row" justifyContent="end" gap="10px" margin="20px">
              <Typography>Already have an account?</Typography>
              <Link to="/login"><Typography color="blue">Login</Typography></Link>
            </Stack>
          </Box>
        </FormControl>
        <ToastContainer />
      </Container>
    </motion.div>
  );
};

export default ClientSignup;
