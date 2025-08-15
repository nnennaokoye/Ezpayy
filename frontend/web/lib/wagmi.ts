import { createConfig, http } from 'wagmi';
import { metaMask, walletConnect, injected } from '@wagmi/connectors';
import { mainnet, sepolia } from 'wagmi/chains';

// Define custom chains
export const tiaSepolia = {
  id: 1329,
  name: 'Tia Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.tia.sepolia.io'], // Replace with actual RPC URL
    },
  },
  blockExplorers: {
    default: {
      name: 'Tia Explorer',
      url: 'https://explorer.tia.sepolia.io',
    },
  },
  testnet: true,
} as const;



// Define Mantle chains
export const mantleSepolia = {
  id: 5003,
  name: 'Mantle Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia.mantle.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mantle Sepolia Explorer',
      url: 'https://explorer.sepolia.mantle.xyz',
    },
  },
  testnet: true,
} as const;

export const mantleMainnet = {
  id: 5000,
  name: 'Mantle Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.mantle.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mantle Explorer',
      url: 'https://explorer.mantle.xyz',
    },
  },
  testnet: false,
} as const;

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

// Create connectors with SSR-safe configuration
const connectors = typeof window !== 'undefined' 
  ? [
      injected(), // MetaMask and other injected wallets
      walletConnect({
        projectId: projectId, // Using your real WalletConnect project ID
        qrModalOptions: {
          themeMode: 'light',
        },
        showQrModal: true,
      })
    ]
  : [injected()];

export const config = createConfig({
  chains: [mantleSepolia, mantleMainnet, mainnet, sepolia, tiaSepolia],
  connectors,
  transports: {
    [mantleSepolia.id]: http(),
    [mantleMainnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [tiaSepolia.id]: http(),
  },
  ssr: true,
});

export const SUPPORTED_TOKENS: Record<number, Array<{
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl: string;
}>> = {
  [mantleSepolia.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    },
    {
      address: '0x4300000000000000000000000000000000000003',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logoUrl: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    },
    {
      address: '0x3c3a81e81dc49A522A592e7622A7E711c06bf354',
      symbol: 'MNT',
      name: 'Mantle',
      decimals: 18,
      logoUrl: 'https://assets.coingecko.com/coins/images/30980/small/token-logo.png',
    },
  ],
  [mantleMainnet.id]: [
    {
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: 18,
      logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    },
    {
      address: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logoUrl: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    },
    {
      address: '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8',
      symbol: 'MNT',
      name: 'Mantle',
      decimals: 18,
      logoUrl: 'https://assets.coingecko.com/coins/images/30980/small/token-logo.png',
    },
  ],
};

export const CONTRACT_ADDRESSES: Record<number, `0x${string}` | undefined> = {
  5003: '0x9A2478962cC59f0A606D536937883cE5845eA400', // Mantle Sepolia Testnet - Ezpay Contract
  5000: undefined, // Mantle Mainnet - Not deployed yet

};