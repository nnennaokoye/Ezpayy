'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import AppKitContextProvider from '../contexts/AppKitContext';
import { WalletProvider } from '../contexts/WalletContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AppKitContextProvider cookies={null}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </AppKitContextProvider>
    </ThemeProvider>
  );
}