'use client';

import Link from 'next/link';
import { WalletConnect } from './WalletConnect';
import { NetworkAlert, NetworkBadge } from './NetworkAlert';
import { QrCode, Plus, Home, Menu, X, Network } from 'lucide-react';
import { useState } from 'react';
import { Button } from 'ui';
import { useAccount } from 'wagmi';
import { useNetworkAlert } from '../hooks/useNetworkAlert';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isConnected } = useAccount();
  const { isWrongNetwork, shouldShowAlert } = useNetworkAlert();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/create', label: 'Create Bill', icon: Plus },
    { href: '/scan', label: 'Scan QR', icon: QrCode },
    { href: '/networks', label: 'Networks', icon: Network },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-300">
                <QrCode className="h-5 w-5 text-white" />
              </div>
              <span className="hidden font-bold text-xl sm:inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ezpay
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 group"
                >
                  <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Desktop Status & Wallet */}
            <div className="hidden xl:flex items-center space-x-3">
              {/* ✅ Network Alert - Orange badge for wrong network */}
              {isConnected && <NetworkBadge />}
              <div className="transform hover:scale-105 transition-all duration-300">
                <WalletConnect />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="xl:hidden flex items-center space-x-2">
              {/* Mobile Network Alert */}
              {isConnected && <NetworkBadge />}
              <WalletConnect />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="tap-target hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="xl:hidden border-t">
              <div className="px-2 py-4 space-y-4">
                {/* Mobile Network Status with detailed alert */}
                {isConnected && shouldShowAlert && (
                  <div className="px-3 py-2 bg-muted/50 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Network Status:</span>
                    </div>
                    <NetworkAlert showButton={true} />
                  </div>
                )}

                {/* Navigation Items */}
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 text-sm font-medium transition-colors hover:bg-accent rounded-md tap-target"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ✅ Global Network Warning Banner - Using NetworkAlert */}
      {shouldShowAlert && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <span className="text-[16px]">⚠️</span>
                <span className="text-sm font-medium">
                  Wrong Network Detected: Please switch to Mantle L2 to use Ezpay
                </span>
              </div>
              <div className="hidden sm:block">
                <NetworkAlert showButton={true} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 