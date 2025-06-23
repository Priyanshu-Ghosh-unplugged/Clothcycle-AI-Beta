import { AuthForm } from "@/components/auth-form"
import { WalletConnect } from "@/components/wallet-connect"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-bg p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to ClothCycle AI</CardTitle>
          <CardDescription>Sign in to start your sustainable fashion journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AuthForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <WalletConnect />
        </CardContent>
      </Card>
    </div>
  )
}
