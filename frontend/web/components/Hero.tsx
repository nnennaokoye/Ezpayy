'use client';

import { Button } from 'ui';
import { QrCode, PlusCircle, Wallet, Sparkles, Zap, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { NetworkAlert, useNetworkAlert } from './NetworkAlert';
import { useSectionFade } from '../hooks/useSectionFade';

export default function Hero() {
  const { isConnected } = useAccount();
  const { canProceed, shouldShowAlert } = useNetworkAlert();
  const { ref, isVisible } = useSectionFade();

  return (
    <section ref={ref} id="hero" className={`relative overflow-hidden min-h-screen ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-1000 ease-out`}>
      {/* HederaPay Clean Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50" />
      
      {/* Subtle Green Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500/5 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-green-400/5 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-emerald-500/5 rounded-full blur-lg animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 flex items-center min-h-screen">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Secure, Gasless, Instant</span>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-gray-900 leading-tight">
              Gasless Crypto Payments for
              <br />
              <span className="text-green-600">Africa</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Enable seamless USDC, USDT, and HBAR payments via QR codes. Built on Mantle for the unbanked, with zero fees and mobile-money simplicity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/create">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white border-0 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 rounded-lg"
                >
                  <PlusCircle className="h-5 w-5 mr-2" /> Start Accepting Payments
                </Button>
              </Link>
              <Link href="/scan">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-gray-300 hover:border-green-500 bg-white hover:bg-green-50 text-gray-700 hover:text-green-700 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-lg"
                >
                  <QrCode className="h-5 w-5 mr-2" /> For Users
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Modern Landing Visual */}
          <div className="flex justify-center items-center">
            <div className="relative">
              {/* Clean green backdrop */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-3xl opacity-10 scale-110 animate-pulse" />
              
              {/* Main image container */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 float-animation">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent z-10" />
                <Image 
                  src="/assets/landing.jpg" 
                  alt="Ezpay - Secure Payment Platform" 
                  width={560} 
                  height={420} 
                  className="w-[320px] sm:w-[420px] lg:w-[560px] h-auto object-cover"
                  priority
                />
                
                {/* Overlay badge */}
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-900">Secure Payments</p>
                          <p className="text-xs text-gray-600">Zero gas fees</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Powered by</p>
                        <p className="font-bold text-sm text-green-600">Mantle L2</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clean floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full animate-bounce delay-300"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-emerald-500 rounded-full animate-bounce delay-700"></div>
              <div className="absolute top-1/2 -left-8 w-4 h-4 bg-green-400 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float delay-0">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float delay-1000">
            <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-accent-foreground" />
          </div>
        </div>
        <div className="absolute bottom-1/3 left-1/6 animate-float delay-2000">
            <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
            <QrCode className="w-5 h-5 text-secondary-foreground" />
          </div>
        </div>
      </div>

      

      {/* Connection Status */}
      {!isConnected && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/95 backdrop-blur-sm rounded-2xl border border-green-200 shadow-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <Wallet className="h-5 w-5 text-gray-700" />
            <span className="text-gray-700 font-medium">Connect your wallet to get started</span>
          </div>
        </div>
      )}

      {/* Stats Preview */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div className="group cursor-pointer">
            <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
              $0
            </div>
            <div className="text-sm text-gray-600">Gas Fees</div>
          </div>
          <div className="group cursor-pointer">
            <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
              &lt;1s
            </div>
            <div className="text-sm text-gray-600">Transaction</div>
          </div>
          <div className="group cursor-pointer">
            <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
              24/7
            </div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-green-400/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-green-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}