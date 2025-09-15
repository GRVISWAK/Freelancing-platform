// // FreelancerSignup.js
// import React, { useState } from 'react';
// import './Signup.css'
// import { ToastContainer, toast } from 'react-toastify';
// import Userservice from '../../services/Userservice';
// import { useNavigate,Link } from 'react-router-dom';
// const FreelancerSignup = () => {
//   const navigate=useNavigate();
//   const [user, setUser] = useState({
//     name: '',
//     email: '',
//     password: '',
//     skills: '',
//     portfoliourl: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUser({ ...user, [name]: value });
//   };

//   const handleSubmit = async(e) => {
//     e.preventDefault();
//     console.log('Freelancer Data:', user);

//     try{
//       let response=await Userservice.newuser(user);
//       console.log(response);
//       if(response.data){
//         console.log("Successful");
//         toast.success('Account created successfully! Please Login to your account.',{
//           autoClose:500
//         });
//         navigate("/Login")
//       }
//       else{
//         console.log("Failed");
//       }
//     }catch(error){
//       console.log(error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="signup-form">
//       <h3>Freelancer Signup</h3>
//       <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
//       <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//       <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//       <input type="text" name="skills" placeholder="Skills (e.g., Web Design, Writing)" onChange={handleChange} />
//       <input type="url" name="portfoliourl" placeholder="Portfolio URL" onChange={handleChange} />
//       {/* <input type="number" name="hourlyRate" placeholder="Hourly Rate" onChange={handleChange} /> */}
//       <button type="submit" className="submit-button">Sign Up as Freelancer</button>
//       <ToastContainer />
//     </form>
//   );
// };

// export default FreelancerSignup;


// FreelancerSignup.js
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Stack, FormControl } from '@mui/material';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import Userservice from '../../services/Userservice';
import { useNavigate, Link } from 'react-router-dom';

const FreelancerSignup = () => {
  const navigate = useNavigate();
  const [isValid, setValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    skills: '',
    portfoliourl: '',
    walletAddress: '', // changed from wallet
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Map 'wallet' input to 'walletAddress' in state
    setUser({ ...user, [name === 'wallet' ? 'walletAddress' : name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.password || !user.skills || !user.portfoliourl || !user.walletAddress) {
      toast.warn('All fields are required.');
      setValid(false);
      return;
    }
    try {
      setLoading(true);
      setTimeout(async () => {
        let response = await Userservice.newuser(user);
        console.log(response);
        setLoading(false);
        if(response.data) {
          toast.success('Account created successfully! Please login to your account.', {autoClose: 500,});
          setTimeout(()=>{
            navigate("/login");
          },2000);
        }
        else
          toast.error('User with same email already exists.');
      },2000);
    } catch (error) {
      console.log(error);
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
      <Container maxWidth="sm" style={{ marginTop: '100px' }}>
        <FormControl fullWidth required>
          <Box p={4} boxShadow={3} borderRadius={2}>
            <Typography variant="h4" gutterBottom>Freelancer Signup</Typography>
            <TextField
              required
              fullWidth
              label="Name"
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
              fullWidth
              label="Skills (e.g., Web Design, Writing)"
              name="skills"
              value={user.skills}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Portfolio URL"
              name="portfoliourl"
              type="url"
              value={user.portfoliourl}
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
              variant='contained'
              onClick={handleSubmit}
              style={{ marginTop: '40px',backgroundColor:'#00d4f7' }}
            >
              {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Sign Up as Freelancer'}
            </Button>
            <Stack direction="row" justifyContent="end" gap="10px" margin={'20px'}>
              <Typography>Already have an account?</Typography>
              <Link to='/login'><Typography color={'blue'}>Login</Typography></Link>
            </Stack>
          </Box>
        </FormControl>
        <ToastContainer />
      </Container>
    </motion.div>
  );
};

export default FreelancerSignup;
