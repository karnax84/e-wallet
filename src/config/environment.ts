// Environment Configuration
export const ENV_CONFIG = {
  // Set to true to use testnets, false for mainnet
  USE_TESTNET: process.env.REACT_APP_USE_TESTNET === 'true',
  
  // WalletConnect Project ID
  WALLETCONNECT_PROJECT_ID: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '',
  
  // Custom RPC URLs (optional)
  ETHEREUM_RPC_URL: process.env.REACT_APP_ETHEREUM_RPC_URL,
  GOERLI_RPC_URL: process.env.REACT_APP_GOERLI_RPC_URL,
};

// Testnet configuration
export const TESTNET_CONFIG = {
  CHAINS: [5, 97, 80001, 421613, 420], // Goerli, BSC Testnet, Mumbai, Arbitrum Goerli, Optimism Goerli
  CHAIN_NAMES: {
    5: 'Goerli Testnet',
    97: 'BNB Smart Chain Testnet', 
    80001: 'Mumbai Testnet',
    421613: 'Arbitrum Goerli',
    420: 'Optimism Goerli'
  }
};

// Mainnet configuration
export const MAINNET_CONFIG = {
  CHAINS: [1, 56, 137, 42161, 10], // Ethereum, BSC, Polygon, Arbitrum, Optimism
  CHAIN_NAMES: {
    1: 'Ethereum',
    56: 'BNB Smart Chain',
    137: 'Polygon',
    42161: 'Arbitrum One',
    10: 'Optimism'
  }
};
