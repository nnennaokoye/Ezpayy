'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Button, Card, Input, TokenSelect } from 'ui';
import { parseUnits, keccak256, toBytes } from 'viem';
import { PlusCircle, QrCode, Copy, Zap, Wallet, Shield, Grid3X3, Eye, Trash2, ExternalLink, Calendar, DollarSign, Users, TrendingUp } from 'lucide-react';
import { SUPPORTED_TOKENS, CONTRACT_ADDRESSES } from '../../lib/wagmi';
import { NetworkAlert, useNetworkAlert } from '../../components/NetworkAlert';
import { useNetworkGuard } from '../../hooks/useNetworkGuard';
import { toast } from 'react-hot-toast';

type StoredBill = {
  id: string;
  receiver: string;
  token: string;
  amount: string;
  createdAt: number;
  txHash?: string;
};

export default function CreateBillPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { 
    checkNetwork,
    canProceed, 
    currentChainId,
    shouldShowAlert 
  } = useNetworkAlert();
  const { ensureNetwork } = useNetworkGuard();
  
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [billId, setBillId] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [txHash, setTxHash] = useState<string>('');
  const [isDashboard, setIsDashboard] = useState(true);
  const [bills, setBills] = useState<StoredBill[]>([]);

  const tokens = SUPPORTED_TOKENS[currentChainId] || [];

  // ✅ Call checkNetwork() on mount
  useEffect(() => {
    checkNetwork();
  }, [checkNetwork]);

  // Default to ETH
  useEffect(() => {
    if (tokens.length > 0 && !selectedToken) {
      setSelectedToken(tokens[0].address);
    }
  }, [tokens, selectedToken]);

  // Load bills for dashboard (always run, not conditionally)
  useEffect(() => {
    if (isDashboard && address) {
      try {
        const storageKey = `ezpay:bills:${address}`;
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]') as StoredBill[];
        setBills(existing);
      } catch {}
    }
  }, [isDashboard, address]);

  const selectedTokenData = tokens.find(t => t.address === selectedToken);
  const canCreate = receiver && amount && selectedToken && isConnected && canProceed;

  const generateBillId = (receiver: string, token: string, amount: string) => {
    const data = `${receiver}-${token}-${amount}-${Date.now()}`;
    return keccak256(toBytes(data));
  };

  const handleCreateBill = async () => {
    if (!canCreate || !selectedTokenData) return;

    // ✅ NETWORK ALERT: Ensure correct network before proceeding
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

    setIsCreating(true);
    try {
      const amountWei = parseUnits(amount, selectedTokenData.decimals);
      const newBillId = generateBillId(receiver, selectedToken, amount);
      
      setBillId(newBillId);

      // Use gasless API with validated network
      const contractAddress = CONTRACT_ADDRESSES[currentChainId];
      
      if (!contractAddress) {
        throw new Error(`Contract not deployed on chain ${currentChainId}`);
      }

      const response = await fetch('/api/gasless-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billId: newBillId,
          token: selectedToken,
          amount: amountWei.toString(),
          contractAddress: contractAddress,
          chainId: currentChainId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setTxHash(result.txHash);
        const url = `${window.location.origin}/pay/${newBillId}`;
        setPaymentUrl(url);
        toast.success('Bill created successfully!');

        // Store created bill to localStorage for dashboard listing
        try {
          const storageKey = `ezpay:bills:${address}`;
          const previous = JSON.parse(localStorage.getItem(storageKey) || '[]') as StoredBill[];
          const newStored: StoredBill = {
            id: newBillId,
            receiver,
            token: selectedToken,
            amount,
            createdAt: Date.now(),
            txHash: result.txHash,
          };
          const updated = [newStored, ...previous];
          localStorage.setItem(storageKey, JSON.stringify(updated));
          setBills(updated);
        } catch {}
      } else {
        throw new Error(result.error || 'Failed to create bill');
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error(`Failed to create bill: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCreating(false);
    }
  };

  const copyPaymentUrl = async () => {
    if (paymentUrl) {
      await navigator.clipboard.writeText(paymentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setReceiver('');
    setAmount('');
    setBillId('');
    setPaymentUrl('');
    setTxHash('');
    setCopied(false);
    setIsCreating(false);
    setIsDashboard(true);
  };

  // Helper functions for dashboard
  const totalAmount = bills.reduce((sum, bill) => {
    const tokenData = tokens.find(t => t.address === bill.token);
    return sum + parseFloat(bill.amount);
  }, 0);

  const deleteBill = (billId: string) => {
    try {
      const storageKey = `ezpay:bills:${address}`;
      const updated = bills.filter(b => b.id !== billId);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setBills(updated);
      toast.success('Bill deleted successfully');
    } catch {
      toast.error('Failed to delete bill');
    }
  };

  // Dashboard mode: show CTA and list of bills
  if (isDashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Grid3X3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Merchant Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground">Manage your payment bills with ease</p>
                </div>
              </div>
              <Button 
                onClick={() => setIsDashboard(false)} 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Create New Bill
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Bills</p>
                  <p className="text-3xl font-bold">{bills.length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Value</p>
                  <p className="text-3xl font-bold">{totalAmount.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">This Month</p>
                  <p className="text-3xl font-bold">
                    {bills.filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Active</p>
                  <p className="text-3xl font-bold">{bills.length}</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </div>

          {/* Bills Table */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Payment Bills</h2>
                  <p className="text-sm text-muted-foreground">Manage and track all your payment requests</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {bills.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCode className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No payment bills yet</h3>
                  <p className="text-muted-foreground mb-6">Create your first payment bill to start accepting payments</p>
                  <Button 
                    onClick={() => setIsDashboard(false)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Your First Bill
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bills.map((bill) => {
                    const tokenData = tokens.find(t => t.address === bill.token);
                    return (
                      <div key={bill.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <QrCode className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg">
                                  {bill.amount} {tokenData?.symbol || 'ETH'}
                                </h3>
                                <p className="text-sm text-muted-foreground truncate">
                                  To: {bill.receiver}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Created: {new Date(bill.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span className="font-mono truncate max-w-[200px]">ID: {bill.id}</span>
                              {bill.txHash && (
                                <>
                                  <span>•</span>
                                  <span className="text-green-600 dark:text-green-400">✓ On-chain</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/pay/${bill.id}`)}
                              className="hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const url = `${window.location.origin}/pay/${bill.id}`;
                                navigator.clipboard.writeText(url);
                                toast.success('Payment link copied!');
                              }}
                              className="hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-900/20"
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteBill(bill.id)}
                              className="hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Show success state
  if (paymentUrl && billId) {
    return (
      <div className="container mx-auto px-4 py-8 safe-top safe-bottom">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-green-600">Bill Created Successfully!</h1>
            <p className="text-muted-foreground text-responsive">
              Your payment request is ready to be shared.
            </p>
          </div>

          <Card className="p-6 mb-6 card-hover glass">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <QrCode className="h-5 w-5 text-blue-500" />
              Payment Details
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-muted-foreground font-medium">Receiver</label>
                  <p className="font-mono text-xs break-all">{receiver}</p>
                </div>
                <div>
                  <label className="text-muted-foreground font-medium">Amount</label>
                  <p className="font-semibold text-green-600">
                    {amount} {selectedTokenData?.symbol || 'ETH'}
                  </p>
                </div>
                <div>
                  <label className="text-muted-foreground font-medium">Token</label>
                  <p>{selectedTokenData?.name || 'Ethereum'}</p>
                </div>
                {/* Network badge removed for simplified success view */}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Payment URL
                </label>
                <div className="flex gap-2">
                  <Input
                    value={paymentUrl}
                    readOnly
                    className="flex-1 font-mono text-xs"
                  />
                  <Button
                    onClick={copyPaymentUrl}
                    variant="outline"
                    size="icon"
                    className="tap-target"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs text-green-600 mt-1">✓ Copied to clipboard!</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => router.push(`/pay/${billId}`)}
                  className="flex-1 btn-animate tap-target"
                  size="lg"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  View Payment Page
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="flex-1 btn-animate tap-target"
                  size="lg"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Another Bill
                </Button>
              </div>
            </div>
          </Card>

          {/* Features highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <Card className="p-4 card-hover">
              <Zap className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Zero Gas Payments</h3>
              <p className="text-xs text-muted-foreground">
                Recipients can pay without gas fees
              </p>
            </Card>
            <Card className="p-4 card-hover">
              <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Secure & Verified</h3>
              <p className="text-xs text-muted-foreground">
                Network-validated on Mantle L2
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 safe-top safe-bottom relative">
      <div className="pointer-events-none select-none absolute -z-10 inset-0 opacity-40">
        <div className="absolute -right-10 top-20 hidden md:block">
          <img src="/payment.svg" alt="payment" className="w-56 h-56 float-animation opacity-70" />
        </div>
      </div>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 gradient-primary bg-clip-text text-transparent">
            Create Payment Bill
          </h1>
          <p className="text-muted-foreground text-responsive">
            Generate a payment request that can be paid with zero gas fees.
          </p>
          {/* Network badge moved out for simplicity in dashboard mode */}
        </div>

        {/* ✅ Network Alert - Show warning if wrong network */}
        {shouldShowAlert && (
          <div className="mb-6">
            <NetworkAlert showButton={true} />
          </div>
        )}

        <Card className="p-6 mb-6 glass card-hover">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-green-500" />
            Payment Request Details
          </h2>

          <div className="space-y-6">
            {/* Receiver Address */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Receiver Address *
              </label>
              <Input
                placeholder="0x... (wallet address that will receive payment)"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="font-mono text-sm"
                disabled={isCreating || !canProceed} // ✅ Disable if wrong network
              />
              <p className="text-xs text-muted-foreground mt-1">
                The wallet address that will receive the payment
              </p>
            </div>

            {/* Token Selection */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Payment Token *
              </label>
              <TokenSelect
                tokens={tokens}
                value={selectedToken}
                onChange={setSelectedToken}
                disabled={isCreating || !canProceed} // ✅ Disable if wrong network
              />
              <p className="text-xs text-muted-foreground mt-1">
                Choose the token for payment (ETH or supported ERC-20 tokens)
              </p>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Amount *
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-16"
                  step="0.000001"
                  min="0"
                  disabled={isCreating || !canProceed} // ✅ Disable if wrong network
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  {selectedTokenData?.symbol || 'ETH'}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                The amount to be paid in {selectedTokenData?.symbol || 'ETH'}
              </p>
            </div>

            {/* Gasless Payment Info */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-800 dark:text-green-400 text-sm">
                    Zero Gas Fee Payment
                  </h3>
                  <p className="text-xs text-green-700 dark:text-green-500 mt-1">
                    Recipients can pay this bill without gas fees. Network validation ensures secure transactions.
                  </p>
                </div>
              </div>
            </div>

            {/* Create Button */}
            {isConnected ? (
              <Button
                onClick={handleCreateBill}
                disabled={!canCreate || isCreating} // ✅ Disable if wrong network
                className="w-full tap-target btn-animate"
                size="lg"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Bill...
                  </>
                ) : !canProceed ? (
                  'Switch to Mantle L2 First'
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Payment Bill
                  </>
                )}
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your wallet to create a payment bill
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <Card className="p-4 card-hover">
            <Zap className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Gasless Payments</h3>
            <p className="text-xs text-muted-foreground">
              Zero gas fees for payers
            </p>
          </Card>
          <Card className="p-4 card-hover">
            <QrCode className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">QR Code Sharing</h3>
            <p className="text-xs text-muted-foreground">
              Easy mobile payments
            </p>
          </Card>
          <Card className="p-4 card-hover">
            <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Network Protected</h3>
            <p className="text-xs text-muted-foreground">
              Auto-validated on Mantle L2
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
} 