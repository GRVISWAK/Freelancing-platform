import React, { useContext, useEffect, useState } from "react";
import { Container, TextField, Button, Typography, Box, CircularProgress, FormControlLabel, Checkbox, FormControl } from '@mui/material';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';
import Userservice from "../../services/Userservice";
import { Usercontext } from "../../Usercontext";

const ClientLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user,setUser]=useContext(Usercontext);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('All fields are required.');
      return;
    }
    try {
      setLoading(true);
      setTimeout(async () => {
        let response = await Userservice.checkclient(email,password);
        console.log(response);
        setLoading(false);
        if(response.data) {
          setUser({
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            password: response.data.password,
            role: 'client',
            walletAddress: response.data.walletAddress // ensure this is returned by backend
          });

          toast.success('Login Successful.', {autoClose: 500,});
          setTimeout(()=>{
            navigate("/cdashboard");
          },2000);
        } else {
          toast.error('Username or Password Incorrect.');
        }
      },2000);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error('An error occurred during account creation.');
    }

  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '200px' }}>
      <Box boxShadow={3} p={4} borderRadius={2} textAlign="center">
        <Typography variant="h4" gutterBottom>Login to FreelanceX</Typography>
        <FormControl fullWidth required>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            required
          />
          <FormControlLabel
            control={<Checkbox checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />}
            label="Remember Me"
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            
            onClick={handleSubmit}
            style={{ marginTop: '20px',backgroundColor:'#00d4f7' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Login'}
          </Button>
          <Typography variant="body2" align="center" style={{ marginTop: '20px' }}>
            Don’t have an account? <Link to="/signup" style={{ color: 'blue' }}>Sign up</Link>
          </Typography>
        </FormControl>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default ClientLogin;