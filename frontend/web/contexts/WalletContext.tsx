"use client";

import React, { createContext, useContext, useState } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { mantleSepolia, mantleMainnet } from "../lib/wagmi";

interface WalletContextType {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
  connectError: Error | null;
  mantleSepolia: typeof mantleSepolia;
  mantleMainnet: typeof mantleMainnet;
  signMessage: (message: string) => Promise<`0x${string}` | undefined>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState<Error | null>(null);

  // Function to connect wallet using AppKit
  const connect = async () => {
    setIsConnecting(true);
    setConnectError(null);

    try {
      // This calls the appkit connect method via custom element
      const appkitButton = document.querySelector("appkit-button");
      if (appkitButton) {
        // Trigger click on the appkit-button element
        (appkitButton as HTMLElement).click();
      } else {
        // Fallback: try to open the modal directly
        const modal = (window as any).modal;
        if (modal && modal.open) {
          modal.open();
        } else {
          throw new Error("AppKit modal not found - please ensure AppKit is properly initialized");
        }
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      setConnectError(
        error instanceof Error ? error : new Error("Failed to connect wallet")
      );
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to disconnect wallet
  const disconnect = () => {
    wagmiDisconnect();
  };

  // Function to sign a message
  const signMessage = async (
    message: string
  ): Promise<`0x${string}` | undefined> => {
    try {
      return await signMessageAsync({ message });
    } catch (error) {
      console.error("Error signing message:", error);
      return undefined;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        connect,
        disconnect,
        connectError,
        mantleSepolia,
        mantleMainnet,
        signMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
