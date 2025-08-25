# Multi-Chain Wallet Application

A comprehensive multi-chain wallet application that allows users to connect their wallet, view balances across all supported chains, and transfer any token on any chain.

## Features

- **Multi-Chain Support**: View balances across Ethereum, BSC, Polygon, Arbitrum, and Optimism
- **Wallet Connection**: Connect to MetaMask, TrustWallet, or other Web3 wallets
- **All Token Balances**: Display native tokens and ERC-20 tokens across all chains
- **Cross-Chain Transfers**: Send any token on any supported chain
- **Chain Switching**: Seamlessly switch between different blockchain networks
- **Real-time Updates**: Auto-refresh balances and transaction status
- **Dark Mode Support**: Responsive design with dark/light theme
- **Transaction History**: View recent transactions across all chains

## Supported Chains

- **Ethereum Mainnet** (Chain ID: 1)
- **BNB Smart Chain** (Chain ID: 56)
- **Polygon** (Chain ID: 137)
- **Arbitrum One** (Chain ID: 42161)
- **Optimism** (Chain ID: 10)

## Supported Tokens

### Ethereum Mainnet
- ETH (Native)
- USDT
- USDC
- WBTC

### BNB Smart Chain
- BNB (Native)
- USDT
- USDC

### Polygon
- MATIC (Native)
- USDT
- USDC

### Arbitrum One
- ETH (Native)

### Optimism
- ETH (Native)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask, TrustWallet, or other Web3 wallet extension

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd e-wallet-final
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect your Web3 wallet
2. **View Balances**: See all your token balances across all supported chains
3. **Switch Chains**: Use the chain switcher to change networks
4. **Select Token**: Click on any token to select it for transfer
5. **Send Tokens**: Enter recipient address and amount, then click "Send Tokens"
6. **Approve Transaction**: Confirm the transaction in your wallet
7. **Monitor Status**: Track transaction status and confirmations

## Technical Details

- **Frontend**: React with TypeScript
- **Styling**: TailwindCSS
- **Web3**: Ethers.js for Ethereum interactions
- **Multi-Chain**: Support for multiple blockchain networks
- **Wallet Connection**: WalletConnect for mobile wallet support
- **State Management**: React Context for wallet state

## Project Structure

```
src/
├── components/
│   ├── WalletConnect.tsx         # Wallet connection component
│   └── MultiChainWallet.tsx      # Main multi-chain wallet interface
├── context/
│   └── WalletContext.tsx         # Wallet state management
├── utils/
│   └── ethereum.ts               # Multi-chain Ethereum utilities
└── App.tsx                       # Main application component
```

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Security Notes

- Always verify recipient addresses before sending transactions
- Never share your private keys or seed phrases
- Use hardware wallets for large amounts
- Test with small amounts first
- Verify you're on the correct chain before making transactions
- Double-check token addresses when sending to different chains

## Chain-Specific Notes

### Ethereum Mainnet
- High gas fees, suitable for large transactions
- Most secure and decentralized network
- Full DeFi ecosystem support

### BNB Smart Chain
- Lower gas fees than Ethereum
- Faster transaction times
- Compatible with Ethereum tools

### Polygon
- Very low gas fees
- Fast transaction times
- Growing DeFi ecosystem

### Arbitrum One
- Layer 2 scaling solution for Ethereum
- Lower gas fees than mainnet
- Full Ethereum compatibility

### Optimism
- Layer 2 scaling solution for Ethereum
- Low gas fees
- Fast transaction times

## License

This project is licensed under the MIT License.
