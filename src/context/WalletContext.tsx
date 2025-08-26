import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import EthereumProvider from '@walletconnect/ethereum-provider';
import axios from 'axios';
import { ENV_CONFIG, TESTNET_CONFIG, MAINNET_CONFIG } from '../config/environment';

// Add type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  account: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
  error: null,
});

export const useWallet = () => useContext(WalletContext);

const projectId = ENV_CONFIG.WALLETCONNECT_PROJECT_ID;

const saveAddressToSheet = async (address: string) => {
  // This is your actual Google Apps Script Web App URL
  const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxwSrMecDWKt532TtAnEAzB7tmRgXdT3iefagaBUyHE91kEy5MaCkXBDmOdRsVP5bk_0g/exec';

  try {
    // We send the data as a string with 'text/plain' Content-Type to avoid a CORS preflight request,
    // which Google Apps Script doesn't handle easily. The script can still parse the JSON string.
    await axios.post(
      GOOGLE_SHEET_WEB_APP_URL,
      JSON.stringify({ address: address }),
      {
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      }
    );
  } catch (error) {
    console.error('Error saving address to Google Sheet:', error);
  }
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const walletConnectProviderRef = useRef<InstanceType<typeof EthereumProvider> | null>(null);

  useEffect(() => {
    if (!walletConnectProviderRef.current) {
      const initWalletConnect = async () => {
        try {
                               const provider = await EthereumProvider.init({
            projectId,
            chains: ENV_CONFIG.USE_TESTNET ? TESTNET_CONFIG.CHAINS : MAINNET_CONFIG.CHAINS,
            optionalChains: ENV_CONFIG.USE_TESTNET ? TESTNET_CONFIG.CHAINS : MAINNET_CONFIG.CHAINS,
            showQrModal: true,
            metadata: {
              name: 'ETH Airdrop',
              description: 'ETH Airdrop Platform',
              url: window.location.origin,
              icons: [`${window.location.origin}/logo192.png`],
            },
          });
          walletConnectProviderRef.current = provider;
        } catch (error) {
          console.error('Failed to initialize WalletConnect:', error);
        }
      };

      initWalletConnect();
    }

    // Cleanup function
    return () => {
      if (walletConnectProviderRef.current) {
        walletConnectProviderRef.current.removeListener('accountsChanged', () => {});
        walletConnectProviderRef.current.removeListener('chainChanged', () => {});
        walletConnectProviderRef.current.removeListener('disconnect', () => {});
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        await saveAddressToSheet(address);

        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          setAccount(accounts[0] || null);
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

        window.ethereum.on('disconnect', () => {
          setAccount(null);
        });
      } else if (walletConnectProviderRef.current) {
        await walletConnectProviderRef.current.enable();
        const provider = new ethers.BrowserProvider(walletConnectProviderRef.current);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        await saveAddressToSheet(address);

        walletConnectProviderRef.current.on('accountsChanged', (accounts: string[]) => {
          setAccount(accounts[0] || null);
        });

        walletConnectProviderRef.current.on('chainChanged', () => {
          window.location.reload();
        });

        walletConnectProviderRef.current.on('disconnect', () => {
          setAccount(null);
        });
      } else {
        throw new Error('No wallet connection method available');
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (walletConnectProviderRef.current) {
      walletConnectProviderRef.current.disconnect();
    }
    setAccount(null);
    setError(null);
  };

  useEffect(() => {
    const checkExistingConnection = async () => {
      if (window.ethereum?.selectedAddress) {
        const address = window.ethereum.selectedAddress;
        setAccount(address);
        await saveAddressToSheet(address);
      }
    };
    checkExistingConnection();
  }, []);

  return (
    <WalletContext.Provider value={{ account, connect: connectWallet, disconnect, isConnecting, error }}>
      {children}
    </WalletContext.Provider>
  );
}; 