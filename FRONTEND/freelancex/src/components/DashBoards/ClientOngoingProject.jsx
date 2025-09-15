import { Button } from '@mui/material';
import { initializeWeb3, completeWork, releaseFunds, depositFunds, getContractBalance } from './Web3Config';
import React, { useState, useEffect } from 'react';

const ClientOngoingProject = ({ project }) => {
  const [status, setStatus] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  const [depositAmount, setDepositAmount] = useState('');

  // Always use addresses from project prop, try both camelCase and snake_case for compatibility
  const escrowAddress = project.escrowAddress || project.escrow_address;
  const clientAddress = project.clientWallet || project.client_wallet;
  const freelancerAddress = project.freelancerWallet || project.freelancer_wallet;

  useEffect(() => {
    async function fetchBalance() {
      try {
        setStatus('Fetching contract balance...');
        await initializeWeb3();
        const bal = await getContractBalance(escrowAddress);
        setBalance(bal);
        setStatus('Balance loaded');
      } catch (error) {
        console.error('Error fetching balance:', error);
        setStatus('Failed to load balance');
      }
    }
    if (escrowAddress) fetchBalance();
  }, [escrowAddress]);

  const handleCompleteWork = async () => {
    setIsLoading(true);
    setStatus('Completing work...');
    try {
      await completeWork(escrowAddress, clientAddress);
      setStatus('Work completed');
    } catch (error) {
      console.error('Error completing work:', error);
      setStatus('Failed to complete work');
    }
    setIsLoading(false);
  };

  const handleReleaseFunds = async () => {
    if (!freelancerAddress) {
      alert('No freelancer assigned yet. Cannot release funds.');
      return;
    }
    try {
      await releaseFunds(escrowAddress, clientAddress);
      alert(`Funds released successfully to ${freelancerAddress}`);
    } catch (error) {
      console.error('Failed to release funds', error);
      setStatus('Failed to release funds');
    }
    const bal = await getContractBalance(escrowAddress);
    setBalance(bal);
  };

  const handleDepositFunds = async () => {
    try {
      await depositFunds(escrowAddress, clientAddress, depositAmount);
      alert(`Deposited ${depositAmount} ETH to contract!`);
      const bal = await getContractBalance(escrowAddress);
      setBalance(bal);
    } catch (error) {
      alert('Deposit failed: ' + error.message);
      setStatus('Deposit failed');
    }
  };

  return (
    <div className="main">
      <div className="project-card">
        <h3>{project.title}</h3>
        <p><strong>Description:</strong> {project.description}</p>
        <p><strong>Budget:</strong> {project.currency} {project.min_budget} - {project.max_budget}</p>
        <p><strong>Category:</strong> {project.category}</p>
        <p><strong>Deadline:</strong> {project.deadline}</p>
        <div style={{ margin: '10px 0' }}>
          <input
            type="number"
            min="0"
            step="any"
            placeholder="Amount in ETH"
            value={depositAmount}
            onChange={e => setDepositAmount(e.target.value)}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <Button color='secondary' variant='contained' onClick={handleDepositFunds} disabled={!depositAmount}>
            Deposit Funds
          </Button>
        </div>
        <Button color='primary' variant='contained' onClick={handleReleaseFunds} style={{marginTop:'10px'}} disabled={!freelancerAddress}>
          Release Funds
        </Button>
        {!freelancerAddress && (
          <div style={{color:'red',marginTop:'10px'}}>No freelancer assigned yet.</div>
        )}
        {freelancerAddress && (
          <div style={{color:'green',marginTop:'10px'}}>Freelancer assigned: {freelancerAddress}</div>
        )}
        <div style={{marginTop:'10px'}}>Contract Balance: {balance} ETH</div>
        <div style={{marginTop:'10px', color: 'gray', fontSize: '0.9em'}}>{status}</div>
      </div>
    </div>
  )
}
export default ClientOngoingProject;