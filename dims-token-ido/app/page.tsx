"use client"

import { ethers, BrowserProvider, Contract } from "ethers"
import { useEffect, useState } from "react"
import { WalletConnection } from "@/components/wallet-connection"
import { TokenBalanceCard } from "@/components/token-balance-card"
import { PurchaseInterface } from "@/components/purchase-interface"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Shield, Zap } from "lucide-react"

const tokenAbi: ethers.InterfaceAbi = [
  "function balanceOf(address owner) view returns (uint256)",
]

const idoAbi: ethers.InterfaceAbi = [
  "function buyTokens() payable",
  "function rate() view returns (uint256)",
]

export default function DimsTokenIDO() {
  const [account, setAccount] = useState<string>("")
  const [tokenBalance, setTokenBalance] = useState<string>("0")
  const [idoBalance, setIdoBalance] = useState<string>("0")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [rate, setRate] = useState<string>("1000")

  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? ""
  const idoAddress = process.env.NEXT_PUBLIC_IDO_ADDRESS ?? ""

  useEffect(() => {
    connectWallet()
  }, [])

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsLoading(true)
        const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[]
        setAccount(accounts[0])
        const provider = new BrowserProvider(window.ethereum)
        const network = await provider.getNetwork()
        console.log("Network:", network.name, "Chain ID:", network.chainId)
        if (Number(network.chainId) !== 11155111) {
          setError("Please switch MetaMask to Sepolia network (Chain ID 11155111)")
          return
        }
        const signer = await provider.getSigner()
        const tokenContract = new Contract(tokenAddress, tokenAbi, signer)
        const idoContract = new Contract(idoAddress, idoAbi, signer)
        const bal = await tokenContract.balanceOf(accounts[0])
        const idoBal = await tokenContract.balanceOf(idoAddress)
        const currentRate = await idoContract.rate()
        setTokenBalance(ethers.formatEther(bal))
        setIdoBalance(ethers.formatEther(idoBal))
        setRate(currentRate.toString())
        setError("")
      } catch (err) {
        console.error("Error:", err)
        setError("Failed to fetch balance: " + (err as Error).message)
      } finally {
        setIsLoading(false)
      }
    } else {
      setError("Please install MetaMask")
    }
  }

  const buyTokens = async () => {
    if (window.ethereum) {
      try {
        setIsLoading(true)
        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const idoContract = new Contract(idoAddress, idoAbi, signer)
        const tx = await idoContract.buyTokens({
          value: ethers.parseEther("0.01"),
          gasLimit: 200000,
        })
        await tx.wait()
        alert("Tokens purchased successfully! Your balance will update shortly.")
        connectWallet()
      } catch (err) {
        console.error("Buy error:", err)
        setError("Failed to buy tokens: " + (err as Error).message)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance">DimsToken IDO</h1>
                <p className="text-sm text-muted-foreground">Initial DEX Offering</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:flex">
                <Shield className="h-3 w-3 mr-1" />
                Secure
              </Badge>
              <Badge variant="outline" className="hidden sm:flex">
                <Zap className="h-3 w-3 mr-1" />
                Fast
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <h2 className="text-4xl font-bold text-balance bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Join the DimsToken Revolution
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Participate in our Initial DEX Offering and be part of the future of decentralized finance. Secure,
              transparent, and community-driven.
            </p>
          </div>

          {/* Wallet Connection */}
          <WalletConnection account={account} onConnect={connectWallet} error={error} />

          {/* Token Balances */}
          <TokenBalanceCard userBalance={tokenBalance} idoBalance={idoBalance} isConnected={!!account} />

          {/* Purchase Interface */}
          <PurchaseInterface onBuyTokens={buyTokens} isConnected={!!account} isLoading={isLoading} rate={Number(rate)} />

          {/* Contract Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
            <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
              <h3 className="font-semibold mb-2">Token Contract</h3>
              <p className="text-xs font-mono text-foreground/80 break-all">{tokenAddress}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
              <h3 className="font-semibold mb-2">IDO Contract</h3>
              <p className="text-xs font-mono text-foreground/80 break-all">{idoAddress}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold">DimsToken</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with security and transparency in mind. Always verify contract addresses before transacting.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>Sepolia Testnet</span>
              <span>•</span>
              <span>Powered by Ethereum</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
