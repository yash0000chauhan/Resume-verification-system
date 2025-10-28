import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  contract: ethers.Contract | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

// Contract ABI - This should match your Main.sol contract
const CONTRACT_ABI = [
  "function setStudent(string memory u, string memory n, string memory cer, string memory ceri, string memory coll) public returns (bool)",
  "function getStudent(address ins) view public returns (string memory, string memory, string memory, string memory, string memory, uint)",
  "function getVerifyedBy(address ins) view public returns (uint, address, address, address)",
  "function getStudentAddress() view public returns (address[] memory)",
  "function setTeacher(string memory n, string memory i, string memory d, string memory dom) public returns (bool)",
  "function getTeacherAddress() view public returns (address[] memory)",
  "function getTeacher(address ins) view public returns (string memory, string memory, string memory, string memory)",
  "function verify(address studAdd, string memory certHash) payable public returns(string memory)",
  "event Check(address indexed _from, address indexed _to, string certId, uint count, address[3] verify)"
];

// Contract address - Update this with your deployed contract address
const CONTRACT_ADDRESS = "0xd128acef7758f3619a04f11f120a8fc5bed746c17f58750a31bcdfc7a07576a4"; // Replace with actual address

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        
        setProvider(web3Provider);
        setSigner(web3Signer);
        setAccount(accounts[0]);
        setIsConnected(true);

        // Initialize contract
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Signer);
        setContract(contractInstance);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            disconnectWallet();
          } else {
            setAccount(accounts[0]);
          }
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      } else {
        alert('Please install MetaMask to use this application');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setIsConnected(false);
    setContract(null);
  };

  // Check if already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });

          if (accounts.length > 0) {
            const web3Provider = new ethers.BrowserProvider(window.ethereum);
            const web3Signer = await web3Provider.getSigner();
            
            setProvider(web3Provider);
            setSigner(web3Signer);
            setAccount(accounts[0]);
            setIsConnected(true);

            // Initialize contract
            const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Signer);
            setContract(contractInstance);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  const value: Web3ContextType = {
    provider,
    signer,
    account,
    isConnected,
    isLoading,
    connectWallet,
    disconnectWallet,
    contract,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
