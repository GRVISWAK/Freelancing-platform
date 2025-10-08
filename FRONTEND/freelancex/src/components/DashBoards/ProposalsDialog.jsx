import React, { useState, useEffect } from 'react';
import './ProposalsDialog.css';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { initializeWeb3, getClientAddress, getFreelancerAddress, createEscrowContract, isValidEthAddress, completeWork, releaseFunds, depositFunds, getContractBalance } from './Web3Config';
import Userservice from '../../services/Userservice';


const ProposalsDialog = ({ projectId, open, onClose }) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  const [clientAddress, setClientAddress] = useState('');
   const [freelancerAddress, setFreelancerAddress] = useState('');


   // Removed fetchAddresses useEffect: do not fetch contract addresses before contract is deployed

  useEffect(() => {
    if (open) {
      fetchProposals();
    }
  }, [open]);
  const handleDeposit = async () => {
    setIsLoading(true);
    setStatus('Depositing funds...');
    try {
       await depositFunds(clientAddress, '1'); // Example of 1 Ether deposit
       setStatus('Funds deposited');
       const updatedBalance = await getContractBalance();
       setBalance(updatedBalance);
    } catch (error) {
       console.error('Error depositing funds:', error);
       setStatus('Failed to deposit funds');
    }
    setIsLoading(false);
 };

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/request/projects/${projectId}/proposals`);
      const data = response.data;

      // Check if proposals are empty or contain only null fields
      if (data.length === 0 || data.every(proposal => !proposal.skills && !proposal.portfolioUrl)) {
        setMessage("No proposals available for this project.");
        setProposals([]);
      } else {
        setMessage("");
        setProposals(data);
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
      setMessage("Failed to load proposals.");
    }
    setLoading(false);
  };

  // Accept proposal: deploy escrow contract and update backend
  const handleAccept = async (freelancerId) => {
    try {
      // Fetch freelancer wallet address from backend
      const freelancerRes = await axios.get(`http://localhost:8080/freelancer/getWalletAddress`, { params: { freelancerId } });
      const freelancerWallet = freelancerRes.data.walletAddress;

      // Fetch client wallet address from backend (project details)
      const projectRes = await axios.get(`http://localhost:8080/project/getProjectDetails`, { params: { projectId } });
      // Try both camelCase and snake_case for compatibility
      const clientWallet = projectRes.data.clientWallet || projectRes.data.client_wallet;

      // Debug log the addresses
      console.log('clientWallet:', clientWallet, 'freelancerWallet:', freelancerWallet);

      if (!isValidEthAddress(clientWallet) || !isValidEthAddress(freelancerWallet)) {
        alert(`Invalid client or freelancer wallet address.\nclientWallet: ${clientWallet}\nfreelancerWallet: ${freelancerWallet}`);
        return;
      }
      // Deploy escrow contract directly using Ganache account
      await initializeWeb3();
      const escrowAddress = await createEscrowContract(clientWallet, freelancerWallet);

      // Update backend with escrow address and freelancer info
      await axios.post('http://localhost:8080/project/assignFreelancer', {
        projectId,
        freelancerId,
        freelancerWallet,
        escrowAddress
      });
      
      alert(`Proposal accepted and escrow contract deployed! Escrow: ${escrowAddress}`);
      fetchProposals();
    } catch (error) {
      console.error('Error accepting proposal:', error);
      alert('Failed to accept proposal or deploy escrow.');
    }
  };

  const handleReject = async (proposalId) => {
    try {
      // Send a request to reject the proposal
      // await axios.post(`http://localhost:8080/request/proposals/${proposalId}/reject`);
      alert("Proposal rejected successfully!");
      fetchProposals(); // Refresh the proposals list
    } catch (error) {
      console.error("Error rejecting proposal:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Proposals for Project {projectId}</DialogTitle>
      <DialogContent>
        {loading ? (
          <p>Loading...</p>
        ) : message ? (
          <p>{message}</p>
        ) : (
          proposals.map((proposal, index) => (
            <div key={index} className="proposal">
              <p><strong>Freelancer Name:</strong> {proposal.freelancer_name || "N/A"}</p>
              <p><strong>Skills:</strong> {proposal.skills || "No skills provided"}</p>
              <p>
                <strong>Portfolio:</strong> 
                {proposal.portfolioUrl ? (
                  <a href={proposal.portfolioUrl} target="_blank" rel="noopener noreferrer">View Portfolio</a>
                ) : (
                  "No portfolio available"
                )}
              </p>
              <div className="proposal-actions">
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleAccept(proposal.freelancer_id)}
                >
                  Accept
                </Button>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={() => handleReject(proposal.freelancer_id)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProposalsDialog;
