"use client"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWallet } from "@/lib/wallet-context"
import { Wallet, AlertCircle, CheckCircle } from "lucide-react"

export function WalletConnect() {
  const { address, connect, disconnect, isConnecting, error } = useWallet()

  if (address) {
    return (
      <div className="space-y-3">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Wallet connected: {address.slice(0, 6)}...{address.slice(-4)}
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={disconnect} className="w-full">
          Disconnect Wallet
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={connect} disabled={isConnecting} variant="outline" className="w-full">
        <Wallet className="h-4 w-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    </div>
  )
}
