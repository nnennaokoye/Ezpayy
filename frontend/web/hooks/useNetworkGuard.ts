'use client';

import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { mantleSepolia, mantleMainnet } from '../lib/wagmi';

export interface NetworkStatus {
  isCorrectChain: boolean;
  currentChainId: number;
  targetChainId: number;
  isConnected: boolean;
  canProceed: boolean;
}

export interface NetworkGuardResult extends NetworkStatus {
  ensureNetwork: () => Promise<boolean>;
  switchToMantle: () => Promise<boolean>;
  addAndSwitchChain: (chainId: number) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const SUPPORTED_CHAINS: Record<number, typeof mantleSepolia | typeof mantleMainnet> = {
  [mantleSepolia.id]: mantleSepolia,
  [mantleMainnet.id]: mantleMainnet,
};

const SUPPORTED_CHAIN_IDS = Object.keys(SUPPORTED_CHAINS).map(Number);

export function useNetworkGuard(): NetworkGuardResult {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAttemptedChain, setLastAttemptedChain] = useState<number | null>(null);
  const [isProcessingSwitch, setIsProcessingSwitch] = useState(false);

  // Determine target chain (prefer Holesky testnet for development)
  const targetChainId = mantleSepolia.id;
  const isCorrectChain = SUPPORTED_CHAIN_IDS.includes(chainId);
  const canProceed = isConnected && isCorrectChain;

  const networkStatus: NetworkStatus = {
    isCorrectChain,
    currentChainId: chainId,
    targetChainId,
    isConnected,
    canProceed,
  };

  // Clear error when network becomes correct
  useEffect(() => {
    if (isCorrectChain) {
      setError(null);
      setLastAttemptedChain(null);
    }
  }, [isCorrectChain]);

  // Auto-check network on every page load for pay pages
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('/pay/')) {
      if (isConnected && !isCorrectChain) {
        // Auto-attempt network switch for pay pages
        ensureNetwork();
      }
    }
  }, [isConnected, isCorrectChain]);

  const addAndSwitchChain = useCallback(async (targetChain: number): Promise<boolean> => {
    if (!isConnected) {
      setError('Wallet not connected');
      return false;
    }

    // Prevent multiple simultaneous switch attempts
    if (isProcessingSwitch || isSwitching) {
      console.log('Network switch already in progress, skipping...');
      return false;
    }

    const chainConfig = SUPPORTED_CHAINS[targetChain];
    if (!chainConfig) {
      setError(`Unsupported chain ID: ${targetChain}`);
      return false;
    }

    setIsLoading(true);
    setIsProcessingSwitch(true);
    setError(null);

    try {
      console.log(`Attempting to add and switch to ${chainConfig.name} (${targetChain})`);
      
      await switchChainAsync({
        chainId: targetChain,
        addEthereumChainParameter: {
          chainName: chainConfig.name,
          nativeCurrency: chainConfig.nativeCurrency,
          rpcUrls: chainConfig.rpcUrls.default.http,
          blockExplorerUrls: chainConfig.blockExplorers 
            ? [chainConfig.blockExplorers.default.url] 
            : undefined,
        }
      });

      toast.success(`Switched to ${chainConfig.name}!`);
      setLastAttemptedChain(null);
      return true;

    } catch (err: any) {
      console.error('Add and switch chain failed:', err);
      
      let errorMessage = 'Failed to switch network';
      if (err.code === 4001) {
        errorMessage = 'Network switch was cancelled by user';
      } else if (err.code === -32002) {
        errorMessage = 'Please wait for the current wallet request to complete';
        // Don't show toast for this error as it's temporary
        console.log('MetaMask busy, will retry automatically');
      } else if (err.message?.includes('does not support programmatic chain switching')) {
        errorMessage = 'Please manually switch to Mantle network in your wallet';
      } else if (err.message?.includes('already pending')) {
        errorMessage = 'Please wait for the current wallet request to complete';
        console.log('Request already pending, will retry automatically');
      }
      
      setError(errorMessage);
      setLastAttemptedChain(targetChain);
      
      // Only show toast for non-temporary errors
      if (err.code !== -32002 && !err.message?.includes('already pending')) {
        toast.error(errorMessage);
      }
      return false;

    } finally {
      setIsLoading(false);
      setIsProcessingSwitch(false);
    }
  }, [isConnected, switchChainAsync]);

  const switchToMantle = useCallback(async (): Promise<boolean> => {
    if (!isConnected || !switchChainAsync) {
      setError('Wallet not connected');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Attempting to switch to ${mantleSepolia.name} (${targetChainId})`);
      
      // Try simple switch first
      await switchChainAsync({ chainId: targetChainId });
      
      toast.success(`Switched to ${mantleSepolia.name}!`);
      setLastAttemptedChain(null);
      return true;

    } catch (err: any) {
      console.error('Simple switch failed:', err);
      
      // If chain not found, try adding it
      if (err.code === 4902 || err.message?.includes('chain has not been added')) {
        console.log('Chain not found, attempting to add...');
        return await addAndSwitchChain(targetChainId);
      }
      
      // User rejected
      if (err.code === 4001) {
        const errorMessage = 'Network switch was cancelled by user';
        setError(errorMessage);
        setLastAttemptedChain(targetChainId);
        toast.error('Please switch to Mantle network to continue');
        return false;
      }
      
      // Other errors
      const errorMessage = err.message || 'Failed to switch network';
      setError(errorMessage);
      setLastAttemptedChain(targetChainId);
      toast.error(errorMessage);
      return false;

    } finally {
      setIsLoading(false);
    }
  }, [isConnected, switchChainAsync, targetChainId, addAndSwitchChain]);

  const ensureNetwork = useCallback(async (): Promise<boolean> => {
    // If already on correct network, no action needed
    if (canProceed) {
      return true;
    }

    // If not connected, can't proceed
    if (!isConnected) {
      setError('Please connect your wallet first');
      toast.error('Please connect your wallet first');
      return false;
    }

    // If on wrong network, attempt to switch
    if (!isCorrectChain) {
      console.log(`Wrong network detected. Current: ${chainId}, Target: ${targetChainId}`);
      return await switchToMantle();
    }

    return false;
  }, [canProceed, isConnected, isCorrectChain, chainId, targetChainId, switchToMantle]);

  return {
    ...networkStatus,
    ensureNetwork,
    switchToMantle,
    addAndSwitchChain,
    isLoading: isLoading || isSwitching,
    error,
  };
} 