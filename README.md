# Ezpay – Mantle Payment dApp

Create and receive QR-based payments on Mantle Sepolia with gasless ERC‑20 support.

## Requirements
- Node 18+
- WalletConnect Project ID
- A funded sponsor private key for the relayer (used server-side for ERC‑20 Permit flow)

## Setup
1) Frontend env: `frontend/.env.local`
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   RPC_URL=https://rpc.sepolia.mantle.xyz
   SPONSOR_PK=0xyour_private_key_for_sponsoring_gas

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
  # optional (local mocks): node scripts/deploy-mockusdc.js

## Contract (Mantle Sepolia)
- ChainId: 5003
- Explorer: https://explorer.sepolia.mantle.xyz
- Ezpay: 0xc0C6F54f2256D2ED46aBdB84053Fa0cF549Bb8a4
- Tokens:
  USDC 0xC46ba842bAD10aAeB501667A80D39EE09BB62A7d
  USDT 0x9c5C8F3ad18b8D1D32Ea803Aa09A6beA077e9471
  WETH 0xAC8F7169CE823c86b3411dCD36576dA3f1B82710

## Notes
- Gasless ERC‑20 uses EIP‑2612 Permit + a server relayer at `frontend/app/api/gasless-payment/route.ts` (sponsor pays gas).
- Native MNT/ETH payments use a regular transaction to `payDynamicETH` (payer covers gas; you can still use QR for easy UX).
- Chainlink Automation is used to expire unpaid bills: `checkUpkeep`/`performUpkeep` are implemented in `contract/contracts/Ezpay.sol`.
- Network config and addresses: `frontend/lib/contract.ts`.

## Quick Guide 
1) Open merchant dashboard: run web app, go to `/merchant`.
2) Create request: choose token (USDC/USDT/WETH), set optional amount/description, generate QR/link.
3) Share: customer scans QR or opens the link (it encodes receiver, token, chainId, contract, and signature).
4) Pay:
   - ERC‑20: client builds an EIP‑2612 Permit; the server relayer calls `payDynamicERC20WithPermit` and pays the gas.
   - ETH/MNT (native): customer sends a normal tx to `payDynamicETH` with the desired amount.
5) Confirm: view tx on Mantle Sepolia explorer; merchant history auto-updates in `/merchant`.

## Troubleshooting
- Ensure `SPONSOR_PK` is set and funded on Mantle Sepolia; the relayer will pay gas for ERC‑20 permit payments.
- Confirm `RPC_URL` is reachable and points to Mantle Sepolia.
- Ensure `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set for wallet connections.
- Use Node 18+; reinstall deps if build fails.
- Chainlink Automation demo scripts: `contract/scripts/encode-upkeep-data.js`, `check-upkeep.js`, `perform-upkeep.js`.
