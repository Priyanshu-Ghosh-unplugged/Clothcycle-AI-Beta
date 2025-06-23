"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { useWallet } from "@/lib/wallet-context"

interface UserProfile {
  id: string
  email: string
  name?: string
  avatar_url?: string
  wallet_address?: string
  bio?: string
  location?: string
  website?: string
  instagram_handle?: string
  green_tokens: number
  sustainability_score: number
  total_items_listed: number
  total_items_sold: number
  total_items_donated: number
  total_co2_saved: number
  is_verified: boolean
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  resendConfirmation: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const wallet = useWallet()
  const supabase = createClient()
  const initializationRef = useRef(false)

  // Memoized profile creation to prevent recreating on every render
  const createMockProfile = useCallback((user: User, walletAddress?: string): UserProfile => {
    return {
      id: user.id,
      email: user.email || "",
      name: user.user_metadata?.name || user.user_metadata?.full_name || "User",
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
      wallet_address: walletAddress,
      bio: "Sustainable fashion enthusiast",
      location: "San Francisco, CA",
      green_tokens: 156,
      sustainability_score: 78,
      total_items_listed: 12,
      total_items_sold: 8,
      total_items_donated: 4,
      total_co2_saved: 45.2,
      is_verified: user.email_confirmed_at ? true : false,
      created_at: user.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }, [])

  // Initialize auth state only once
  useEffect(() => {
    if (initializationRef.current) return
    initializationRef.current = true

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
          const profile = createMockProfile(session.user, wallet.address || undefined)
          setUserProfile(profile)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user)
          const profile = createMockProfile(session.user, wallet.address || undefined)
          setUserProfile(profile)
        } else if (event === "SIGNED_OUT") {
          setUser(null)
          setUserProfile(null)
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          // Update user data on token refresh
          setUser(session.user)
          if (userProfile) {
            const updatedProfile = createMockProfile(session.user, wallet.address || undefined)
            setUserProfile(updatedProfile)
          }
        }
      } catch (error) {
        console.error("Error handling auth state change:", error)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth, createMockProfile, wallet.address, userProfile])

  // Update wallet address in profile when wallet changes (but don't recreate entire profile)
  useEffect(() => {
    if (userProfile && wallet.address && userProfile.wallet_address !== wallet.address) {
      setUserProfile((prev) =>
        prev
          ? {
              ...prev,
              wallet_address: wallet.address || undefined,
              updated_at: new Date().toISOString(),
            }
          : null,
      )
    }
  }, [wallet.address, userProfile])

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!wallet.address) {
        throw new Error("Please connect your wallet first")
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Handle specific auth errors
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password")
        } else if (error.message.includes("Email not confirmed")) {
          throw new Error("Please check your email and click the confirmation link")
        } else {
          throw error
        }
      }

      return data
    },
    [wallet.address, supabase.auth],
  )

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      if (!wallet.address) {
        throw new Error("Please connect your wallet first")
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            full_name: name,
            wallet_address: wallet.address,
          },
        },
      })

      if (error) {
        // Handle specific signup errors
        if (error.message.includes("User already registered")) {
          throw new Error("An account with this email already exists")
        } else if (error.message.includes("Password should be at least")) {
          throw new Error("Password must be at least 6 characters long")
        } else {
          throw error
        }
      }

      return data
    },
    [wallet.address, supabase.auth],
  )

  const signInWithGoogle = useCallback(async () => {
    if (!wallet.address) {
      throw new Error("Please connect your wallet first")
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })

    if (error) {
      throw error
    }

    return data
  }, [wallet.address, supabase.auth])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    // Don't disconnect wallet automatically - let user choose
    setUser(null)
    setUserProfile(null)
  }, [supabase.auth])

  const resetPassword = useCallback(
    async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        throw error
      }
    },
    [supabase.auth],
  )

  const resendConfirmation = useCallback(
    async (email: string) => {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    },
    [supabase.auth],
  )

  const updateUserProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!user || !userProfile) return

      try {
        // In production, this would update Supabase:
        // const { error } = await supabase.from("users").upsert({
        //   id: user.id,
        //   ...userProfile,
        //   ...data,
        //   updated_at: new Date().toISOString(),
        // })

        // For now, update local state
        setUserProfile((prev) =>
          prev
            ? {
                ...prev,
                ...data,
                updated_at: new Date().toISOString(),
              }
            : null,
        )
      } catch (error) {
        console.error("Error updating user profile:", error)
        throw error
      }
    },
    [user, userProfile],
  )

  const value = {
    user,
    userProfile,
    loading,
    initialized,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateUserProfile,
    resendConfirmation,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
