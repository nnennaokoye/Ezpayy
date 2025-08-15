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
      {/* Dark Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1b3a] via-[#2d1b69] to-[#4c1d95] opacity-95" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      
      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-pink-500/10 rounded-full blur-lg animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 flex items-center min-h-screen">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span className="text-sm font-semibold text-white">Secure, Gasless, Instant</span>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-white leading-tight">
              Safe online
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">payment</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              Experience beautiful, effortless payments powered by Mantle L2 and Ezpay. Create, share, and pay in seconds with zero gas fees.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/create">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  <PlusCircle className="h-5 w-5 mr-2" /> Create Payment Bill
                </Button>
              </Link>
              <Link href="/scan">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white/30 hover:border-white/50 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <QrCode className="h-5 w-5 mr-2" /> Scan QR Code
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Modern Landing Visual */}
          <div className="flex justify-center items-center">
            <div className="relative">
              {/* Glowing backdrop */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-20 scale-110 animate-pulse" />
              
              {/* Main image container */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 float-animation">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
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
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Secure Payments</p>
                          <p className="text-xs text-muted-foreground">Zero gas fees</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Powered by</p>
                        <p className="font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Mantle L2</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements around the image */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce delay-300"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-bounce delay-700"></div>
              <div className="absolute top-1/2 -left-8 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse delay-1000"></div>
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
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <Wallet className="h-5 w-5 text-white" />
            <span className="text-white font-medium">Connect your wallet to get started</span>
          </div>
        </div>
      )}

      {/* Stats Preview */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div className="group cursor-pointer">
            <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
              $0
            </div>
            <div className="text-sm text-gray-300">Gas Fees</div>
          </div>
          <div className="group cursor-pointer">
            <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
              &lt;1s
            </div>
            <div className="text-sm text-gray-300">Transaction</div>
          </div>
          <div className="group cursor-pointer">
            <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
              24/7
            </div>
            <div className="text-sm text-gray-300">Available</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-purple-400/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}