"use client"

import { useAuth } from "@/lib/auth-context"
import { useWallet } from "@/lib/wallet-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Mail, Wallet } from "lucide-react"

export function AuthStatus() {
  const { user, userProfile, resendConfirmation } = useAuth()
  const { address } = useWallet()

  if (!user || !address) return null

  const isEmailVerified = user.email_confirmed_at !== null
  const hasWallet = !!address

  return (
    <div className="space-y-3">
      {/* Email Verification Status */}
      <Alert variant={isEmailVerified ? "default" : "destructive"}>
        {isEmailVerified ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
        <AlertDescription className="flex items-center justify-between">
          <span>
            Email {isEmailVerified ? "verified" : "not verified"}: {user.email}
          </span>
          {!isEmailVerified && (
            <Button variant="outline" size="sm" onClick={() => resendConfirmation(user.email!)} className="ml-2">
              <Mail className="h-3 w-3 mr-1" />
              Resend
            </Button>
          )}
        </AlertDescription>
      </Alert>

      {/* Wallet Connection Status */}
      <Alert>
        <Wallet className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            Wallet: {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <Badge variant="secondary">Connected</Badge>
        </AlertDescription>
      </Alert>

      {/* Account Status Summary */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>Account Status:</span>
        <Badge variant={isEmailVerified && hasWallet ? "default" : "secondary"}>
          {isEmailVerified && hasWallet ? "Fully Verified" : "Pending Verification"}
        </Badge>
      </div>
    </div>
  )
}
