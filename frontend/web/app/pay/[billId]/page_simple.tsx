'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Button, Card } from 'ui';
import QRCode from 'react-qr-code';
import { CheckCircle, Clock, AlertCircle, Copy, Wallet, Zap, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PaymentPage() {
  const params = useParams();
  const billId = params.billId as string;
  const { address, isConnected } = useAccount();
  
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'normal' | 'gasless'>('gasless');
  
  // Mock bill data for now to prevent crashes
  const billData = {
    receiver: '0x1234567890123456789012345678901234567890',
    token: '0x0000000000000000000000000000000000000000',
    amount: BigInt('1000000000000000000'), // 1 ETH
    paid: false,
    createdAt: BigInt(Date.now()),
    paidAt: BigInt(0),
    payer: '0x0000000000000000000000000000000000000000'
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyBillId = () => {
    navigator.clipboard.writeText(billId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Bill ID copied to clipboard!');
  };

  const handlePayment = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    toast.success('Payment functionality will be implemented soon!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Payment Request
          </h1>
          <p className="text-muted-foreground">
            Secure payment powered by Mantle L2
          </p>
        </div>

        {/* Payment Status */}
        <Card className="p-6 mb-6 glass card-hover">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Payment Details</h2>
            <div className="flex items-center gap-2">
              {billData.paid ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Paid</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-orange-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-muted-foreground font-medium">Amount</label>
                <p className="font-semibold text-lg text-green-600">
                  1.0 ETH
                </p>
              </div>
              <div>
                <label className="text-muted-foreground font-medium">Receiver</label>
                <p className="font-mono text-xs break-all">{billData.receiver}</p>
              </div>
            </div>

            <div>
              <label className="text-muted-foreground font-medium">Bill ID</label>
              <div className="flex gap-2 mt-1">
                <code className="flex-1 p-2 bg-muted rounded text-xs font-mono break-all">
                  {billId}
                </code>
                <Button
                  onClick={copyBillId}
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
          </div>

          {/* Payment Method Selection */}
          {!billData.paid && (
            <div className="mt-6">
              <label className="text-sm font-medium text-muted-foreground mb-3 block">
                Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <Button
                  variant={paymentMethod === 'gasless' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('gasless')}
                  className="justify-start h-auto p-4"
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4" />
                      <span className="font-medium">Gasless Payment</span>
                    </div>
                    <p className="text-xs opacity-80">Zero gas fees</p>
                  </div>
                </Button>
                <Button
                  variant={paymentMethod === 'normal' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('normal')}
                  className="justify-start h-auto p-4"
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet className="h-4 w-4" />
                      <span className="font-medium">Standard Payment</span>
                    </div>
                    <p className="text-xs opacity-80">Regular transaction</p>
                  </div>
                </Button>
              </div>

              {/* Payment Button */}
              {isConnected ? (
                <Button
                  onClick={handlePayment}
                  className="w-full tap-target btn-animate"
                  size="lg"
                >
                  {paymentMethod === 'gasless' ? (
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
          )}
        </Card>

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
