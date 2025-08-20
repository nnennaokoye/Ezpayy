import { NextResponse } from 'next/server'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { MANTLE_SEPOLIA, EZPAY_CONTRACT_ADDRESS, EZPAY_ABI } from '@/lib/contract'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { auth: authIn, permit: permitIn } = body || {}

    if (!process.env.SPONSOR_PK) {
      return NextResponse.json({ error: 'Server misconfigured: missing SPONSOR_PK' }, { status: 500 })
    }

    // Basic validation
    if (!authIn || !permitIn) {
      return NextResponse.json({ error: 'Missing auth or permit' }, { status: 400 })
    }

    const auth = {
      receiver: authIn.receiver as `0x${string}`,
      token: authIn.token as `0x${string}`,
      chainId: BigInt(authIn.chainId),
      contractAddress: authIn.contractAddress as `0x${string}`,
      signature: authIn.signature as `0x${string}`,
    }

    if (auth.contractAddress?.toLowerCase() !== EZPAY_CONTRACT_ADDRESS.toLowerCase()) {
      return NextResponse.json({ error: 'Invalid contract address' }, { status: 400 })
    }
    if (Number(auth.chainId) !== MANTLE_SEPOLIA.id) {
      return NextResponse.json({ error: 'Unsupported chainId' }, { status: 400 })
    }

    const permit = {
      owner: permitIn.owner as `0x${string}`,
      token: permitIn.token as `0x${string}`,
      value: BigInt(permitIn.value),
      deadline: BigInt(permitIn.deadline),
      v: Number(permitIn.v),
      r: permitIn.r as `0x${string}`,
      s: permitIn.s as `0x${string}`,
    }

    const account = privateKeyToAccount(process.env.SPONSOR_PK as `0x${string}`)
    const rpcUrl = process.env.RPC_URL || 'https://rpc.sepolia.mantle.xyz'
    const walletClient = createWalletClient({
      account,
      chain: MANTLE_SEPOLIA as any,
      transport: http(rpcUrl),
    })

    // Call Ezpay.payDynamicERC20WithPermit(auth, permit)
    const hash = await walletClient.writeContract({
      chain: MANTLE_SEPOLIA as any,
      account,
      address: EZPAY_CONTRACT_ADDRESS,
      abi: EZPAY_ABI as any,
      functionName: 'payDynamicERC20WithPermit',
      args: [auth, permit],
    })

    return NextResponse.json({ hash })
  } catch (e: any) {
    console.error('gasless-payment error:', e)
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
