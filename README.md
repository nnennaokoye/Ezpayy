# Ezpay – Mantle L2 Payment dApp

Create and receive QR-based payments on Mantle Sepolia with gasless ERC‑20 support.

## Requirements
- Node 18+
- WalletConnect Project ID
- Pimlico API key (for ERC-4337 gasless ERC-20)

## Setup
1) Frontend env: `frontend/.env.local`
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   USE_PIMLICO=true
   NEXT_PUBLIC_USE_PIMLICO=true
   PIMLICO_API_KEY=your_pimlico_api_key
   NEXT_PUBLIC_PIMLICO_BUNDLER_URL=https://api.pimlico.io/v2/5003/rpc?apikey=${PIMLICO_API_KEY}
   NEXT_PUBLIC_PIMLICO_PAYMASTER_URL=https://api.pimlico.io/v2/5003/rpc?apikey=${PIMLICO_API_KEY}
   RPC_URL=https://rpc.sepolia.mantle.xyz

2) Contracts env: contract/.env
   PRIVATE_KEY=deployer_key_without_0x
   MANTLE_SEPOLIA_RPC_URL=https://rpc.sepolia.mantle.xyz

## Run
- Web (Next.js):
  cd frontend
  npm run dev

- Contracts (Hardhat):
  cd contract
  npm run build
  npm run test
  # optional: node scripts/deploy-mockusdc.js

## Contract (Mantle Sepolia)
- ChainId: 5003
- Explorer: https://explorer.sepolia.mantle.xyz
- Ezpay: 0x407faeC3bFF9192Ef9a48444b8E1155950fD4c5C
- Tokens:
  USDC 0xC46ba842bAD10aAeB501667A80D39EE09BB62A7d
  USDT 0x9c5C8F3ad18b8D1D32Ea803Aa09A6beA077e9471
  WETH 0xAC8F7169CE823c86b3411dCD36576dA3f1B82710

## Notes
- Gasless ERC-20 and native MNT use Pimlico ERC-4337 (no MNT needed for end users).
- Legacy sponsor flow has been fully removed; only Pimlico AA is supported.
- Network config and addresses: `frontend/lib/contract.ts`.

## Quick Guide (5 steps)
1) Open merchant dashboard: run web app, go to `/merchant`.
2) Create request: choose token (MNT/USDC/USDT/WETH), set optional amount/description, generate QR/link.
3) Share: customer scans QR or opens the link (it encodes receiver, token, chainId, contract, and signature).
4) Pay:
   - ERC‑20: client builds EIP‑2612 Permit and submits an ERC‑4337 UserOperation to call `payDynamicERC20WithPermit` via Pimlico bundler/paymaster (sponsored gas).
   - MNT (native): client submits an ERC‑4337 UserOperation that calls `payDynamicETH` via Pimlico (sponsored gas).
5) Confirm: view tx on Mantle Sepolia explorer; merchant history auto-updates in `/merchant`.

## Troubleshooting
- Ensure `USE_PIMLICO=true` and `NEXT_PUBLIC_USE_PIMLICO=true` for AA path.
- Set `NEXT_PUBLIC_PIMLICO_*` (or `PIMLICO_*`) URLs with your Pimlico key.
- Use Node 18+; reinstall deps if build fails.
- If AA user operation sponsorship fails, verify your Pimlico key, URLs, and Mantle Sepolia network health.