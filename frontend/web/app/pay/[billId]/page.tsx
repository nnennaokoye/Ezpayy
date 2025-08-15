'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSignMessage, useSignTypedData } from 'wagmi';
import { Button, Card } from 'ui';
import QRCode from 'react-qr-code';
import { formatUnits, parseUnits, Address, createPublicClient, http, keccak256, encodeAbiParameters, recoverTypedDataAddress, recoverMessageAddress } from 'viem';
import { CheckCircle, Clock, AlertCircle, Copy, Wallet, Zap, Shield } from 'lucide-react';
import { SUPPORTED_TOKENS, mantleSepolia, mantleMainnet, CONTRACT_ADDRESSES } from '../../../lib/wagmi';
import { EZPAY_ABI } from '../../../lib/abi';
import { NetworkBadge } from '../../../components/NetworkAlert';
import { NetworkAlert, useNetworkAlert } from '../../../components/NetworkAlert';
import { useNetworkGuard } from '../../../hooks/useNetworkGuard';
import { formatAddress, formatAmount } from 'ui';
import { toast } from 'react-hot-toast';

interface Bill {
  receiver: Address;
  token: Address;
  amount: bigint;
  paid: boolean;
  createdAt: bigint;
  paidAt: bigint;
  payer: Address;
}

export default function PaymentPage() {
  const params = useParams();
  const billIdParam = (params?.billId as string) || '';
  const billId = billIdParam as string;
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const walletConnected = mounted && isConnected && Boolean(address);
  const {
    checkNetwork,
    canProceed,
    currentChainId,
    shouldShowAlert,
    isWrongNetwork,
    showNetworkWarning
  } = useNetworkAlert();
  const { ensureNetwork, switchToMantle } = useNetworkGuard();
  
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'normal' | 'gasless'>('normal');
  const [isGaslessProcessing, setIsGaslessProcessing] = useState(false);
  const [hasAutoSwitched, setHasAutoSwitched] = useState(false);
  const { signMessageAsync } = useSignMessage();
  const { signTypedDataAsync } = useSignTypedData();

  const contractAddress = CONTRACT_ADDRESSES[currentChainId];
  const tokens = SUPPORTED_TOKENS[currentChainId] || [];
  const ERC20_ABI = [
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
      name: 'decimals',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ name: '', type: 'uint8' }],
    },
    {
      name: 'symbol',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ name: '', type: 'string' }],
    },
  ] as const;

  // ✅ Auto-check network and attempt automatic switch (Pay page only)
  useEffect(() => {
    const autoSwitchOnPayPage = async () => {
      // Call checkNetwork first
      const isCorrect = checkNetwork();
      
      if (!isCorrect && isConnected && !hasAutoSwitched) {
        console.log('Wrong network detected on pay page, attempting auto-switch...');
        setHasAutoSwitched(true);
        
        try {
          await switchToMantle();
        } catch (error) {
          console.log('Auto-switch failed:', error);
          showNetworkWarning();
        }
      }
    };

    autoSwitchOnPayPage();
  }, [checkNetwork, isConnected, hasAutoSwitched, switchToMantle, showNetworkWarning]);

  // Read bill data
  // Validate billId to avoid invalid contract calls
  const isValidBillId = /^0x[0-9a-fA-F]{64}$/.test(billId);
  const shouldQuery = Boolean(contractAddress && isValidBillId);

  const { data: billData, isLoading, refetch } = useReadContract({
    address: contractAddress as Address,
    abi: EZPAY_ABI,
    functionName: 'getBill',
    args: [billId as `0x${string}`],
    query: { enabled: shouldQuery },
  }) as { data: Bill | undefined, isLoading: boolean, refetch: () => void };

  // Normal payment transaction
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  // Refetch bill data when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      refetch();
    }
  }, [isConfirmed, refetch]);

  const token = billData ? tokens.find(t => t.address.toLowerCase() === billData.token.toLowerCase()) : null;
  // Fallback ERC20 metadata when token not in list
  const { data: erc20Decimals } = useReadContract({
    address: billData && billData.token !== '0x0000000000000000000000000000000000000000' && !token ? (billData.token as Address) : undefined,
    abi: ERC20_ABI,
    functionName: 'decimals',
  }) as { data: number | undefined };
  const { data: erc20Symbol } = useReadContract({
    address: billData && billData.token !== '0x0000000000000000000000000000000000000000' && !token ? (billData.token as Address) : undefined,
    abi: ERC20_ABI,
    functionName: 'symbol',
  }) as { data: string | undefined };
  
  const canPay = Boolean(billData && !billData.paid && walletConnected && canProceed);

  // Read current allowance for ERC20
  const erc20AddressForAllowance = billData && billData.token !== '0x0000000000000000000000000000000000000000'
    ? (billData.token as Address)
    : undefined;
  const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
    address: erc20AddressForAllowance,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: billData && address && contractAddress ? [address as Address, contractAddress as Address] : undefined,
    query: { enabled: Boolean(billData && address && contractAddress && erc20AddressForAllowance) },
  }) as { data: bigint | undefined; refetch: () => void };

  const decimalsForDisplay = token?.decimals ?? erc20Decimals ?? 18;
  const symbolForDisplay = token?.symbol ?? erc20Symbol ?? 'TOKEN';
  const needsApproval = !!(billData && erc20AddressForAllowance && (currentAllowance ?? 0n) < billData.amount);

  // ✅ NETWORK ALERT: Normal payment handler with network validation
  const handleNormalPayment = async () => {
    if (!billData || !contractAddress) return;

    // Ensure network before proceeding
    const networkOk = await ensureNetwork();
    if (!networkOk) {
      toast.error('Please switch to Mantle L2 to continue', {
        duration: 4000,
        style: {
          background: '#FEF3C7',
          color: '#92400E',
          border: '1px solid #F59E0B',
        },
        icon: '⚠️',
      });
      return; // Early return if network check fails
    }

    try {
      if (billData.token === '0x0000000000000000000000000000000000000000') {
        // ETH payment
        writeContract({
          address: contractAddress as Address,
          abi: EZPAY_ABI,
          functionName: 'payBill',
          args: [billId as `0x${string}`],
          value: billData.amount,
        });
      } else {
        // ERC20 payment (would need approval first in production)
        writeContract({
          address: contractAddress as Address,
          abi: EZPAY_ABI,
          functionName: 'payBill',
          args: [billId as `0x${string}`],
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  // ✅ NETWORK ALERT: Gasless payment handler with network validation
  const handleGaslessPayment = async () => {
    if (!billData || !contractAddress || !address || !isConnected) return;
    if (token && needsApproval) {
      toast.error('Please approve the token first.');
      return;
    }
    // Ensure target contract has gasless support endpoints (getNonce or nonces mapping)
    let supportsGasless = true;
    try {
      const probeClient = createPublicClient({ chain: mantleSepolia, transport: http() });
      try {
        await probeClient.readContract({
          address: contractAddress as Address,
          abi: EZPAY_ABI,
          functionName: 'getNonce',
          args: [address],
        });
      } catch {
        try {
          await probeClient.readContract({
            address: contractAddress as Address,
            abi: EZPAY_ABI,
            functionName: 'nonces',
            args: [address],
          });
        } catch {
          supportsGasless = false;
        }
      }
    } catch {
      supportsGasless = false;
    }
    if (!supportsGasless) {
      toast.error('This contract version does not support gasless. Please use Standard Payment.');
      return;
    }

    // Ensure network before proceeding
    const networkOk = await ensureNetwork();
    if (!networkOk) {
      toast.error('Please switch to Mantle L2 to continue', {
        duration: 4000,
        style: {
          background: '#FEF3C7',
          color: '#92400E',
          border: '1px solid #F59E0B',
        },
        icon: '⚠️',
      });
      return; // Early return if network check fails
    }

    // Check if it's ETH payment
    if (billData.token === '0x0000000000000000000000000000000000000000') {
      toast.error(
        'Gasless payment is not available for ETH payments.\n\n' +
        'Due to blockchain limitations, we cannot pull ETH from your wallet.\n' +
        'Please use standard payment for ETH bills.\n\n' +
        'Gasless payment works great with ERC20 tokens!'
      );
      return;
    }

    setIsGaslessProcessing(true);
    try {
      // Get current nonce from contract
      const targetChain = currentChainId === mantleSepolia.id
        ? mantleSepolia
        : currentChainId === mantleMainnet.id
          ? mantleMainnet
          : mantleSepolia;
      const publicClient = createPublicClient({
        chain: targetChain,
        transport: http(),
      });

      // Try getNonce(user) then fallback to nonces(user) mapping
      let nonce: bigint;
      try {
        nonce = await publicClient.readContract({
          address: contractAddress as Address,
          abi: EZPAY_ABI,
          functionName: 'getNonce',
          args: [address],
        }) as bigint;
      } catch {
        nonce = await publicClient.readContract({
          address: contractAddress as Address,
          abi: EZPAY_ABI,
          functionName: 'nonces',
          args: [address],
        }) as bigint;
      }

      // Create authorization message
      const authMessage = {
        billId: billId as `0x${string}`,
        nonce: nonce,
        chainId: BigInt(currentChainId),
        contractAddress: contractAddress as Address,
      };

      // Try EIP-712 signature first (common for authorization patterns)
      let signature: `0x${string}`;
      let usedTypedData = false;
      try {
        signature = await signTypedDataAsync({
          domain: {
            name: 'Ezpay',
            version: '1',
            chainId: Number(currentChainId),
            verifyingContract: contractAddress as Address,
          },
          types: {
            Authorization: [
              { name: 'billId', type: 'bytes32' },
              { name: 'nonce', type: 'uint256' },
              { name: 'chainId', type: 'uint256' },
              { name: 'contractAddress', type: 'address' },
            ],
          },
          primaryType: 'Authorization',
          message: {
            billId: authMessage.billId,
            nonce: authMessage.nonce,
            chainId: authMessage.chainId,
            contractAddress: authMessage.contractAddress,
          },
        });
        usedTypedData = true;
      } catch {
        // Fallback to simple hash signing (raw)
        const messageHash = keccak256(
          encodeAbiParameters(
            [
              { name: 'billId', type: 'bytes32' },
              { name: 'nonce', type: 'uint256' },
              { name: 'chainId', type: 'uint256' },
              { name: 'contractAddress', type: 'address' }
            ],
            [authMessage.billId, authMessage.nonce, authMessage.chainId, authMessage.contractAddress]
          )
        );
        signature = await signMessageAsync({ message: { raw: messageHash } });
      }

      // Preflight: verify signature locally matches the authorizer
      try {
        let recovered: Address;
        if (usedTypedData) {
          recovered = await recoverTypedDataAddress({
            domain: {
              name: 'Ezpay',
              version: '1',
              chainId: Number(currentChainId),
              verifyingContract: contractAddress as Address,
            },
            types: {
              Authorization: [
                { name: 'billId', type: 'bytes32' },
                { name: 'nonce', type: 'uint256' },
                { name: 'chainId', type: 'uint256' },
                { name: 'contractAddress', type: 'address' },
              ],
            },
            primaryType: 'Authorization',
            message: {
              billId: authMessage.billId,
              nonce: authMessage.nonce,
              chainId: authMessage.chainId,
              contractAddress: authMessage.contractAddress,
            },
            signature,
          }) as Address;
        } else {
          const messageHash = keccak256(
            encodeAbiParameters(
              [
                { name: 'billId', type: 'bytes32' },
                { name: 'nonce', type: 'uint256' },
                { name: 'chainId', type: 'uint256' },
                { name: 'contractAddress', type: 'address' }
              ],
              [authMessage.billId, authMessage.nonce, authMessage.chainId, authMessage.contractAddress]
            )
          );
          recovered = await recoverMessageAddress({ message: { raw: messageHash }, signature }) as Address;
        }
        if (recovered.toLowerCase() !== address.toLowerCase()) {
          toast.error('Signature mismatch. Please retry or switch wallet.');
          return;
        }
      } catch (e) {
        console.warn('Local signature recovery failed', e);
      }

      // Prepare authorization object - convert BigInt to string for JSON
      const authorization = {
        authorizer: address,
        billId: authMessage.billId,
        nonce: authMessage.nonce.toString(), // Convert BigInt to string
        chainId: authMessage.chainId.toString(), // Convert BigInt to string
        contractAddress: authMessage.contractAddress,
        signature: signature,
      };

      // Send to gasless API
      const response = await fetch('/api/gasless-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billId,
          contractAddress,
          chainId: currentChainId,
          authorization,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Payment successful! Gas fees were covered by sponsor.');
        await refetch();
      } else {
        console.error('Gasless API error:', result.error);
        toast.error(result.error || 'Gasless payment failed');
      }
    } catch (error) {
      console.error('Gasless payment error:', error);
      toast.error(`Gasless payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGaslessProcessing(false);
    }
  };

  const { writeContract: writeApprove, isPending: isApprovePending, data: approveTxHash } = useWriteContract();
  const { isSuccess: isApproveConfirmed } = useWaitForTransactionReceipt({ hash: approveTxHash });

  useEffect(() => {
    if (isApproveConfirmed) {
      // Brief delay to allow node to index allowance
      setTimeout(() => {
        try { refetchAllowance(); } catch {}
      }, 800);
    }
  }, [isApproveConfirmed, refetchAllowance]);

  const handleApproveToken = async () => {
    if (!billData || !token || !address) return;
    try {
      // Approve the exact bill amount
      const approveAmount = billData.amount;
      await writeApprove({
        address: token.address as Address,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [contractAddress as Address, approveAmount],
      });
      toast.success('Approval transaction sent. Once confirmed, you can proceed with gasless payment.');
    } catch (e) {
      console.error('Approve error:', e);
      toast.error('Approve failed. Please try again.');
    }
  };

  const copyBillId = async () => {
    await navigator.clipboard.writeText(billId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (!isValidBillId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Invalid Payment Link</h1>
          <p className="text-muted-foreground">The bill id format is incorrect.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-responsive">Loading bill details...</p>
        </div>
      </div>
    );
  }

  if (!billData || billData.receiver === '0x0000000000000000000000000000000000000000') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Bill Not Found</h1>
          <p className="text-muted-foreground">
            The payment bill with ID "{billId}" could not be found.
          </p>
        </div>
      </div>
    );
  }

  if (isConfirmed || billData.paid) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center animate-fade-in">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-8">
            The bill has been paid successfully.
          </p>

          <Card className="p-6 text-left card-hover">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Payment Receipt
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bill ID:</span>
                <span className="font-mono text-xs break-all">{billId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold text-green-600">
                  {formatAmount(billData.amount, token?.decimals || 18)} {token?.symbol || 'ETH'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Receiver:</span>
                <span className="font-mono">{formatAddress(billData.receiver)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid By:</span>
                <span className="font-mono">{formatAddress(billData.payer)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid At:</span>
                <span>{new Date(Number(billData.paidAt) * 1000).toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 safe-top safe-bottom relative">
      <div className="pointer-events-none select-none absolute -z-10 inset-0 opacity-25">
        <div className="absolute right-0 top-24 hidden md:block">
          <img src="/payment.svg" alt="payment" className="w-40 h-40 float-animation" />
        </div>
      </div>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-primary bg-clip-text text-transparent">
            Payment Request
          </h1>
          <p className="text-muted-foreground text-responsive">
            Review the details and complete the payment.
          </p>
          <div className="mt-4 flex justify-center">
            <NetworkBadge />
          </div>
        </div>

        {/* ✅ Network Alert - Show warning if wrong network with auto-attempt info */}
        {shouldShowAlert && (
          <div className="mb-6">
            <NetworkAlert showButton={true} />
            {hasAutoSwitched && (
              <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 text-center">
                Auto-switch attempted. Please manually switch if needed.
              </div>
            )}
          </div>
        )}

        {/* Bill Status Badge */}
        <div className="flex justify-center mb-6">
          {billData.paid ? (
            <div className="status-success px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Paid
            </div>
          ) : (
            <div className="status-warning px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Payment
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Bill Details */}
          <Card className="p-6 card-hover glass">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              Bill Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground font-medium">Bill ID</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs bg-muted px-2 py-1 rounded flex-1 break-all">
                    {billId}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyBillId}
                    className="h-8 w-8 tap-target"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground font-medium">Receiver</label>
                <p className="mt-1 font-mono text-sm">{formatAddress(billData.receiver)}</p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground font-medium">Created At</label>
                <p className="mt-1">{new Date(Number(billData.createdAt) * 1000).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          {/* Payment Info */}
          <Card className="p-6 card-hover glass">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-green-500" />
              Payment Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground font-medium">Token</label>
                <div className="flex items-center gap-2 mt-1">
                  {token?.logoUrl && (
                    <img src={token.logoUrl} alt={token.symbol} className="h-6 w-6 rounded-full" />
                  )}
                  <span className="font-medium">{token?.name || 'Ethereum'}</span>
                  <span className="text-muted-foreground">({token?.symbol || 'ETH'})</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground font-medium">Amount</label>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {formatAmount(billData.amount, token?.decimals || 18)} {token?.symbol || 'ETH'}
                </p>
              </div>

              {/* Payment Method Selection */}
              {walletConnected && canProceed && (
                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground font-medium">Payment Method</label>
                  
                  {/* Gasless Payment Option */}
                  <div 
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      billData?.token === '0x0000000000000000000000000000000000000000'
                        ? 'opacity-50 cursor-not-allowed border-gray-300'
                        : paymentMethod === 'gasless' 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                          : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => {
                      if (billData?.token !== '0x0000000000000000000000000000000000000000') {
                        setPaymentMethod('gasless');
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'gasless'}
                        onChange={() => setPaymentMethod('gasless')}
                        className="text-green-600"
                        disabled={billData?.token === '0x0000000000000000000000000000000000000000'}
                      />
                      <Zap className="h-5 w-5 text-green-500" />
                      <div className="flex-1">
                        <div className="font-medium text-green-700 dark:text-green-400">
                          Gasless Payment {billData?.token === '0x0000000000000000000000000000000000000000' ? '(Not Available)' : '(Recommended)'}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-500">
                          {billData?.token === '0x0000000000000000000000000000000000000000' 
                            ? 'ETH payments require gas fees • Use tokens for gasless'
                            : 'Zero gas fees • Network validated automatically'}
                        </div>
                      </div>
                      <div className="status-success px-2 py-1 rounded text-xs font-medium">
                        {billData?.token === '0x0000000000000000000000000000000000000000' ? 'N/A' : 'FREE GAS'}
                      </div>
                    </div>
                  </div>

                  {/* Normal Payment Option */}
                  <div 
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === 'normal' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setPaymentMethod('normal')}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'normal'}
                        onChange={() => setPaymentMethod('normal')}
                        className="text-blue-600"
                      />
                      <Wallet className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <div className="font-medium text-blue-700 dark:text-blue-400">
                          Standard Payment
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-500">
                          You pay everything • Bill + gas fees • Network protected
                        </div>
                      </div>
                      <div className="text-xs text-blue-600 font-medium">
                        STANDARD
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Approval Required Notice for Gasless ERC20 */}
              {paymentMethod === 'gasless' && token && needsApproval && (
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-orange-800 dark:text-orange-200">
                        Token Approval Required
                      </div>
                      <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                        First approve {symbolForDisplay} spending, then proceed with gasless payment.
                      </div>
                      <Button
                        onClick={handleApproveToken}
                        disabled={isApprovePending}
                        size="sm"
                        className="mt-2"
                        variant="outline"
                      >
                        {isApprovePending ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                            Approving...
                          </>
                        ) : (
                          `Approve ${symbolForDisplay}`
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Pay Button */}
              {walletConnected && canProceed ? (
                <Button
                  onClick={paymentMethod === 'gasless' ? handleGaslessPayment : handleNormalPayment}
                  disabled={!canPay || (isPending ?? false) || (isConfirming ?? false) || isGaslessProcessing || (paymentMethod === 'gasless' && token && needsApproval)}
                  className="w-full tap-target btn-animate"
                  size="lg"
                  variant={canPay ? "default" : "secondary"}
                >
                  {isPending || isConfirming || isGaslessProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isPending || isGaslessProcessing ? 'Processing...' : 'Confirming...'}
                    </>
                  ) : billData.paid ? (
                    'Already Paid'
                  ) : !canProceed ? (
                    'Switch to Mantle L2 First'
                  ) : paymentMethod === 'gasless' ? (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Pay with Zero Gas
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 mr-2" />
                      Pay Now
                    </>
                  )}
                </Button>
              ) : (
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Connect your wallet to make the payment
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ✅ Network warning if unable to view bill */}
        {isWrongNetwork && (
          <Card className="p-4 text-center bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 mb-6">
            <div className="text-orange-800 dark:text-orange-200">
              <span className="text-lg">⚠️</span>
              <p className="text-sm font-medium mt-2">
                Please switch to Mantle L2 to view payment details and make payments
              </p>
            </div>
          </Card>
        )}

        {/* QR Code for sharing */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-4">Share Payment Link</h3>
          <Card className="p-6 inline-block">
            <QRCode value={shareUrl} size={200} />
            <p className="mt-4 text-sm text-muted-foreground">
              Scan QR code to open this payment page
            </p>
          </Card>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <Card className="p-4 card-hover">
            <Zap className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Zero Gas Fees</h3>
            <p className="text-xs text-muted-foreground">
              Pay ERC20 tokens without gas costs
            </p>
          </Card>
          <Card className="p-4 card-hover">
            <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Network Protected</h3>
            <p className="text-xs text-muted-foreground">
              Automatic validation on Mantle L2
            </p>
          </Card>
          <Card className="p-4 card-hover">
            <CheckCircle className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Instant Settlement</h3>
            <p className="text-xs text-muted-foreground">
              Immediate payment confirmation
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}