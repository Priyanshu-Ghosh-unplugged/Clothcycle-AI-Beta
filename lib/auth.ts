import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client for NextAuth
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false

      try {
        // Check if user exists in our database
        const { data: existingUser } = await supabase.from("users").select("*").eq("email", user.email).single()

        if (!existingUser) {
          // Create new user in our database
          const { error } = await supabase.from("users").insert({
            email: user.email,
            name: user.name,
            image: user.image,
            email_verified: new Date().toISOString(),
          })

          if (error) {
            console.error("Error creating user:", error)
            return false
          }
        }

        return true
      } catch (error) {
        console.error("SignIn error:", error)
        return false
      }
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          // Fetch user data from our database
          const { data: userData } = await supabase.from("users").select("*").eq("email", session.user.email).single()

          if (userData) {
            session.user.id = userData.id
            session.user.wallet_address = userData.wallet_address
          }
        } catch (error) {
          console.error("Session callback error:", error)
        }
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
