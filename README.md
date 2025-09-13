# DimsToken IDO Platform

## Overview
DimsToken IDO is a comprehensive blockchain platform featuring an ERC-20 token (DimsToken - DIMS) with an Initial DEX Offering (IDO) system. The platform provides a modern, user-friendly interface for token purchases and wallet management, deployed on Ethereum Sepolia testnet.

### Deployed Contracts (Sepolia Testnet)
- **DimsToken Address**: `0x12988493e2b178B0E3279cE89d4b88CcB2878f61`
- **IDO Contract Address**: `0x8784672035EcF46E17DE2352292183517466d483`

## 🚀 Features

### Smart Contracts
- **DimsToken (DIMS)**: ERC-20 token built with OpenZeppelin contracts
  - Total Supply: 1,000,000,000 DIMS
  - 10% allocated to IDO (100,000,000 DIMS)
- **IDO Contract**: Secure token sale mechanism
  - Exchange Rate: 66,225,165 DIMS per ETH
  - Cap: 10 ETH
  - Duration: 7 days
  - Owner withdrawal functionality

### Frontend Application
- **Modern React/Next.js Interface**: Built with TypeScript and Tailwind CSS
- **Wallet Integration**: MetaMask connection with network validation
- **Real-time Balance Display**: User and IDO pool balances
- **Token Purchase Interface**: Intuitive ETH-to-DIMS conversion
- **Responsive Design**: Mobile-first approach with shadcn/ui components
- **Error Handling**: Comprehensive error states and user feedback

## 📁 Project Structure

```
dims/
├── contracts/                    # Solidity smart contracts
│   ├── DimsToken.sol            # ERC-20 token contract
│   └── IDO.sol                  # Initial DEX Offering contract
├── scripts/                     # Hardhat deployment scripts
│   ├── deploy.js               # Main deployment script
│   └── send-op-tx.ts           # Optimism transaction script
├── test/                       # Smart contract tests
│   └── Counter.ts              # Example test file
├── dims-token-ido/             # Next.js frontend application
│   ├── app/                    # Next.js 14 app directory
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main IDO page
│   ├── components/             # React components
│   │   ├── dims-token-app.tsx  # Main application component
│   │   ├── purchase-interface.tsx # Token purchase UI
│   │   ├── token-balance-card.tsx # Balance display
│   │   ├── wallet-connection.tsx  # Wallet connection UI
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   └── public/                 # Static assets
├── hardhat.config.js           # Hardhat configuration
├── package.json                # Root dependencies
└── README.md                   # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- MetaMask browser extension
- Sepolia ETH for testing

### Environment Variables
Create a `.env` file in the root directory:
```bash
SEPOLIA_RPC_URL=your_sepolia_rpc_url
PRIVATE_KEY=your_private_key
```

For the frontend, create a `.env.local` file in `dims-token-ido/`:
```bash
NEXT_PUBLIC_TOKEN_ADDRESS=0x12988493e2b178B0E3279cE89d4b88CcB2878f61
NEXT_PUBLIC_IDO_ADDRESS=0x8784672035EcF46E17DE2352292183517466d483
```

### Smart Contracts Setup
```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Deploy to Sepolia (optional - contracts already deployed)
npx hardhat run scripts/deploy.js --network sepolia
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd dims-token-ido

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev

# Build for production
npm run build
# or
pnpm build
```

## 🧪 Testing

### Smart Contract Tests
```bash
# Run all tests
npx hardhat test

# Run tests with coverage
npx hardhat coverage
```

### Frontend Testing
```bash
cd dims-token-ido

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🎯 Usage

### For Users
1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Switch Network**: Ensure you're on Sepolia testnet (Chain ID: 11155111)
3. **View Balances**: See your DIMS balance and available IDO pool
4. **Purchase Tokens**: Enter ETH amount (0.001 - 0.1 ETH) and click "Buy DIMS"
5. **Confirm Transaction**: Approve the transaction in MetaMask

### For Developers
- **Contract Interaction**: Use the deployed addresses with ethers.js
- **Custom Integration**: Import components from the frontend
- **Testing**: Use Sepolia testnet for safe testing

## 🔧 Technical Details

### Smart Contract Specifications
- **Solidity Version**: 0.8.30
- **OpenZeppelin**: 5.4.0
- **Token Standard**: ERC-20
- **Access Control**: Ownable pattern

### Frontend Stack
- **Framework**: Next.js 14.2.16
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: shadcn/ui with Radix UI
- **Web3**: ethers.js v6
- **State Management**: React hooks

### Network Configuration
- **Testnet**: Ethereum Sepolia
- **Chain ID**: 11155111
- **RPC**: Configurable via environment variables

## 🚀 Deployment

### Smart Contracts
Contracts are already deployed on Sepolia testnet. To redeploy:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Frontend
Deploy to Vercel, Netlify, or any static hosting service:
```bash
cd dims-token-ido
npm run build
# Deploy the 'out' directory
```

## 🔒 Security Considerations

- **Testnet Only**: This is deployed on Sepolia testnet for testing purposes
- **Private Keys**: Never commit private keys to version control
- **Contract Verification**: Verify contracts on Etherscan for transparency
- **Input Validation**: All user inputs are validated on both frontend and smart contracts

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the GitHub issues page
- Review the smart contract code
- Test on Sepolia testnet first

---

**⚠️ Disclaimer**: This is a testnet deployment for educational and testing purposes. Always verify contract addresses and test thoroughly before any mainnet deployment.
