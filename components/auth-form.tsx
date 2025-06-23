"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { useWallet } from "@/lib/wallet-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Wallet, AlertCircle, Mail, Eye, EyeOff, Chrome } from "lucide-react"

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [showResetForm, setShowResetForm] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const { signIn, signUp, signInWithGoogle, resetPassword, resendConfirmation } = useAuth()
  const { address, connect, isConnecting } = useWallet()
  const { toast } = useToast()
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await signIn(email, password)
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password, name)
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account before signing in.",
      })
      // Clear form
      setEmail("")
      setPassword("")
      setName("")
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    setIsGoogleLoading(true)

    try {
      await signInWithGoogle()
      // The redirect will happen automatically
    } catch (error: any) {
      toast({
        title: "Google Sign In Failed",
        description: error.message || "Failed to sign in with Google.",
        variant: "destructive",
      })
      setIsGoogleLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsResetting(true)

    try {
      await resetPassword(resetEmail)
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      })
      setShowResetForm(false)
      setResetEmail("")
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to send reset email.",
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    try {
      await resendConfirmation(email)
      toast({
        title: "Confirmation Sent",
        description: "Check your email for the confirmation link.",
      })
    } catch (error: any) {
      toast({
        title: "Failed to Resend",
        description: error.message || "Failed to resend confirmation email.",
        variant: "destructive",
      })
    }
  }

  // Show wallet connection first
  if (!address) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            ClothCycle AI requires a Web3 wallet to track your sustainable fashion journey and earn rewards.
          </AlertDescription>
        </Alert>

        <Button onClick={connect} disabled={isConnecting} className="w-full" size="lg">
          <Wallet className="h-4 w-4 mr-2" />
          {isConnecting ? "Connecting..." : "Connect Wallet to Continue"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <p>Don't have a wallet? We recommend:</p>
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
      </div>
    )
  }

  if (showResetForm) {
    return (
      <div className="space-y-4">
        <Alert>
          <Wallet className="h-4 w-4" />
          <AlertDescription>
            Wallet connected: {address.slice(0, 6)}...{address.slice(-4)}
          </AlertDescription>
        </Alert>

        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Reset Password</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isResetting}>
            {isResetting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending Reset Email...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Send Reset Email
              </>
            )}
          </Button>
        </form>

        <Button variant="ghost" onClick={() => setShowResetForm(false)} className="w-full">
          Back to Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Alert>
        <Wallet className="h-4 w-4" />
        <AlertDescription>
          Wallet connected: {address.slice(0, 6)}...{address.slice(-4)}
        </AlertDescription>
      </Alert>

      {/* Google Sign In Button */}
      <Button onClick={handleGoogleSignIn} disabled={isGoogleLoading} variant="outline" className="w-full" size="lg">
        {isGoogleLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Signing in with Google...
          </>
        ) : (
          <>
            <Chrome className="h-4 w-4 mr-2" />
            Continue with Google
          </>
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
        </div>
      </div>

      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="signin">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="signin-password">Password</Label>
              <div className="relative">
                <Input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={handleResendConfirmation}
              >
                Resend confirmation
              </Button>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => setShowResetForm(true)}
              >
                Forgot password?
              </Button>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min. 6 characters)"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Password must be at least 6 characters long</p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
