"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { useWallet } from "@/lib/wallet-context"
import { Edit, Wallet, Award, TrendingUp, Leaf, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ProfileHeader() {
  const { user, userProfile } = useAuth()
  const { address } = useWallet()
  const { toast } = useToast()

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const sustainabilityLevel =
    (userProfile?.sustainability_score || 0) >= 80
      ? "Eco Champion"
      : (userProfile?.sustainability_score || 0) >= 60
        ? "Green Warrior"
        : (userProfile?.sustainability_score || 0) >= 40
          ? "Eco Explorer"
          : "Getting Started"

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl">
                {userProfile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold">{userProfile?.name || "Anonymous User"}</h1>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Award className="h-3 w-3" />
                  <span>{sustainabilityLevel}</span>
                </Badge>
                {userProfile?.is_verified && <Badge className="bg-blue-500">Verified</Badge>}
              </div>

              <p className="text-muted-foreground mb-3">
                Member since {new Date(user?.created_at || Date.now()).getFullYear()}
              </p>

              {userProfile?.bio && <p className="text-sm text-muted-foreground mb-3 max-w-md">{userProfile.bio}</p>}

              {address && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-2 bg-muted rounded-lg px-3 py-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-mono">
                      {address.slice(0, 8)}...{address.slice(-6)}
                    </span>
                    <Button variant="ghost" size="sm" onClick={copyAddress} className="h-6 w-6 p-0">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Connected
                  </Badge>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 w-full lg:w-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary flex items-center justify-center space-x-1">
                  <span>{userProfile?.total_items_listed || 0}</span>
                </div>
                <div className="text-sm text-muted-foreground">Items Listed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 flex items-center justify-center space-x-1">
                  <span>{userProfile?.total_items_sold || 0}</span>
                </div>
                <div className="text-sm text-muted-foreground">Items Sold</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 flex items-center justify-center space-x-1">
                  <span>{userProfile?.total_items_donated || 0}</span>
                </div>
                <div className="text-sm text-muted-foreground">Items Donated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 flex items-center justify-center space-x-1">
                  <span>{userProfile?.green_tokens || 0}</span>
                </div>
                <div className="text-sm text-muted-foreground">GreenTokens</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center">
                    <Leaf className="h-4 w-4 mr-1 text-green-500" />
                    Sustainability Score
                  </span>
                  <span className="text-sm font-bold">{userProfile?.sustainability_score || 0}/100</span>
                </div>
                <Progress value={userProfile?.sustainability_score || 0} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
                    CO₂ Impact
                  </span>
                  <span className="text-sm font-bold">{userProfile?.total_co2_saved || 0} kg saved</span>
                </div>
                <Progress value={Math.min(((userProfile?.total_co2_saved || 0) / 100) * 100, 100)} className="h-2" />
              </div>
            </div>
          </div>

          <Button variant="outline" className="self-start">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
