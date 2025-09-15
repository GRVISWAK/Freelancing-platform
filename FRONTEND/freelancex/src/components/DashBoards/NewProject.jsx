import React, { useContext, useState ,useEffect } from 'react';
// import { createEscrowContract } from './Web3Config';
import './NewProject.css';
import { Button, CircularProgress } from '@mui/material';
import { Usercontext } from '../../Usercontext';
import { ToastContainer,toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Userservice from '../../services/Userservice';
const NewProject = ({ onSubmit }) => {
  const[valid,setValid]=useState(false);
  const[loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const [user, setUser] = useContext(Usercontext);
const [project, setProject] = useState({
  clientId: user.id,     
  title: '',
  description: '',
  minBudget: 0,                 
  maxBudget: 0,
  status: 'Open',                
  category: '',
  deadline: '',                  
  skillsRequired: '',           
  escrowAddress: '', // new field
  escrowAmount: 0,              
  currency: 'USD'                
});
useEffect(() => {
  if (user?.id) {
    setProject((prevProject) => ({
      ...prevProject,
      clientId: user.id,
    }));
  }
}, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project.title || !project.description || !project.minBudget || !project.maxBudget || !project.category ||!project.deadline ||!project.skillsRequired || !project.escrowAmount || !project.currency) {
      toast.warn('All fields are required.');
      setValid(false);
      return;
    }
    try {
      setLoading(true);
      // Debug: print user object
      console.log('user:', user);
      if (!user.walletAddress) {
        toast.error('Wallet address is missing. Please log in again.');
        setLoading(false);
        return;
      }
      // Only send project data, escrow contract will be deployed after proposal acceptance
      const projectWithClient = {
        ...project,
        escrowAddress: '',
        clientWallet: user.walletAddress, // camelCase for backend setter
        freelancerWallet: null // camelCase for backend setter
      };
      console.log('Client wallet address:', user.walletAddress);
      console.log('projectWithClient:', projectWithClient);
      let response = await Userservice.newproject(projectWithClient);
      setLoading(false);
      if(response.data) {
        toast.success('Project / Job posted successfully!', {autoClose: 500,});
        setTimeout(()=>{
          navigate("/cdashboard");
        },2000);
      } else {
        toast.error('Error.');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error('An error occurred during project creation.');
    }
  };

  return (
    <>
    <form >
      <h1 style={{ textAlign: 'center', padding: '10px' }}>New Project</h1>

      <div>
        <label>Project Title</label>
        <input
          type="text"
          name="title"
          value={project.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={project.description}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label>Minimum Budget</label>
        <input
          type="number"
        name="minBudget"
        value={project.minBudget}
        onChange={handleChange}
          step="0.01"
          required
        />
      </div>
      
      <div>
        <label>Maximum Budget</label>
        <input
          type="number"
        name="maxBudget"
        value={project.maxBudget}
        onChange={handleChange}
          step="0.01"
          required
        />
      </div>

      <div>
        <label>Status</label>
        <select name="status" value={project.status} onChange={handleChange} required>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div>
        <label>Category</label>
        <input
          type="text"
          name="category"
          value={project.category}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Deadline</label>
        <input
          type="date"
          name="deadline"
          value={project.deadline}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Skills Required</label>
        <input
          type="text"
        name="skillsRequired"
        value={project.skillsRequired}
        onChange={handleChange}
          placeholder="e.g., React, Node.js, Python"
        />
      </div>

      <div>
        <label>Escrow Amount</label>
        <input
          type="number"
        name="escrowAmount"
        value={project.escrowAmount}
        onChange={handleChange}
          step="0.01"
          required
        />
      </div>

      <div>
        <label>Currency</label>
        <input
          type="text"
          name="currency"
          value={project.currency}
          onChange={handleChange}
          placeholder="e.g., USD, EUR"
          required
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <Button type="submit" variant='contained' color='success' onClick={handleSubmit} disabled={loading}> {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> :'Submit' }</Button>
        <Button type="button" variant='contained' color='error'>Cancel</Button>
      </div>
    </form>
    <ToastContainer/>
    </>
  );
};

export default NewProject;
