"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, TrendingUp } from "lucide-react"

interface TokenBalanceCardProps {
  userBalance: string
  idoBalance: string
  isConnected: boolean
}

export function TokenBalanceCard({ userBalance, idoBalance, isConnected }: TokenBalanceCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* User Balance Card */}
      <Card className="border-2 border-border/50 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            Your DIMS Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">
              {isConnected ? `${Number.parseFloat(userBalance).toFixed(4)}` : "0.0000"}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                DIMS
              </Badge>
              <span className="text-sm text-muted-foreground">DimsToken</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IDO Pool Balance Card */}
      <Card className="border-2 border-border/50 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-secondary" />
            </div>
            IDO Pool Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-secondary">
              {isConnected ? `${Number.parseFloat(idoBalance).toFixed(4)}` : "0.0000"}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                DIMS
              </Badge>
              <span className="text-sm text-muted-foreground">Available for Purchase</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
