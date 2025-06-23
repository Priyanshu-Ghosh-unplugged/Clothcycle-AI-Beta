"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { useWallet } from "@/lib/wallet-context"
import { LoadingScreen } from "@/components/loading-screen"

interface AppInitializerProps {
  children: React.ReactNode
}

export function AppInitializer({ children }: AppInitializerProps) {
  const { loading: authLoading, initialized: authInitialized } = useAuth()
  const { initialized: walletInitialized } = useWallet()

  // Show loading screen until both wallet and auth are initialized
  if (!authInitialized || !walletInitialized || authLoading) {
    return <LoadingScreen />
  }

  return <>{children}</>
}
