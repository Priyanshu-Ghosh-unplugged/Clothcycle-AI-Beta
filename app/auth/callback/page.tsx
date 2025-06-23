"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { LoadingScreen } from "@/components/loading-screen"
import { useToast } from "@/hooks/use-toast"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          toast({
            title: "Authentication Error",
            description: error.message || "Failed to complete authentication",
            variant: "destructive",
          })
          router.push("/auth")
          return
        }

        if (data.session) {
          toast({
            title: "Welcome!",
            description: "You have been signed in successfully.",
          })
          router.push("/")
        } else {
          router.push("/auth")
        }
      } catch (error) {
        console.error("Unexpected error during auth callback:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred during authentication",
          variant: "destructive",
        })
        router.push("/auth")
      }
    }

    handleAuthCallback()
  }, [router, supabase.auth, toast])

  return <LoadingScreen />
}
