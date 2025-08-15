import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mantleSepolia, mantleMainnet } from './wagmi'

// Get projectId from environment variables
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set')
}

// Set up the Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  networks: [mantleSepolia, mantleMainnet], 
  projectId
})

// Set up metadata
const metadata = {
  name: 'Ezpay',
  description: 'Ezpay - Create and pay bills with zero gas fees on Mantle',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://ezpay-mantle.vercel.app',
  icons: [typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : 'https://ezpay-mantle.vercel.app/favicon.ico']
}

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mantleSepolia, mantleMainnet], 
  defaultNetwork: mantleSepolia,
  metadata,
  features: {
    analytics: true,
    email: false,
    socials: [],
    onramp: false,
    swaps: false,
    history: false,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': '#00D2FF',
    '--w3m-color-mix-strength': 20,
    '--w3m-accent': '#00D2FF',
    '--w3m-border-radius-master': '12px'
  }
})

export const config = wagmiAdapter.wagmiConfig
