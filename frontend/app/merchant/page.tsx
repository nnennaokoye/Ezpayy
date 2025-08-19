"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Copy, Link2, Zap, ArrowLeft, History, FileText } from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"

export default function MerchantPage() {
  const [amount, setAmount] = useState("")
  const [token, setToken] = useState("")
  const [description, setDescription] = useState("")
  const [qrGenerated, setQrGenerated] = useState(false)
  const [paymentLink, setPaymentLink] = useState("")
  const [activeTab, setActiveTab] = useState("create")

  const [createdPayments] = useState([
    {
      id: 1,
      amount: "50.00",
      token: "USDC",
      description: "Coffee order #123",
      link: "https://ezpay.app/pay?amount=50&token=USDC&desc=Coffee%20order%20%23123",
      created: "2024-01-15 10:30 AM",
      status: "Active",
    },
    {
      id: 2,
      amount: "25.50",
      token: "USDT",
      description: "Lunch special",
      link: "https://ezpay.app/pay?amount=25.50&token=USDT&desc=Lunch%20special",
      created: "2024-01-15 09:15 AM",
      status: "Paid",
    },
  ])

  const [transactionHistory] = useState([
    {
      id: 1,
      amount: "25.50",
      token: "USDT",
      description: "Lunch special",
      customer: "0x1234...5678",
      timestamp: "2024-01-15 09:45 AM",
      txHash: "0xabcd...efgh",
      status: "Completed",
    },
    {
      id: 2,
      amount: "100.00",
      token: "USDC",
      description: "Product purchase",
      customer: "0x9876...5432",
      timestamp: "2024-01-14 03:22 PM",
      txHash: "0x1234...abcd",
      status: "Completed",
    },
  ])

  const generatePayment = () => {
    if (amount && token) {
      const link = `https://ezpay.app/pay?amount=${amount}&token=${token}&desc=${encodeURIComponent(description)}`
      setPaymentLink(link)
      setQrGenerated(true)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(paymentLink)
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
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center animate-pulse-glow">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Merchant Dashboard
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate QR codes and payment links for gasless crypto transactions
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="create" className="flex items-center space-x-2">
                <QrCode className="w-4 h-4" />
                <span>Create Payment</span>
              </TabsTrigger>
              <TabsTrigger value="created" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Created Codes</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <History className="w-4 h-4" />
                <span>Transaction History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Payment Form */}
                <Card className="border-2 border-border/50 hover:border-primary/20 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <QrCode className="w-5 h-5 text-primary" />
                      <span>Create Payment Request</span>
                    </CardTitle>
                    <CardDescription>Set up your payment details to generate QR code and link</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="token">Token</Label>
                      <Select value={token} onValueChange={setToken}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select token" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USDC">USDC</SelectItem>
                          <SelectItem value="USDT">USDT</SelectItem>
                          <SelectItem value="MNT">MNT</SelectItem>
                          <SelectItem value="ETH">ETH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        placeholder="Payment for..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <Button
                      onClick={generatePayment}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transform hover:scale-105 transition-all duration-200"
                      disabled={!amount || !token}
                    >
                      Generate Payment
                    </Button>
                  </CardContent>
                </Card>

                {/* QR Code & Link Display */}
                <Card className="border-2 border-border/50 hover:border-secondary/20 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Link2 className="w-5 h-5 text-secondary" />
                      <span>Payment QR & Link</span>
                    </CardTitle>
                    <CardDescription>Share this QR code or link with your customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {qrGenerated ? (
                      <div className="space-y-6">
                        {/* QR Code Placeholder */}
                        <div className="flex justify-center">
                          <div className="w-48 h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center border-2 border-dashed border-primary/30">
                            <div className="text-center">
                              <QrCode className="w-16 h-16 text-primary mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">QR Code</p>
                              <p className="text-xs text-muted-foreground">
                                {amount} {token}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Payment Link */}
                        <div className="space-y-2">
                          <Label>Payment Link</Label>
                          <div className="flex space-x-2">
                            <Input value={paymentLink} readOnly className="font-mono text-sm" />
                            <Button
                              onClick={copyLink}
                              variant="outline"
                              size="icon"
                              className="hover:bg-primary/10 bg-transparent"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount:</span>
                            <span className="font-semibold">
                              {amount} {token}
                            </span>
                          </div>
                          {description && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Description:</span>
                              <span className="font-semibold">{description}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Network:</span>
                            <span className="font-semibold">Mantle</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <QrCode className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Fill in the payment details to generate QR code and link
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="created">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>Created Payment Codes</span>
                  </CardTitle>
                  <CardDescription>View and manage your generated payment requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {createdPayments.map((payment) => (
                      <div key={payment.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {payment.amount} {payment.token}
                            </h3>
                            <p className="text-muted-foreground">{payment.description}</p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                payment.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {payment.status}
                            </span>
                            <p className="text-sm text-muted-foreground mt-1">{payment.created}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Input value={payment.link} readOnly className="font-mono text-sm" />
                          <Button
                            onClick={() => navigator.clipboard.writeText(payment.link)}
                            variant="outline"
                            size="icon"
                            className="hover:bg-primary/10"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="w-5 h-5 text-secondary" />
                    <span>Transaction History</span>
                  </CardTitle>
                  <CardDescription>View completed payments and transaction details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactionHistory.map((tx) => (
                      <div key={tx.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {tx.amount} {tx.token}
                            </h3>
                            <p className="text-muted-foreground">{tx.description}</p>
                            <p className="text-sm text-muted-foreground">From: {tx.customer}</p>
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {tx.status}
                            </span>
                            <p className="text-sm text-muted-foreground mt-1">{tx.timestamp}</p>
                          </div>
                        </div>
                        <div className="bg-muted/30 rounded p-2">
                          <p className="text-sm font-mono text-muted-foreground">Tx Hash: {tx.txHash}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
