"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { auth, db } from "@/lib/firebase"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
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
  user: any | null
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
  const [user, setUser] = useState<any | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const wallet = useWallet()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
      setInitialized(true)
      if (firebaseUser) {
        const profileRef = doc(db, "profiles", firebaseUser.uid)
        const profileSnap = await getDoc(profileRef)
        if (profileSnap.exists()) {
          setUserProfile(profileSnap.data() as UserProfile)
        } else {
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }
    })
    return () => unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }, [])

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name })
    // Create profile in Firestore
    const profile: UserProfile = {
      id: result.user.uid,
      email: result.user.email || "",
      name,
      avatar_url: result.user.photoURL || "",
      wallet_address: wallet.address || undefined,
      bio: "Sustainable fashion enthusiast",
      location: "",
      website: "",
      instagram_handle: "",
      green_tokens: 0,
      sustainability_score: 0,
      total_items_listed: 0,
      total_items_sold: 0,
      total_items_donated: 0,
      total_co2_saved: 0,
      is_verified: result.user.emailVerified,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    await setDoc(doc(db, "profiles", result.user.uid), profile)
    setUserProfile(profile)
  }, [wallet.address])

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    // Create profile in Firestore if not exists
    const profileRef = doc(db, "profiles", result.user.uid)
    const profileSnap = await getDoc(profileRef)
    if (!profileSnap.exists()) {
      const profile: UserProfile = {
        id: result.user.uid,
        email: result.user.email || "",
        name: result.user.displayName || "User",
        avatar_url: result.user.photoURL || "",
        wallet_address: wallet.address || undefined,
        bio: "Sustainable fashion enthusiast",
        location: "",
        website: "",
        instagram_handle: "",
        green_tokens: 0,
        sustainability_score: 0,
        total_items_listed: 0,
        total_items_sold: 0,
        total_items_donated: 0,
        total_co2_saved: 0,
        is_verified: result.user.emailVerified,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      await setDoc(profileRef, profile)
      setUserProfile(profile)
    } else {
      setUserProfile(profileSnap.data() as UserProfile)
    }
  }, [wallet.address])

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth)
    setUser(null)
    setUserProfile(null)
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }, [])

  const resendConfirmation = useCallback(async (email: string) => {
    // Firebase does not support resending confirmation directly
    // You can trigger a password reset as a workaround
    await sendPasswordResetEmail(auth, email)
  }, [])

  const updateUserProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!user) return
    const profileRef = doc(db, "profiles", user.uid)
    await setDoc(profileRef, { ...userProfile, ...data, updated_at: new Date().toISOString() })
    setUserProfile((prev) => prev ? { ...prev, ...data, updated_at: new Date().toISOString() } : null)
  }, [user, userProfile])

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
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
