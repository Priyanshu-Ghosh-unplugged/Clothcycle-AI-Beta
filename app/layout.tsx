import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/layout/header"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ClothCycle AI - Sustainable Fashion Platform",
  description: "Make your wardrobe more sustainable, social, and smart with AI-powered fashion insights.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="min-h-screen bg-background">
              <Header />
              <main className="container mx-auto px-4 py-8">{children}</main>
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
