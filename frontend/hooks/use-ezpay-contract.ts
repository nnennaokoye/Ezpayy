'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { EZPAY_CONTRACT_ADDRESS, EZPAY_ABI } from '@/lib/contract'
import { parseEther, type Address } from 'viem'

export type PayAuthorization = {
  receiver: Address
  token: Address
  chainId: bigint
  contractAddress: Address
  signature: `0x${string}`
}

export function useEzpayContract() {
  const { writeContract, data: hash, error, isPending } = useWriteContract()

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  // Create a new bill
  const createBill = async (billId: string, token: Address, amount: string) => {
    const amountWei = token === '0x0000000000000000000000000000000000000000' 
      ? parseEther(amount) 
      : BigInt(amount)

    return writeContract({
      address: EZPAY_CONTRACT_ADDRESS,
      abi: EZPAY_ABI,
      functionName: 'createBill',
      args: [billId as `0x${string}`, token, amountWei],
    })
  }

  // Pay a bill
  const payBill = async (billId: string, amount?: string) => {
    return writeContract({
      address: EZPAY_CONTRACT_ADDRESS,
      abi: EZPAY_ABI,
      functionName: 'payBill',
      args: [billId as `0x${string}`],
      value: amount ? parseEther(amount) : undefined,
    })
  }

  // Dynamic ETH payment (payer pays gas)
  const payDynamicETH = async (auth: PayAuthorization, amountEth: string) => {
    return writeContract({
      address: EZPAY_CONTRACT_ADDRESS,
      abi: EZPAY_ABI,
      functionName: 'payDynamicETH',
      args: [auth],
      value: parseEther(amountEth),
    })
  }

  return {
    createBill,
    payBill,
    payDynamicETH,
    hash,
    error,
    isPending,
    isConfirming,
    isConfirmed,
  }
}

// Hook to read bill details
export function useBillDetails(billId: string) {
  return useReadContract({
    address: EZPAY_CONTRACT_ADDRESS,
    abi: EZPAY_ABI,
    functionName: 'getBill',
    args: [billId as `0x${string}`],
    query: {
      enabled: !!billId,
    },
  })
}

// Hook to check bill status
export function useBillStatus(billId: string) {
  return useReadContract({
    address: EZPAY_CONTRACT_ADDRESS,
    abi: EZPAY_ABI,
    functionName: 'billStatus',
    args: [billId as `0x${string}`],
    query: {
      enabled: !!billId,
    },
  })
}

// Hook to get user's bills
export function useUserBills(userAddress: Address) {
  return useReadContract({
    address: EZPAY_CONTRACT_ADDRESS,
    abi: EZPAY_ABI,
    functionName: 'getUserBills',
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    },
  })
}

// Hook to generate bill ID
export function useGenerateBillId(userAddress: Address, nonce: bigint) {
  return useReadContract({
    address: EZPAY_CONTRACT_ADDRESS,
    abi: EZPAY_ABI,
    functionName: 'generateBillId',
    args: [userAddress, nonce],
    query: {
      enabled: !!userAddress && nonce !== undefined,
    },
  })
}

// Hook to get user nonce
export function useUserNonce(userAddress: Address) {
  return useReadContract({
    address: EZPAY_CONTRACT_ADDRESS,
    abi: EZPAY_ABI,
    functionName: 'getNonce',
    args: [userAddress],
    query: {
      enabled: !!userAddress,
    },
  })
}

// Hook to get contract stats
export function useContractStats() {
  const { data: totalBills } = useReadContract({
    address: EZPAY_CONTRACT_ADDRESS,
    abi: EZPAY_ABI,
    functionName: 'totalBills',
  })

  const { data: totalPaidBills } = useReadContract({
    address: EZPAY_CONTRACT_ADDRESS,
    abi: EZPAY_ABI,
    functionName: 'totalPaidBills',
  })

  return {
    totalBills: totalBills ? Number(totalBills) : 0,
    totalPaidBills: totalPaidBills ? Number(totalPaidBills) : 0,
    successRate: totalBills && totalPaidBills 
      ? (Number(totalPaidBills) / Number(totalBills)) * 100 
      : 0,
  }
}
