"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, CheckCircle, AlertCircle } from "lucide-react"

interface WalletConnectionProps {
  account: string
  onConnect: () => void
  error: string
}

export function WalletConnection({ account, onConnect, error }: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    await onConnect()
    setIsConnecting(false)
  }

  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className="border-2 border-border/50 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Wallet Connection</h3>
              <p className="text-sm text-muted-foreground">
                {account ? "Connected to MetaMask" : "Connect your wallet to participate"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {account ? (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {formatAddress(account)}
                </Badge>
              </div>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
