"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"

interface WalletContextType {
  address: string | null
  isConnecting: boolean
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  error: string | null
  initialized: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Storage keys
const WALLET_STORAGE_KEY = "clothcycle_wallet_connected"
const WALLET_ADDRESS_KEY = "clothcycle_wallet_address"

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)
  const initializationRef = useRef(false)

  // Initialize wallet state only once
  useEffect(() => {
    if (initializationRef.current) return
    initializationRef.current = true

    const initializeWallet = async () => {
      try {
        // Check if wallet was previously connected
        const wasConnected = localStorage.getItem(WALLET_STORAGE_KEY) === "true"
        const savedAddress = localStorage.getItem(WALLET_ADDRESS_KEY)

        if (typeof window !== "undefined" && window.ethereum && wasConnected) {
          // Try to reconnect to previously connected wallet
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setAddress(accounts[0])
            localStorage.setItem(WALLET_ADDRESS_KEY, accounts[0])
          } else if (savedAddress) {
            // Clear saved data if no accounts found
            localStorage.removeItem(WALLET_STORAGE_KEY)
            localStorage.removeItem(WALLET_ADDRESS_KEY)
          }
        } else if (savedAddress && !window.ethereum) {
          // For demo mode - restore saved address
          setAddress(savedAddress)
        }
      } catch (error) {
        console.error("Error initializing wallet:", error)
        // Clear potentially corrupted data
        localStorage.removeItem(WALLET_STORAGE_KEY)
        localStorage.removeItem(WALLET_ADDRESS_KEY)
      } finally {
        setInitialized(true)
      }
    }

    initializeWallet()

    // Listen for account changes only once
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setError(null)
          localStorage.setItem(WALLET_STORAGE_KEY, "true")
          localStorage.setItem(WALLET_ADDRESS_KEY, accounts[0])
        } else {
          setAddress(null)
          localStorage.removeItem(WALLET_STORAGE_KEY)
          localStorage.removeItem(WALLET_ADDRESS_KEY)
        }
      }

      const handleChainChanged = () => {
        // Just reload the page when chain changes
        window.location.reload()
      }

      const handleDisconnect = () => {
        setAddress(null)
        localStorage.removeItem(WALLET_STORAGE_KEY)
        localStorage.removeItem(WALLET_ADDRESS_KEY)
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
      window.ethereum.on("disconnect", handleDisconnect)

      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
          window.ethereum.removeListener("chainChanged", handleChainChanged)
          window.ethereum.removeListener("disconnect", handleDisconnect)
        }
      }
    }
  }, [])

  const connect = useCallback(async () => {
    setIsConnecting(true)
    setError(null)

    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        if (accounts.length > 0) {
          setAddress(accounts[0])
          localStorage.setItem(WALLET_STORAGE_KEY, "true")
          localStorage.setItem(WALLET_ADDRESS_KEY, accounts[0])
        }
      } else {
        // For demo purposes when MetaMask is not available
        const demoAddress = "0x1234567890123456789012345678901234567890"
        setError("MetaMask not detected. Using demo mode...")

        setTimeout(() => {
          setAddress(demoAddress)
          setError(null)
          localStorage.setItem(WALLET_STORAGE_KEY, "true")
          localStorage.setItem(WALLET_ADDRESS_KEY, demoAddress)
        }, 2000)
      }
    } catch (error: any) {
      console.error("Failed to connect wallet:", error)
      setError(error.message || "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
    setError(null)
    localStorage.removeItem(WALLET_STORAGE_KEY)
    localStorage.removeItem(WALLET_ADDRESS_KEY)
  }, [])

  const value = {
    address,
    isConnecting,
    isConnected: !!address,
    connect,
    disconnect,
    error,
    initialized,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (data: any) => void) => void
      removeListener: (event: string, callback: (data: any) => void) => void
    }
  }
}
