"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

const errorMessages = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = (searchParams?.get?.("error") || "Default") as keyof typeof errorMessages

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 dark:bg-red-950">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>{errorMessages[error] || errorMessages.Default}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/signin">Try Again</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  )
}
