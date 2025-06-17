"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Recycle, User, LogOut, Plus, Heart, ShoppingBag } from "lucide-react"

export function Header() {
  const { data: session, status } = useSession()

  const handleSignIn = () => {
    signIn()
  }

  const handleSignOut = () => {
    signOut()
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Recycle className="h-6 w-6" />
          <span className="font-bold text-xl">ClothCycle AI</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/marketplace" className="text-sm font-medium hover:text-primary">
            Marketplace
          </Link>
          <Link href="/donate" className="text-sm font-medium hover:text-primary">
            Donate
          </Link>
          {session && (
            <Link href="/create" className="text-sm font-medium hover:text-primary">
              Create Post
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <ModeToggle />

          {status === "loading" ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback>
                      {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {session.user?.name && <p className="font-medium">{session.user.name}</p>}
                    {session.user?.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{session.user.email}</p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/create" className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/donate" className="flex items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    Donate Items
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/marketplace" className="flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Marketplace
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onSelect={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button onClick={handleSignIn}>Get Started</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
