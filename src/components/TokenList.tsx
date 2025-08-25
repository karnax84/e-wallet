import React from 'react';
import { Token, formatTokenBalance, SUPPORTED_CHAINS } from '../utils/ethereum';

interface TokenListProps {
  tokens: Token[];
  onTokenSelect: (token: Token) => void;
  selectedToken?: Token | null;
}

const TokenList: React.FC<TokenListProps> = ({ tokens, onTokenSelect, selectedToken }) => {
  const getChainName = (chainId: number) => {
    const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
    return chain?.name || `Chain ${chainId}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Assets
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {tokens.map((token) => (
          <div
            key={`${token.chainId}-${token.address}`}
            className={`px-6 py-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
              selectedToken?.address === token.address && selectedToken?.chainId === token.chainId
                ? 'bg-blue-50 dark:bg-blue-900'
                : ''
            }`}
            onClick={() => onTokenSelect(token)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Token Logo */}
                <div className="flex-shrink-0">
                  <img
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-10 h-10 rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/40/6B7280/FFFFFF?text=' + token.symbol.charAt(0);
                    }}
                  />
                </div>
                
                {/* Token Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {token.name}
                    </h4>
                    {token.isNative && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        Native
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {token.symbol}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      • {getChainName(token.chainId)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Balance and APY */}
              <div className="flex flex-col items-end space-y-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatTokenBalance(token.balance, token.decimals)} {token.symbol}
                </div>
                {token.apy && token.apy > 0 && (
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {token.apy}% APY
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {tokens.length === 0 && (
        <div className="px-6 py-8 text-center">
          <div className="text-gray-400 dark:text-gray-500">
            <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <p className="text-sm">No tokens found</p>
            <p className="text-xs mt-1">Connect your wallet to see your balances</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenList;
