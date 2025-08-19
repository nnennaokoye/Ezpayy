"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Link2, Wallet, CheckCircle, Scan, ArrowLeft } from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

export default function PayPage() {
  const [paymentLink, setPaymentLink] = useState("")
  const [paymentData, setPaymentData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [activeTab, setActiveTab] = useState("scan")

  // Parse URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const amount = urlParams.get("amount")
    const token = urlParams.get("token")
    const desc = urlParams.get("desc")

    if (amount && token) {
      setPaymentData({
        amount,
        token,
        description: desc || "",
      })
      setActiveTab("confirm")
    }
  }, [])

  const processPaymentLink = () => {
    try {
      const url = new URL(paymentLink)
      const params = new URLSearchParams(url.search)
      const amount = params.get("amount")
      const token = params.get("token")
      const desc = params.get("desc")

      if (amount && token) {
        setPaymentData({
          amount,
          token,
          description: desc || "",
        })
        setActiveTab("confirm")
      }
    } catch (error) {
      console.error("Invalid payment link")
    }
  }

  const executePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
    }, 3000)
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
        <Navigation />
        <main className="pt-24 pb-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6 text-left">
              <Link href="/">
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-primary/10">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
            </div>

            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Payment Successful!</h1>
              <p className="text-xl text-muted-foreground">Your gasless transaction has been completed</p>
            </div>

            <Card className="border-2 border-green-200 bg-green-50/50">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid:</span>
                    <span className="font-bold text-green-600">
                      {paymentData?.amount} {paymentData?.token}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network:</span>
                    <span className="font-semibold">Mantle</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gas Fees:</span>
                    <span className="font-semibold text-green-600">$0.00 (Gasless)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => (window.location.href = "/")}
              className="mt-8 bg-gradient-to-r from-primary to-secondary"
            >
              Back to Home
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <Navigation />

      <main className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-primary/10">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center animate-pulse-glow">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Make Payment
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Scan QR code or enter payment link for gasless crypto transactions
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="scan" className="flex items-center space-x-2">
                  <Scan className="w-4 h-4" />
                  <span>Scan QR</span>
                </TabsTrigger>
                <TabsTrigger value="link" className="flex items-center space-x-2">
                  <Link2 className="w-4 h-4" />
                  <span>Enter Link</span>
                </TabsTrigger>
                <TabsTrigger value="confirm" className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="scan" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <QrCode className="w-5 h-5 text-primary" />
                      <span>Scan QR Code</span>
                    </CardTitle>
                    <CardDescription>Point your camera at the merchant's QR code</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center py-12">
                      <div className="w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center border-2 border-dashed border-primary/30">
                        <div className="text-center">
                          <Scan className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
                          <p className="text-muted-foreground">Camera Scanner</p>
                          <p className="text-sm text-muted-foreground mt-2">Position QR code within frame</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="link" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Link2 className="w-5 h-5 text-secondary" />
                      <span>Enter Payment Link</span>
                    </CardTitle>
                    <CardDescription>Paste the payment link provided by the merchant</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="payment-link">Payment Link</Label>
                      <Input
                        id="payment-link"
                        placeholder="https://ezpay.app/pay?amount=..."
                        value={paymentLink}
                        onChange={(e) => setPaymentLink(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                    <Button
                      onClick={processPaymentLink}
                      className="w-full bg-gradient-to-r from-secondary to-primary"
                      disabled={!paymentLink}
                    >
                      Process Payment Link
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="confirm" className="mt-6">
                {paymentData ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>Confirm Payment</span>
                      </CardTitle>
                      <CardDescription>Review payment details before confirming</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Payment Details */}
                      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="text-2xl font-bold text-foreground">
                            {paymentData.amount} {paymentData.token}
                          </span>
                        </div>
                        {paymentData.description && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Description:</span>
                            <span className="font-semibold">{paymentData.description}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Network:</span>
                          <span className="font-semibold">Mantle</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gas Fees:</span>
                          <span className="font-semibold text-green-600">$0.00 (Gasless)</span>
                        </div>
                      </div>

                      <Button
                        onClick={executePayment}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Processing Payment...</span>
                          </div>
                        ) : (
                          `Pay ${paymentData.amount} ${paymentData.token}`
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground">Scan a QR code or enter a payment link to continue</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
