'use client';

import { QrCode, Github, Twitter, Globe, Heart, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useSectionFade } from '../hooks/useSectionFade';

export default function Footer() {
  const { ref, isVisible } = useSectionFade();

  const footerLinks = {
    product: [
      { label: 'Create Bill', href: '/create' },
      { label: 'Scan QR', href: '/scan' },
      { label: 'Network Guide', href: '/networks' }
    ],
    resources: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Support', href: '#' }
    ],
    company: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Globe, href: '#', label: 'Website' }
  ];

  return (
    <footer
      ref={ref}
      id="footer"
      className={`
        relative overflow-hidden
        px-4 py-16
        bg-gradient-to-br from-[#1a1b3a] via-[#2d1b69] to-[#4c1d95]
        transition-all duration-1000 ease-out delay-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Brand Section */}
          <div className="space-y-8">
            {/* Logo and Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-lg"></div>
                  <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-4">
                    <QrCode className="h-10 w-10 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    Ezpay
                  </h2>
                  <p className="text-sm text-gray-300">Powered by Mantle L2</p>
                </div>
              </div>

              <p className="text-xl text-gray-300 max-w-md leading-relaxed">
                Revolutionizing payments with QR codes and zero gas fees. 
                Experience the future of decentralized transactions.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-purple-400 mb-1">$0</div>
                <div className="text-xs text-gray-400">Gas Fees</div>
              </div>
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-purple-400 mb-1">&lt;1s</div>
                <div className="text-xs text-gray-400">Speed</div>
              </div>
              <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-purple-400 mb-1">24/7</div>
                <div className="text-xs text-gray-400">Available</div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Connect</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="group p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-purple-400/30 transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Product</h3>
              <div className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors duration-300"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Resources</h3>
              <div className="space-y-3">
                {footerLinks.resources.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors duration-300"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Company</h3>
              <div className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="group flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors duration-300"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-gray-300">
              <span> 2024 Ezpay. Built on Mantle L2 with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>All rights reserved.</span>
            </div>

            {/* Tech Stack */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-purple-300">Mantle L2</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                <span className="text-sm font-medium text-blue-300">Next.js</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}