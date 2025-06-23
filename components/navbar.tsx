"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useWallet } from "@/lib/wallet-context"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Recycle, Plus, User, LogOut, Wallet, Coins } from "lucide-react"
import { memo } from "react"

function NavbarComponent() {
  const { user, userProfile, signOut } = useAuth()
  const { address, disconnect, isConnected } = useWallet()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Recycle className="h-6 w-6" />
            <span className="font-bold text-xl">ClothCycle AI</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/marketplace" className="text-sm font-medium hover:text-primary">
              Marketplace
            </Link>
            {isConnected && (
              <Link href="/create" className="text-sm font-medium hover:text-primary">
                List Item
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {user && isConnected ? (
              <>
                <Link href="/create">
                  <Button size="sm" className="hidden md:flex">
                    <Plus className="h-4 w-4 mr-2" />
                    List Item
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 px-3 rounded-full">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>
                            {userProfile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden md:flex flex-col items-start">
                          <span className="text-sm font-medium">{userProfile?.name || "User"}</span>
                          <div className="flex items-center space-x-1">
                            <Coins className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-muted-foreground">{userProfile?.green_tokens || 0} GT</span>
                          </div>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="end">
                    <div className="p-4 space-y-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>
                            {userProfile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{userProfile?.name || "User"}</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-muted rounded-lg p-2 text-center">
                          <div className="font-semibold text-green-600">{userProfile?.green_tokens || 0}</div>
                          <div className="text-xs text-muted-foreground">GreenTokens</div>
                        </div>
                        <div className="bg-muted rounded-lg p-2 text-center">
                          <div className="font-semibold text-blue-600">{userProfile?.sustainability_score || 0}</div>
                          <div className="text-xs text-muted-foreground">Eco Score</div>
                        </div>
                      </div>

                      {address && (
                        <div className="flex items-center space-x-2 p-2 bg-muted rounded-lg">
                          <Wallet className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-mono">
                            {address.slice(0, 6)}...{address.slice(-4)}
                          </span>
                          <Badge variant="secondary" className="ml-auto">
                            Connected
                          </Badge>
                        </div>
                      )}
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile & Stats
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={disconnect}>
                      <Wallet className="mr-2 h-4 w-4" />
                      Disconnect Wallet
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/auth">
                <Button>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect & Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

// Memoize navbar to prevent unnecessary re-renders
export const Navbar = memo(NavbarComponent)
