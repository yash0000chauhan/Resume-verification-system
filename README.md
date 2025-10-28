# CertiChain - Blockchain Certificate Verification System

A modern, decentralized platform for secure certificate verification using blockchain technology. Built with React, TypeScript, Tailwind CSS, and Ethereum smart contracts.

## 🚀 Features

### Core Functionality
- **Student Registration**: Students can register their certificates on the blockchain
- **Teacher Registration**: Teachers join the verification network
- **Certificate Verification**: Multi-teacher verification system (3 verifications required)
- **Real-time Dashboard**: Monitor system statistics and activities
- **Secure Storage**: All data stored permanently on the blockchain

### Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Modern Animations**: Smooth transitions with Framer Motion
- **Glass Morphism**: Beautiful glass-effect components
- **Dark/Light Theme**: Adaptive color schemes
- **Interactive Components**: Radix UI components for accessibility

### Technical Features
- **Web3 Integration**: MetaMask wallet connection
- **Smart Contract Interaction**: Direct blockchain communication
- **Real-time Updates**: Live verification status
- **Error Handling**: Comprehensive error management
- **TypeScript**: Full type safety

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Radix UI** for accessible components
- **Lucide React** for icons
- **TanStack Query** for state management

### Blockchain
- **Ethereum** smart contracts
- **Truffle** for development framework
- **Web3.js** and **Ethers.js** for blockchain interaction
- **MetaMask** for wallet integration

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- Truffle (for smart contract development)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Final_Year_Project-master
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend
   npm install
   ```

3. **Configure MetaMask**
   - Install MetaMask browser extension
   - Connect to your preferred network (local, testnet, or mainnet)
   - Ensure you have test ETH for transactions

4. **Deploy Smart Contracts** (if needed)
   ```bash
   # Compile contracts
   npm run compile
   
   # Deploy to network
   npm run migrate
   ```

5. **Update Contract Address**
   - Update the `CONTRACT_ADDRESS` in `frontend/src/contexts/Web3Context.tsx`
   - Use the deployed contract address from Truffle

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🎯 Usage

### For Students
1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Register Certificate**: 
   - Go to "Student Registration" tab
   - Fill in your details (USN, Name, Certificate ID, etc.)
   - Submit transaction
3. **Track Verification**: Monitor verification progress in the dashboard

### For Teachers
1. **Connect Wallet**: Connect your MetaMask wallet
2. **Register as Teacher**:
   - Go to "Teacher Registration" tab
   - Fill in your credentials (Name, ID, Position, Domain)
   - Submit transaction
3. **Verify Certificates**:
   - Go to "Verify Certificate" tab
   - Search for student by wallet address
   - Enter certificate hash and verify

### Verification Process
1. Student registers certificate
2. Teachers verify the certificate (3 verifications required)
3. Once verified by 3 teachers, certificate is fully authenticated
4. All verification activities are recorded on blockchain

## 🏗️ Project Structure

```
├── contracts/                 # Smart contracts
│   ├── Main.sol              # Main contract
│   └── Migrations.sol        # Migration contract
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── package.json         # Frontend dependencies
│   └── tailwind.config.js   # Tailwind configuration
├── migrations/              # Contract migrations
├── test/                    # Contract tests
├── package.json            # Root dependencies
└── truffle-config.js      # Truffle configuration
```

## 🔧 Configuration

### Smart Contract Configuration
- Update `truffle-config.js` for your network settings
- Configure gas limits and network parameters
- Set up HD wallet provider for deployment

### Frontend Configuration
- Update contract address in `Web3Context.tsx`
- Configure RPC endpoints for different networks
- Customize UI themes in `tailwind.config.js`

## 🚀 Deployment

### Smart Contracts
```bash
# Deploy to testnet
truffle migrate --network testnet

# Deploy to mainnet
truffle migrate --network mainnet
```

### Frontend
```bash
# Build for production
npm run build

# Deploy to your preferred hosting service
# (Vercel, Netlify, AWS, etc.)
```

## 🔒 Security Features

- **Multi-signature Verification**: Requires 3 teacher approvals
- **Immutable Records**: All data stored on blockchain
- **Address Validation**: Prevents duplicate registrations
- **Hash Verification**: Certificate hash validation
- **Access Control**: Role-based permissions

## 🐛 Troubleshooting

### Common Issues

1. **MetaMask Connection Issues**
   - Ensure MetaMask is installed and unlocked
   - Check network configuration
   - Clear browser cache and reload

2. **Transaction Failures**
   - Check gas limits
   - Ensure sufficient ETH balance
   - Verify contract address

3. **Contract Not Found**
   - Update contract address in Web3Context
   - Ensure contracts are deployed
   - Check network compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Ethereum Foundation for blockchain technology
- React team for the amazing framework
- Tailwind CSS for utility-first styling
- All open-source contributors

---

**Note**: This is a demonstration project. For production use, ensure proper security audits and testing.