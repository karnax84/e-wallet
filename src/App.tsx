import React from 'react';
import { WalletProvider } from './context/WalletContext';
import MultiChainWallet from './components/MultiChainWallet';

const App: React.FC = () => {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MultiChainWallet />
        </div>
      </div>
    </WalletProvider>
  );
};

export default App;
