"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Zap, Info } from "lucide-react"

interface PurchaseInterfaceProps {
  onBuyTokens: () => void
  isConnected: boolean
  isLoading?: boolean
  rate?: number
}

export function PurchaseInterface({ onBuyTokens, isConnected, isLoading = false, rate = 1000 }: PurchaseInterfaceProps) {
  const [ethAmount, setEthAmount] = useState("0.01")
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePurchase = async () => {
    setIsProcessing(true)
    await onBuyTokens()
    setIsProcessing(false)
  }

  const estimatedTokens = Number.parseFloat(ethAmount || "0") * rate

  return (
    <Card className="border-2 border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          Purchase DimsTokens
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Purchase Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="eth-amount" className="text-sm font-medium">
            ETH Amount
          </Label>
          <div className="relative">
            <Input
              id="eth-amount"
              type="number"
              step="0.001"
              min="0.001"
              value={ethAmount}
              onChange={(e) => setEthAmount(e.target.value)}
              className="pr-12"
              placeholder="0.01"
            />
            <Badge
              variant="secondary"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-muted text-muted-foreground"
            >
              ETH
            </Badge>
          </div>
        </div>

        {/* Estimated Tokens */}
        <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">You will receive:</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-primary">{estimatedTokens.toLocaleString()}</span>
              <Badge variant="outline" className="text-xs">
                DIMS
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            <span>Rate: 1 ETH = {rate.toLocaleString()} DIMS</span>
          </div>
        </div>

        {/* Purchase Button */}
        <Button
          onClick={handlePurchase}
          disabled={!isConnected || isProcessing || isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-semibold"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {isConnected ? `Buy ${estimatedTokens.toLocaleString()} DIMS` : "Connect Wallet First"}
            </div>
          )}
        </Button>

        {/* Network Info */}
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            Sepolia Testnet
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
