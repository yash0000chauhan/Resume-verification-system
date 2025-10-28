import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, LogOut, User, Shield } from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';

const Header: React.FC = () => {
  const { isConnected, account, connectWallet, disconnectWallet, isLoading } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CertiChain</h1>
              <p className="text-sm text-gray-600">Blockchain Certificate Verification</p>
            </div>
          </motion.div>

          {/* Wallet Connection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Connected</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg border border-gray-200">
                  <User size={16} />
                  <span className="text-sm font-mono">{formatAddress(account!)}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wallet size={18} />
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
