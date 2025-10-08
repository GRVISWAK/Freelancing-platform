import Web3 from 'web3';
import EscrowABI from './EscrowABI.json';
import EscrowFactoryABI from './EscrowFactoryABI.json';

let web3;
let account;
let escrowContract;
// Update to the latest deployed EscrowFactory contract address from your migration logs
const factoryAddress = "0xD9725521bb9A2bdBE3CFafA75Ef3e8616Dd2Ea83";
let escrowFactory;


// Utility to validate Ethereum addresses
export const isValidEthAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
};


// Initialize web3 and the deployer account (Ganache test account)
// IMPORTANT: Replace the privateKey value below with your Ganache account's private key (with 0x prefix)
export const initializeWeb3 = async () => {
    if (!web3) {
        web3 = new Web3("http://localhost:7545");
        // Replace with your Ganache test account private key
        const privateKey = "0x4d703ce9ebc7db86272d33aeddef303eb3c15546403ec41d066568427ec4867a"; // <-- PUT YOUR GANACHE PRIVATE KEY HERE
        account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = account.address;
    }
    return web3;
};


// Returns the deployer account (Ganache test account)
export const getDeployerAccount = () => {
    if (!account) throw new Error('Deployer account not initialized');
    return account;
};

export const initializeFactory = async () => {
    if (!web3) {
        await initializeWeb3();
    }
    if (!escrowFactory) {
        escrowFactory = new web3.eth.Contract(EscrowFactoryABI.abi, factoryAddress);
    }
    return escrowFactory;
};


// Helper to check if an address is present and valid
export const isPresentAndValidAddress = (address) => {
    return !!address && isValidEthAddress(address);
};


// Deploy escrow contract using addresses fetched from backend
// clientAddress and freelancerAddress should be fetched from backend and passed in
//
// NOTE: After contract creation, your frontend calls /project/updateEscrow on your backend.
// If you get a 404 error, you must add this endpoint to your Spring Boot backend.
// Example Java Spring Boot endpoint:
//
// @PostMapping("/project/updateEscrow")
// public ResponseEntity<?> updateEscrow(@RequestBody Map<String, Object> payload) {
//     // Extract projectId, escrowAddress, freelancerWallet from payload
//     // Update your project entity in the database
//     // return ResponseEntity.ok().build();
// }
export const createEscrowContract = async (clientAddress, freelancerAddress) => {
    await initializeFactory();
    if (!isPresentAndValidAddress(clientAddress)) {
        throw new Error("Client Ethereum address is missing or invalid for escrow deployment.");
    }
    if (!isPresentAndValidAddress(freelancerAddress)) {
        throw new Error("Freelancer Ethereum address is missing or invalid for escrow deployment.");
    }
    const deployer = getDeployerAccount();
    // Log all addresses for debugging
    console.log('EscrowFactory address:', factoryAddress);
    console.log('Deployer address (from):', deployer.address);
    console.log('Client address:', clientAddress);
    console.log('Freelancer address:', freelancerAddress);
    // This will use the deployer Ganache account to deploy the contract, but the contract will store the client and freelancer addresses you pass in
    const tx = await escrowFactory.methods.createEscrow(clientAddress, freelancerAddress)
        .send({ from: deployer.address, gas: 3000000 });
    return tx.events.EscrowCreated.returnValues.escrowAddress;
};



export const getEscrowInstance = (address) => {
    if (!web3) throw new Error('Web3 not initialized');
    if (!isPresentAndValidAddress(address)) {
        throw new Error('Escrow contract address is missing or invalid. You must deploy the contract and save its address before calling contract methods.');
    }
    return new web3.eth.Contract(EscrowABI.abi, address);
};



export const getClientAddress = async (escrowAddress) => {
    if (!isPresentAndValidAddress(escrowAddress)) {
        throw new Error('Cannot fetch client address: escrow contract address is missing or invalid. Deploy the contract first.');
    }
    const contract = getEscrowInstance(escrowAddress);
    return await contract.methods.client().call();
};

export const getFreelancerAddress = async (escrowAddress) => {
    if (!isPresentAndValidAddress(escrowAddress)) {
        throw new Error('Cannot fetch freelancer address: escrow contract address is missing or invalid. Deploy the contract first.');
    }
    const contract = getEscrowInstance(escrowAddress);
    return await contract.methods.freelancer().call();
};

// Example
export const completeWork = async (escrowAddress, fromAddress) => {
    const contract = getEscrowInstance(escrowAddress);
    await contract.methods.completeWork().send({ from: fromAddress });
};

export const releaseFunds = async (escrowAddress, fromAddress) => {
    const contract = getEscrowInstance(escrowAddress);
    await contract.methods.releaseFunds().send({ from: fromAddress });
};

export const depositFunds = async (escrowAddress, fromAddress, amount) => {
    const contract = getEscrowInstance(escrowAddress);
    await contract.methods.deposit().send({ from: fromAddress, value: web3.utils.toWei(amount.toString(), "ether") });
};

export const getContractBalance = async (escrowAddress) => {
    const contract = getEscrowInstance(escrowAddress);
    const balance = await contract.methods.getContractBalance().call();
    return web3.utils.fromWei(balance, "ether");
};

export { escrowFactory, web3 };