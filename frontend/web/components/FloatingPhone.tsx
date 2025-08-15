'use client';

import { useState, useEffect } from 'react';
import { Shield, CreditCard, Smartphone, CheckCircle } from 'lucide-react';

export default function FloatingPhone() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-80 h-96 mx-auto float-animation">
      {/* Phone Frame */}
      <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] p-2 shadow-2xl">
        {/* Screen */}
        <div className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500 rounded-[2rem] overflow-hidden relative">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-6 py-3 text-white text-sm">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 bg-white rounded-sm"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>

          {/* App Content */}
          <div className="px-6 py-4 text-white">
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">SAFE</h3>
              <h3 className="text-2xl font-bold">CHECKOUT</h3>
            </div>

            {/* Credit Card */}
            <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-4 mb-6 relative overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <div className="w-8 h-6 bg-yellow-300 rounded"></div>
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div className="text-white">
                <div className="text-lg font-mono mb-2">•••• •••• •••• 1234</div>
                <div className="text-sm opacity-90">JOHN DOE</div>
              </div>
              {/* Card Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            </div>

            {/* Security Shield */}
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <Shield className="w-16 h-16 text-white mx-auto mb-2" />
                <CheckCircle className="w-6 h-6 text-green-400 absolute translate-x-12 -translate-y-4" />
              </div>
            </div>

            {/* Payment Button */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="text-white font-semibold">Secure Payment</div>
              <div className="text-white/80 text-sm">Protected by Mantle L2</div>
            </div>
          </div>

          {/* Bottom Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
        </div>

        {/* Phone Buttons */}
        <div className="absolute right-0 top-20 w-1 h-12 bg-gray-700 rounded-l"></div>
        <div className="absolute right-0 top-36 w-1 h-8 bg-gray-700 rounded-l"></div>
        <div className="absolute right-0 top-48 w-1 h-8 bg-gray-700 rounded-l"></div>
      </div>

      {/* Floating Elements Around Phone */ }
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-accent/80 rounded-lg float-animation-delayed flex items-center justify-center">
        <span className="text-white font-bold text-sm">$</span>
      </div>
      
      <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-primary/80 rounded-full float-animation-slow flex items-center justify-center">
        <CheckCircle className="w-6 h-6 text-white" />
      </div>
      
      <div className="absolute top-1/4 -right-8 w-6 h-6 bg-accent/80 rounded-full float-animation"></div>
      <div className="absolute bottom-1/3 -left-6 w-4 h-4 bg-primary/80 rounded float-animation-delayed"></div>
    </div>
  );
}
