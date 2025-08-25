import React, { useState, useEffect } from 'react';
import { useWallet } from '../../context/WalletContext';
import { ethers } from 'ethers';
import WalletConnect from '../../components/WalletConnect';
import { 
  Token, 
  Chain,
  SUPPORTED_CHAINS,
  formatAddress, 
  formatTokenBalance, 
  validateAddress, 
  validateAmount,
  getProvider,
  getAllBalances,
  getCurrentChainId,
  switchChain,
  transferNative,
  transferToken,
  getChainName
} from '../../utils/ethereum';

const Home: React.FC = () => {
  const { account, connect } = useWallet();
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [currentChainId, setCurrentChainId] = useState<number>(1);
  const [isSwitchingChain, setIsSwitchingChain] = useState(false);
  
  // Transfer state
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferStatus, setTransferStatus] = useState<string>('');

  // Load all balances across all chains
  const loadAllBalances = async () => {
    if (!account) return;
    
    setIsLoadingBalances(true);
    try {
      const tokens = await getAllBalances(account);
      setAllTokens(tokens);
    } catch (error) {
      console.error('Error loading balances:', error);
    } finally {
      setIsLoadingBalances(false);
    }
  };

  // Get current chain ID
  const loadCurrentChain = async () => {
    try {
      const chainId = await getCurrentChainId();
      setCurrentChainId(chainId);
    } catch (error) {
      console.error('Error getting current chain:', error);
    }
  };

  // Switch to different chain
  const handleChainSwitch = async (chainId: number) => {
    setIsSwitchingChain(true);
    try {
      await switchChain(chainId);
      setCurrentChainId(chainId);
      await loadAllBalances(); // Reload balances after chain switch
    } catch (error) {
      console.error('Error switching chain:', error);
    } finally {
      setIsSwitchingChain(false);
    }
  };

  // Handle token transfer
  const handleTransfer = async () => {
    if (!account || !selectedToken || !selectedChain || !recipientAddress || !transferAmount) {
      setTransferStatus('Please fill in all fields');
      return;
    }

    if (!validateAddress(recipientAddress)) {
      setTransferStatus('Invalid recipient address');
      return;
    }

    if (!validateAmount(transferAmount)) {
      setTransferStatus('Invalid amount');
      return;
    }

    setIsTransferring(true);
    setTransferStatus('Preparing transaction...');

    try {
      const provider = getProvider();
      if (!provider) {
        setTransferStatus('❌ No wallet provider available');
        return;
      }

      // Switch to the correct chain if needed
      if (currentChainId !== selectedChain.id) {
        setTransferStatus('Switching to correct chain...');
        await switchChain(selectedChain.id);
        setCurrentChainId(selectedChain.id);
      }

      const signer = await provider.getSigner();
      
      setTransferStatus('Please approve the transaction in your wallet...');
      
      let tx;
      if (selectedToken.isNative) {
        // Transfer native token
        tx = await transferNative(recipientAddress, transferAmount, selectedChain.id, signer);
      } else {
        // Transfer ERC-20 token
        tx = await transferToken(selectedToken.address, recipientAddress, transferAmount, selectedToken.decimals, signer);
      }

      setTransferStatus('Transaction sent! Waiting for confirmation...');
      
      const receipt = await tx.wait();
      
      if (receipt && receipt.status === 1) {
        setTransferStatus('✅ Transfer successful!');
        setRecipientAddress('');
        setTransferAmount('');
        setSelectedToken(null);
        setSelectedChain(null);
        // Reload balances
        await loadAllBalances();
      } else {
        setTransferStatus('❌ Transfer failed');
      }
    } catch (error: any) {
      console.error('Transfer error:', error);
      setTransferStatus(`❌ Transfer failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsTransferring(false);
    }
  };

  // Group tokens by chain
  const tokensByChain = allTokens.reduce((acc, token) => {
    if (!acc[token.chainId]) {
      acc[token.chainId] = [];
    }
    acc[token.chainId].push(token);
    return acc;
  }, {} as { [chainId: number]: Token[] });

  // Load data when account changes
  useEffect(() => {
    if (account) {
      loadAllBalances();
      loadCurrentChain();
    }
  }, [account]);

  // Auto-refresh balances every 30 seconds
  useEffect(() => {
    if (!account) return;
    
    const interval = setInterval(() => {
      loadAllBalances();
    }, 30000);

    return () => clearInterval(interval);
  }, [account]);

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Multi-Chain Wallet
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Connect your wallet to view balances across all chains
              </p>
            </div>
            <button
              onClick={connect}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              🔗 Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Multi-Chain Wallet Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Connected: {formatAddress(account)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadAllBalances}
                disabled={isLoadingBalances}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoadingBalances ? 'Loading...' : '🔄 Refresh'}
              </button>
              <WalletConnect />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Token Balances Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  All Token Balances
                </h2>
                <div className="flex gap-2">
                  {SUPPORTED_CHAINS.map((chain) => (
                    <button
                      key={chain.id}
                      onClick={() => handleChainSwitch(chain.id)}
                      disabled={isSwitchingChain}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        currentChainId === chain.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {chain.name}
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingBalances ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Loading balances...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(tokensByChain).map(([chainId, tokens]) => {
                    const chain = SUPPORTED_CHAINS.find(c => c.id === parseInt(chainId));
                    return (
                      <div key={chainId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          {chain?.logoURI && (
                            <img src={chain.logoURI} alt={chain.name} className="w-6 h-6 rounded-full" />
                          )}
                          <h3 className="font-semibold text-gray-900 dark:text-white">{chain?.name || `Chain ${chainId}`}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {tokens.map((token) => (
                            <div
                              key={`${chainId}-${token.address}`}
                              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                              onClick={() => {
                                setSelectedToken(token);
                                setSelectedChain(chain || null);
                              }}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {token.logoURI && (
                                  <img src={token.logoURI} alt={token.symbol} className="w-5 h-5 rounded-full" />
                                )}
                                <span className="font-medium text-gray-900 dark:text-white">{token.symbol}</span>
                                {token.isNative && (
                                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                    Native
                                  </span>
                                )}
                              </div>
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {formatTokenBalance(token.balance, token.decimals)}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                {token.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Transfer Section */}
          <div className="space-y-6">
            {/* Transfer Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Send Tokens
              </h2>
              <div className="space-y-4">
                {/* Selected Token Display */}
                {selectedToken && selectedChain && (
                  <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {selectedToken.logoURI && (
                        <img src={selectedToken.logoURI} alt={selectedToken.symbol} className="w-6 h-6 rounded-full" />
                      )}
                      <span className="font-semibold text-blue-900 dark:text-blue-100">
                        {selectedToken.symbol} on {selectedChain.name}
                      </span>
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      Balance: {formatTokenBalance(selectedToken.balance, selectedToken.decimals)}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.0"
                    step="0.0001"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <button
                  onClick={handleTransfer}
                  disabled={isTransferring || !selectedToken || !recipientAddress || !transferAmount}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {isTransferring ? 'Processing...' : '💸 Send Tokens'}
                </button>

                {transferStatus && (
                  <div className={`p-3 rounded-lg text-sm ${
                    transferStatus.includes('✅') 
                      ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : transferStatus.includes('❌')
                      ? 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200'
                      : 'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  }`}>
                    {transferStatus}
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How to use:</h3>
              <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>1. Click on any token to select it for transfer</li>
                <li>2. Enter recipient address</li>
                <li>3. Enter amount to send</li>
                <li>4. Click "Send Tokens"</li>
                <li>5. Approve transaction in your wallet</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 