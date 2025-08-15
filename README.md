# 🚀 Ezpay - Mantle L2 Payment dApp

A modern Web3 payment system built on Mantle Layer 2 blockchain that allows users to create and receive payments through QR codes with gasless transactions support.

## 🌟 Features

- **🔗 Payment Links**: Create shareable payment links with QR codes
- **⚡ Gasless Payments**: EIP-7702 support for sponsor-paid transactions
- **📱 Multi-Platform**: Web app, mobile app, and shared UI components
- **🔒 Secure**: Smart contract-based with comprehensive testing
- **💰 Low Fees**: Built on Mantle L2 for minimal transaction costs
- **🌐 Cross-Chain Ready**: Designed for multi-network support

## 🏗️ Project Structure

```
Ezpay/
├── contract/                 # Smart contracts (Hardhat)
│   ├── contracts/           # Solidity contracts
│   ├── scripts/            # Deployment & testing scripts
│   ├── test/               # Contract tests
│   └── hardhat.config.js   # Hardhat configuration
├── frontend/               # Frontend applications
│   ├── mobile/            # React Native mobile app
│   ├── ui/                # Shared UI component library
│   └── web/               # Next.js web application
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
└── package.json          # Workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- Wallet with Mantle Sepolia testnet ETH

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd Ezpay
cp .env.example .env
# Edit .env with your configuration
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
npm run install:all
```

### 3. Configure Environment

Edit `.env` file with your settings:

```bash
# Required: Your private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Required: WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Optional: API keys for enhanced features
MANTLESCAN_API_KEY=your_api_key
```

### 4. Run Applications

```bash
# Start web app (development)
npm run dev:web

# Start mobile app (development)
npm run dev:mobile

# Build UI components
npm run build:ui
```

## 📋 Environment Variables Guide

### 🔐 Critical Variables (Required)

| Variable | Description | Example |
|----------|-------------|---------|
| `PRIVATE_KEY` | Deployment private key (NO 0x prefix) | `abcd1234...` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | `a1b2c3d4...` |

### 🌐 Network Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `MANTLE_SEPOLIA_RPC_URL` | Mantle Sepolia RPC endpoint | `https://rpc.sepolia.mantle.xyz` |
| `NEXT_PUBLIC_CHAIN_ID` | Target chain ID | `5003` |
| `EZPAY_CONTRACT_ADDRESS` | Deployed contract address | `0x9A2478962cC59f0A606D536937883cE5845eA400` |

### 🔍 Optional Services

| Variable | Description | Purpose |
|----------|-------------|---------|
| `MANTLESCAN_API_KEY` | Mantle explorer API key | Contract verification |
| `ALCHEMY_API_KEY` | Alchemy API key | Alternative RPC provider |
| `INFURA_API_KEY` | Infura API key | Alternative RPC provider |

## 🔧 Development

### Smart Contract

```bash
cd contract

# Deploy to Mantle Sepolia
npm run deploy

# Run tests
npm run test

# Verify contract
npm run verify
```

### Frontend Development

```bash
# Web app development
cd frontend/web
npm run dev

# Mobile app development
cd frontend/mobile
npm run dev

# Build UI components
cd frontend/ui
npm run build
```

## 📱 Applications

### 🌐 Web App (`frontend/web`)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi + Viem
- **Features**: Payment creation, QR scanning, gasless transactions

### 📱 Mobile App (`frontend/mobile`)
- **Framework**: React Native with Expo SDK 50
- **Features**: QR code scanning, deep linking (`mantlepay://`)
- **Platforms**: iOS and Android

### 🎨 UI Library (`frontend/ui`)
- **Purpose**: Shared components between web and mobile
- **Components**: Button, Card, Input, QRCode, TokenSelect

## 🔗 Contract Information

### Mantle Sepolia Testnet
- **Contract Address**: `0x9A2478962cC59f0A606D536937883cE5845eA400`
- **Chain ID**: `5003`
- **Explorer**: [View on Mantle Sepolia Explorer](https://explorer.sepolia.mantle.xyz/address/0x9A2478962cC59f0A606D536937883cE5845eA400)

### Key Functions
- `createBill(billId, token, amount)` - Create a payment bill
- `payBill(billId)` - Pay a bill directly
- `payBillWithAuthorization(auth)` - Gasless payment with EIP-7702

## 🧪 Testing

### Contract Tests
```bash
cd contract
npm run test
```

### Frontend Tests
```bash
cd frontend/web
npm run test
```

## 🚀 Deployment

### Smart Contract Deployment
```bash
cd contract
npm run deploy
```

### Web App Deployment
```bash
cd frontend/web
npm run build
npm run start
```

## 🛠️ Troubleshooting

### Common Issues

1. **npm install fails**: Use Node.js 18+ and clear npm cache
2. **Contract deployment fails**: Check private key and RPC URL
3. **Frontend build errors**: Ensure all dependencies are installed
4. **Mobile app won't start**: Check Expo CLI installation

### Getting Help

- Check the logs in `contract/` or `frontend/*/`
- Verify environment variables in `.env`
- Ensure wallet has sufficient Mantle Sepolia ETH

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🏆 Hackathon Ready

This project is optimized for the **Mantle Hackathon** with:
- ✅ Smart contract deployed and verified
- ✅ Full frontend implementation
- ✅ Mobile app with deep linking
- ✅ Gasless transaction support
- ✅ Comprehensive documentation

---

Built with ❤️ on Mantle L2 for the Mantle Hackathon 🚀
