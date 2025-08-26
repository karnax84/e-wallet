import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  Token, 
  Chain,
  SUPPORTED_CHAINS,
  POPULAR_TOKENS,
  formatAddress, 
  formatTokenBalance, 
  validateAddress, 
  validateAmount,
  getProvider,
  getAllBalances,
  transferNative,
  transferToken
} from '../utils/ethereum';
import TokenList from './TokenList';
import TransactionHistory from './TransactionHistory';

const MultiChainWallet: React.FC = () => {
  const { account, connect, disconnect } = useWallet();
  const [allTokens, setAllTokens] = useState<Token[]>([]);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'popular' | 'history'>('all');
  
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

      const signer = await provider.getSigner();
      
      setTransferStatus('Please approve the transaction in your wallet...');
      
      let tx;
      if (selectedToken.isNative) {
        tx = await transferNative(recipientAddress, transferAmount, selectedChain.id, signer);
      } else {
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

  // Handle token selection
  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    const chain = SUPPORTED_CHAINS.find(c => c.id === token.chainId);
    setSelectedChain(chain || null);
  };

  // Get tokens to display based on view mode
  const getDisplayTokens = () => {
    if (viewMode === 'popular') {
      return POPULAR_TOKENS;
    }
    return allTokens;
  };

  // Load data when account changes
  useEffect(() => {
    if (account) {
      loadAllBalances();
    }
  }, [account]);

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Multi-Chain Wallet
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {formatAddress(account)}
              </span>
              <button
                onClick={loadAllBalances}
                disabled={isLoadingBalances}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors disabled:opacity-50"
              >
                {isLoadingBalances ? 'Loading...' : '🔄 Refresh'}
              </button>
              <button
                onClick={disconnect}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid grid-cols-1 gap-8 ${viewMode === 'history' ? 'lg:grid-cols-1' : 'lg:grid-cols-3'}`}>
          {/* Token List */}
          <div className={viewMode === 'history' ? 'w-full' : 'lg:col-span-2'}>
            {/* View Mode Toggle */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('all')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'all'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  All Tokens
                </button>
                <button
                  onClick={() => setViewMode('popular')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'popular'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Popular
                </button>
                <button
                  onClick={() => setViewMode('history')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'history'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  History
                </button>
              </div>
            </div>

            {/* Content based on view mode */}
            {viewMode === 'history' ? (
              <TransactionHistory address={account} />
            ) : isLoadingBalances ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Loading balances...</p>
                </div>
              </div>
            ) : (
              <TokenList
                tokens={getDisplayTokens()}
                onTokenSelect={handleTokenSelect}
                selectedToken={selectedToken}
              />
            )}
          </div>

          {/* Transfer Panel - Hidden when viewing history */}
          {viewMode !== 'history' && (
            <div className="space-y-6">
            {/* Selected Token Info */}
            {selectedToken && selectedChain && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Selected Token
                </h3>
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={selectedToken.logoURI}
                    alt={selectedToken.symbol}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {selectedToken.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedToken.symbol} on {selectedChain.name}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Balance</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatTokenBalance(selectedToken.balance, selectedToken.decimals)} {selectedToken.symbol}
                  </p>
                </div>
              </div>
            )}

            {/* Transfer Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Send Tokens
              </h3>
              
              <div className="space-y-4">
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
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How to use:</h4>
              <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>1. Click on any token to select it</li>
                <li>2. Enter recipient address</li>
                <li>3. Enter amount to send</li>
                <li>4. Click "Send Tokens"</li>
                <li>5. Approve in your wallet</li>
              </ol>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiChainWallet;
