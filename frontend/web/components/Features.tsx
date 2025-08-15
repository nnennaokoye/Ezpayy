'use client';

import { Card } from 'ui';
import { Zap, QrCode, Shield, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useSectionFade } from '../hooks/useSectionFade';

export default function Features() {
  const { ref, isVisible } = useSectionFade();

  const features = [
    {
      icon: Zap,
      title: "Zero Gas Fees",
      description: "Recipients pay without gas fees using our gasless payment system on Mantle L2",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-400",
      benefits: ["No transaction costs", "Instant payments", "User-friendly"]
    },
    {
      icon: QrCode,
      title: "QR Code Payments",
      description: "Share payment links via QR codes for instant mobile-friendly payments",
      color: "from-blue-500 to-purple-500",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
      benefits: ["Mobile optimized", "Easy sharing", "Universal access"]
    },
    {
      icon: Shield,
      title: "Secure & Fast",
      description: "Built on Mantle L2 with instant confirmations and enterprise-grade security",
      color: "from-pink-500 to-purple-500",
      bgColor: "bg-pink-500/10",
      iconColor: "text-pink-400",
      benefits: ["Bank-level security", "Instant confirmation", "Reliable network"]
    }
  ];

  return (
    <section
      ref={ref}
      id="features"
      className={`
        min-h-screen snap-start relative overflow-hidden
        flex flex-col items-center justify-center
        px-4 py-8 sm:py-16
        bg-gradient-to-br from-[#1a1b3a] via-[#2d1b69] to-[#4c1d95]
        transition-all duration-1000 ease-out delay-200
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-20 px-2 sm:px-4">
          <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 lg:mb-6">
            <Sparkles className="w-3 lg:w-4 h-3 lg:h-4 text-purple-300" />
            <span className="text-xs lg:text-sm font-semibold text-white">Features</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 tracking-tight text-white">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Ezpay
            </span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
            Experience the next generation of payments with cutting-edge blockchain technology
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 px-2 sm:px-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                group relative transform transition-all duration-700 ease-out
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
              `}
              style={{ transitionDelay: `${300 + index * 200}ms` }}
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
              
              <Card className="relative p-6 lg:p-8 h-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 rounded-3xl">
                {/* Icon Container */}
                <div className="relative mb-6 lg:mb-8">
                  <div className={`inline-flex items-center justify-center w-16 lg:w-20 h-16 lg:h-20 ${feature.bgColor} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-8 lg:h-10 w-8 lg:w-10 ${feature.iconColor}`} />
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-2 -right-2 w-6 lg:w-8 h-6 lg:h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:rotate-12">
                    <Check className="w-3 lg:w-4 h-3 lg:h-4 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4 lg:space-y-6">
                  <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits List */}
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-3 group/benefit">
                        <div className="w-2 h-2 bg-purple-400 rounded-full group-hover/benefit:scale-125 transition-transform duration-200"></div>
                        <span className="text-sm font-medium text-gray-400 group-hover/benefit:text-white transition-colors duration-200">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Learn More Link */}
                  <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                    <div className="flex items-center gap-2 text-purple-400 font-semibold cursor-pointer hover:gap-3 transition-all duration-200">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-gray-300 font-medium">
              Join thousands already using Ezpay
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}