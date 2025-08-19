export const runtime = 'nodejs'; // Force Node.js runtime to access all env vars

import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http, Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantleSepolia, mantleMainnet } from '../../../lib/wagmi';

// ERC20 ABI for approve function
const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

// Get sponsor wallet from environment
const getSponsorWallet = () => {
  const sponsorPK = process.env.PK_SPONSOR;
  console.log('Approve API - PK_SPONSOR exists:', !!sponsorPK);
  
  if (!sponsorPK) {
    throw new Error('Sponsor private key not configured');
  }
  
  // Ensure private key is properly formatted
  let formattedPK = sponsorPK.trim();
  if (!formattedPK.startsWith('0x')) {
    formattedPK = '0x' + formattedPK;
  }
  
  // Validate private key length (should be 66 characters including 0x)
  if (formattedPK.length !== 66) {
    throw new Error(`Invalid private key length: expected 66 characters, got ${formattedPK.length}`);
  }
  
  return privateKeyToAccount(formattedPK as `0x${string}`);
};

// Get chain configuration
const getChainConfig = (chainId: number) => {
  switch (chainId) {
    case 5003:
      return mantleSepolia;
    case 5000:
      return mantleMainnet;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Gasless approve request:', JSON.stringify(body, null, 2));
    
    // Validate request
    if (!body.tokenAddress || !body.amount || !body.userAddress || !body.contractAddress || !body.chainId || !body.authorization) {
      console.log('Missing required fields:', {
        tokenAddress: !!body.tokenAddress,
        amount: !!body.amount,
        userAddress: !!body.userAddress,
        contractAddress: !!body.contractAddress,
        chainId: !!body.chainId,
        authorization: !!body.authorization
      });
      return NextResponse.json(
        { success: false, error: 'Missing required fields including authorization' },
        { status: 400 }
      );
    }

    const chain = getChainConfig(body.chainId);
    const sponsorAccount = getSponsorWallet();

    // Create clients
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    const walletClient = createWalletClient({
      account: sponsorAccount,
      chain,
      transport: http(),
    });

    // Check current allowance first
    const currentAllowance = await publicClient.readContract({
      address: body.tokenAddress as Address,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [body.userAddress as Address, body.contractAddress as Address],
    }) as bigint;

    console.log('Current allowance:', currentAllowance.toString());
    console.log('Required amount:', body.amount);

    // If allowance is already sufficient, no need to approve
    if (currentAllowance >= BigInt(body.amount)) {
      return NextResponse.json({
        success: true,
        message: 'Sufficient allowance already exists',
        txHash: null,
        currentAllowance: currentAllowance.toString(),
      });
    }

    // For now, return instructions for user to approve manually
    // This is the most practical approach until we implement permit-based approvals
    return NextResponse.json({
      success: false,
      error: 'Approval required',
      message: 'User needs to approve token spending first',
      instructions: {
        action: 'approve',
        tokenAddress: body.tokenAddress,
        spender: body.contractAddress,
        amount: body.amount,
        currentAllowance: currentAllowance.toString()
      }
    });

  } catch (error) {
    console.error('Gasless approve API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Gasless Approve API',
    available: !!(process.env.PK_SPONSOR),
    note: 'This endpoint checks token allowances for gasless payments',
    timestamp: new Date().toISOString()
  });
}
