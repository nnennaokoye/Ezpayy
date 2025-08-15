'use client';

import { useAccount, useChainId } from 'wagmi';
import { mantleSepolia } from '../lib/wagmi';
import { useEffect, useState } from 'react';

export function WalletConnect() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const [mounted, setMounted] = useState(false);
  
  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Check if on correct network (Mantle Sepolia only)
  const isOnMantleSepolia = chainId === mantleSepolia.id;

  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        <appkit-button />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Show network status when connected */}
      {isConnected && address && (
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/90 text-gray-200 rounded-lg text-sm border border-gray-700">
          <div className={`w-2 h-2 rounded-full ${
            isOnMantleSepolia ? 'bg-green-400' : 'bg-amber-400'
          }`}></div>
          <span className="font-medium">
            {isOnMantleSepolia ? 'Mantle Sepolia' : 'Wrong Network'}
          </span>
        </div>
      )}
      
      {/* Main wallet button - handles connection and account management */}
      <appkit-button />
    </div>
  );
}

 