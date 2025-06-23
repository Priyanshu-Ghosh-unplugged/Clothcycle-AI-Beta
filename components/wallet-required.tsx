"use client"

import type React from "react"

import { useWallet } from "@/lib/wallet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, Shield, Coins, Zap } from "lucide-react"

interface WalletRequiredProps {
  children: React.ReactNode
  message?: string
}

export function WalletRequired({ children, message }: WalletRequiredProps) {
  const { address, connect, isConnecting, initialized } = useWallet()

  // Don't render anything until wallet is initialized
  if (!initialized) {
    return null
  }

  if (!address) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Wallet Required</CardTitle>
            <CardDescription>{message || "Connect your Web3 wallet to access ClothCycle AI features"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your wallet enables secure transactions, NFT rewards, and tracks your sustainable fashion impact.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <Coins className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-sm">Earn GreenTokens</p>
                  <p className="text-xs text-muted-foreground">Get rewarded for sustainable actions</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <Zap className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">NFT Certificates</p>
                  <p className="text-xs text-muted-foreground">Mint eco-impact certificates</p>
                </div>
              </div>
            </div>

            <Button onClick={connect} disabled={isConnecting} className="w-full" size="lg">
              <Wallet className="h-4 w-4 mr-2" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Supported wallets:</p>
              <div className="flex justify-center space-x-4 mt-2">
                <a
                  href="https://metamask.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  MetaMask
                </a>
                <a
                  href="https://rainbow.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Rainbow
                </a>
                <a
                  href="https://walletconnect.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WalletConnect
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
