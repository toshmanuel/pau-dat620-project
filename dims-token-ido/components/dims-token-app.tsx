"use client"

import type { InterfaceAbi } from "ethers"
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"

const tokenAbi: InterfaceAbi = [
  "function balanceOf(address owner) view returns (uint256)",
]

const idoAbi: InterfaceAbi = [
  "function buyTokens() payable",
]

function App() {
  const [account, setAccount] = useState<string>("")
  const [tokenBalance, setTokenBalance] = useState<string>("")
  const [idoBalance, setIdoBalance] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [amountEth, setAmountEth] = useState<string>("0.01")
  const { toast } = useToast()
  

  const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? ""
  const idoAddress = process.env.NEXT_PUBLIC_IDO_ADDRESS ?? ""

  useEffect(() => {
    connectWallet()
  }, [])

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
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
        setTokenBalance(formatEther(bal))
        setIdoBalance(formatEther(idoBal))
        setError("")
      } catch (err) {
        console.error("Error:", err)
        setError("Failed to fetch balance: " + (err as Error).message)
      }
    } else {
      setError("Please install MetaMask")
    }
  }

  const buyTokens = async () => {
    if (window.ethereum) {
      try {
        // Validate amount within bounds
        const min = 0.001
        const max = 0.1
        const val = Number(amountEth)
        if (!Number.isFinite(val) || val < min || val > max) {
          setError(`Enter an amount between ${min} and ${max} ETH`)
          return
        }

        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const idoContract = new Contract(idoAddress, idoAbi, signer)
        const tx = await idoContract.buyTokens({ value: parseEther(amountEth), gasLimit: 200000 })
        await tx.wait()
        alert("Tokens purchased! Refresh balance.")
        connectWallet()
      } catch (err: any) {
        console.error("Buy error:", err)
        if (err?.code === "ACTION_REJECTED" || err?.code === 4001 || err?.error?.code === 4001) {
          toast({
            title: "Transaction rejected",
            description: "You denied the MetaMask signature.",
          })
        } else {
          setError("Failed to buy tokens: " + (err as Error).message)
        }
      }
    }
  }

  return (
    <div>
      <h1>DimsToken IDO</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      {account && <p>Account: {account}</p>}
      {tokenBalance && <p>DIMS Balance: {tokenBalance} DIMS</p>}
      {idoBalance && <p>IDO DIMS Balance: {idoBalance} DIMS</p>}
      <div style={{ marginTop: 12 }}>
        <label>
          Amount (ETH):
          <input
            type="number"
            min={0.001}
            max={0.1}
            step={0.001}
            value={amountEth}
            onChange={(e) => setAmountEth(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      <button onClick={buyTokens} disabled={!account}>
        Buy DIMS
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}

export default App
