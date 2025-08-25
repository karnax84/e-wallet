import { ethers } from 'ethers';

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  chainId?: number;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  logoURI?: string;
  chainId: number;
  isNative?: boolean;
  apy?: number;
}

export interface Chain {
  id: number;
  name: string;
  rpcUrl: string;
  explorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  logoURI?: string;
}

// Supported chains
export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 1,
    name: 'Ethereum',
    rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    explorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  {
    id: 56,
    name: 'BNB Smart Chain',
    rpcUrl: 'https://bsc-dataseed1.binance.org',
    explorer: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    logoURI: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
  },
  {
    id: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    logoURI: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
  },
  {
    id: 42161,
    name: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    logoURI: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png'
  },
  {
    id: 10,
    name: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    explorer: 'https://optimistic.etherscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    logoURI: 'https://cryptologos.cc/logos/optimism-op-logo.png'
  }
];

// Common tokens by chain
export const CHAIN_TOKENS: { [chainId: number]: Token[] } = {
  1: [ // Ethereum
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      balance: '0',
      chainId: 1,
      logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      apy: 0
    },
    {
      address: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      balance: '0',
      chainId: 1,
      logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      apy: 0
    },
    {
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      decimals: 8,
      balance: '0',
      chainId: 1,
      logoURI: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png',
      apy: 0
    },
    {
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      symbol: 'UNI',
      name: 'Uniswap',
      decimals: 18,
      balance: '0',
      chainId: 1,
      logoURI: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
      apy: 0
    },
    {
      address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608aCafEBB0',
      symbol: 'MATIC',
      name: 'Polygon',
      decimals: 18,
      balance: '0',
      chainId: 1,
      logoURI: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
      apy: 0
    }
  ],
  56: [ // BSC
    {
      address: '0x55d398326f99059fF775485246999027B3197955',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 18,
      balance: '0',
      chainId: 56,
      logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      apy: 0
    },
    {
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 18,
      balance: '0',
      chainId: 56,
      logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      apy: 0
    },
    {
      address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      symbol: 'CAKE',
      name: 'PancakeSwap',
      decimals: 18,
      balance: '0',
      chainId: 56,
      logoURI: 'https://cryptologos.cc/logos/pancakeswap-cake-logo.png',
      apy: 0
    }
  ],
  137: [ // Polygon
    {
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      balance: '0',
      chainId: 137,
      logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      apy: 0
    },
    {
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      balance: '0',
      chainId: 137,
      logoURI: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
      apy: 0
    },
    {
      address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      symbol: 'WMATIC',
      name: 'Wrapped MATIC',
      decimals: 18,
      balance: '0',
      chainId: 137,
      logoURI: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
      apy: 0
    }
  ]
};

// Popular tokens that can be displayed across chains (like in the image)
export const POPULAR_TOKENS: Token[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'BTC',
    name: 'Bitcoin',
    decimals: 8,
    balance: '0',
    chainId: 1,
    logoURI: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    apy: 0
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    balance: '0',
    chainId: 1,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    apy: 0
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'TRX',
    name: 'Tron',
    decimals: 6,
    balance: '0',
    chainId: 1,
    logoURI: 'https://cryptologos.cc/logos/tron-trx-logo.png',
    apy: 0
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'XRP',
    name: 'XRP',
    decimals: 6,
    balance: '0',
    chainId: 1,
    logoURI: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
    apy: 0
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'BNB',
    name: 'BNB',
    decimals: 18,
    balance: '0',
    chainId: 56,
    logoURI: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    apy: 0
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    balance: '0',
    chainId: 1,
    logoURI: 'https://cryptologos.cc/logos/solana-sol-logo.png',
    apy: 6.88
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'DOGE',
    name: 'Dogecoin',
    decimals: 8,
    balance: '0',
    chainId: 1,
    logoURI: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
    apy: 0
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ADA',
    name: 'Cardano',
    decimals: 6,
    balance: '0',
    chainId: 1,
    logoURI: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
    apy: 2.49
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'AVAX',
    name: 'Avalanche',
    decimals: 18,
    balance: '0',
    chainId: 1,
    logoURI: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
    apy: 0
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'LTC',
    name: 'Litecoin',
    decimals: 8,
    balance: '0',
    chainId: 1,
    logoURI: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png',
    apy: 0
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'DOT',
    name: 'Polkadot',
    decimals: 10,
    balance: '0',
    chainId: 1,
    logoURI: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
    apy: 0
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ATOM',
    name: 'Cosmos',
    decimals: 6,
    balance: '0',
    chainId: 1,
    logoURI: 'https://cryptologos.cc/logos/cosmos-atom-logo.png',
    apy: 23.79
  }
];

// ERC-20 ABI for basic token operations
export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
];

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatBalance = (balance: string): string => {
  const ethBalance = parseFloat(ethers.formatEther(balance));
  return ethBalance.toFixed(4);
};

export const formatTokenBalance = (balance: string, decimals: number): string => {
  const divisor = Math.pow(10, decimals);
  const tokenBalance = parseFloat(balance) / divisor;
  return tokenBalance.toFixed(4);
};

export const formatUSDValue = (ethAmount: string, ethPrice: number = 2000): string => {
  const ethBalance = parseFloat(ethers.formatEther(ethAmount));
  return (ethBalance * ethPrice).toFixed(2);
};

export const validateAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

export const validateAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const getProvider = (): ethers.BrowserProvider | null => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
};

// Get provider for specific chain
export const getChainProvider = (chainId: number): ethers.JsonRpcProvider => {
  const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
  if (!chain) {
    throw new Error(`Chain ${chainId} not supported`);
  }
  return new ethers.JsonRpcProvider(chain.rpcUrl);
};

// Get current chain ID from wallet
export const getCurrentChainId = async (): Promise<number> => {
  const provider = getProvider();
  if (!provider) throw new Error('No provider available');
  
  const network = await provider.getNetwork();
  return Number(network.chainId);
};

// Switch to specific chain
export const switchChain = async (chainId: number): Promise<void> => {
  if (!window.ethereum) throw new Error('No wallet available');
  
  const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
  if (!chain) throw new Error(`Chain ${chainId} not supported`);
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      // Chain not added, add it
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${chainId.toString(16)}`,
          chainName: chain.name,
          nativeCurrency: chain.nativeCurrency,
          rpcUrls: [chain.rpcUrl],
          blockExplorerUrls: [chain.explorer]
        }],
      });
    } else {
      throw error;
    }
  }
};

// Get token balance
export const getTokenBalance = async (
  tokenAddress: string, 
  walletAddress: string, 
  provider: ethers.Provider
): Promise<string> => {
  try {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(walletAddress);
    return balance.toString();
  } catch (error) {
    console.error(`Error getting balance for token ${tokenAddress}:`, error);
    return '0';
  }
};

// Get native token balance
export const getNativeBalance = async (
  walletAddress: string,
  provider: ethers.Provider
): Promise<string> => {
  try {
    const balance = await provider.getBalance(walletAddress);
    return balance.toString();
  } catch (error) {
    console.error('Error getting native balance:', error);
    return '0';
  }
};

// Get all token balances for a wallet on a specific chain
export const getChainTokenBalances = async (
  walletAddress: string,
  chainId: number
): Promise<Token[]> => {
  const tokens: Token[] = [];
  const provider = getChainProvider(chainId);
  const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
  
  if (!chain) return tokens;

  // Get native token balance
  try {
    const nativeBalance = await getNativeBalance(walletAddress, provider);
    tokens.push({
      address: '0x0000000000000000000000000000000000000000',
      symbol: chain.nativeCurrency.symbol,
      name: chain.nativeCurrency.name,
      decimals: chain.nativeCurrency.decimals,
      balance: nativeBalance,
      chainId,
      isNative: true,
      logoURI: chain.logoURI
    });
  } catch (error) {
    console.error('Error getting native balance:', error);
  }

  // Get ERC-20 token balances
  const chainTokens = CHAIN_TOKENS[chainId] || [];
  for (const token of chainTokens) {
    try {
      const balance = await getTokenBalance(token.address, walletAddress, provider);
      if (balance !== '0') {
        tokens.push({
          ...token,
          balance
        });
      }
    } catch (error) {
      console.error(`Error getting balance for ${token.symbol}:`, error);
    }
  }

  return tokens;
};

// Get all balances across all chains
export const getAllBalances = async (walletAddress: string): Promise<Token[]> => {
  const allTokens: Token[] = [];
  
  for (const chain of SUPPORTED_CHAINS) {
    try {
      const chainTokens = await getChainTokenBalances(walletAddress, chain.id);
      allTokens.push(...chainTokens);
    } catch (error) {
      console.error(`Error getting balances for chain ${chain.name}:`, error);
    }
  }
  
  return allTokens;
};

// Transfer native tokens
export const transferNative = async (
  to: string,
  amount: string,
  chainId: number,
  signer: ethers.Signer
): Promise<ethers.TransactionResponse> => {
  const amountInWei = ethers.parseEther(amount);
  return await signer.sendTransaction({
    to,
    value: amountInWei
  });
};

// Transfer ERC-20 tokens
export const transferToken = async (
  tokenAddress: string,
  to: string,
  amount: string,
  decimals: number,
  signer: ethers.Signer
): Promise<ethers.ContractTransactionResponse> => {
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
  const amountInWei = ethers.parseUnits(amount, decimals);
  return await contract.transfer(to, amountInWei);
};

// Get chain name by ID
export const getChainName = (chainId: number): string => {
  const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
  return chain?.name || `Chain ${chainId}`;
};

// Get token by address and chain
export const getTokenByAddress = (address: string, chainId: number): Token | null => {
  const chainTokens = CHAIN_TOKENS[chainId] || [];
  return chainTokens.find(token => token.address.toLowerCase() === address.toLowerCase()) || null;
};
