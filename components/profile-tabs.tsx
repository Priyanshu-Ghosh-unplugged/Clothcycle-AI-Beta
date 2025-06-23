"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PostCard } from "@/components/post-card"
import { Progress } from "@/components/ui/progress"
import { Leaf, Award, TrendingUp, Package } from "lucide-react"

// Mock data - in real app, this would come from API
const mockPosts = [
  {
    id: "1",
    title: "Vintage Denim Jacket",
    description: "Classic blue denim jacket in excellent condition",
    imageUrl: "/placeholder.svg?height=300&width=300",
    price: 45,
    isDonation: false,
    tags: ["vintage", "denim", "jacket"],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    ownerId: "user1",
    owner: { id: "user1", name: "You", createdAt: "2023-01-01T00:00:00Z" },
  },
]

const mockTransactions = [
  {
    id: "1",
    type: "sale",
    item: "Vintage Denim Jacket",
    amount: 45,
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "2",
    type: "donation",
    item: "Summer Dress",
    amount: 0,
    date: "2024-01-14",
    status: "completed",
  },
]

const mockBadges = [
  { id: "1", name: "Eco Warrior", description: "Listed 10+ sustainable items", icon: Leaf },
  { id: "2", name: "Community Helper", description: "Donated 5+ items", icon: Award },
  { id: "3", name: "Trendsetter", description: "High engagement on posts", icon: TrendingUp },
]

export function ProfileTabs() {
  return (
    <Tabs defaultValue="listings" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="listings">My Listings</TabsTrigger>
        <TabsTrigger value="purchases">Purchases</TabsTrigger>
        <TabsTrigger value="impact">Impact</TabsTrigger>
        <TabsTrigger value="badges">Badges</TabsTrigger>
      </TabsList>

      <TabsContent value="listings" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="purchases" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{transaction.item}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.type === "donation" ? "Donated" : "Purchased"} on {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{transaction.amount === 0 ? "Free" : `$${transaction.amount}`}</p>
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="impact" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Leaf className="h-5 w-5 mr-2 text-green-500" />
                Environmental Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">CO₂ Saved</span>
                  <span className="text-sm font-medium">45.2 kg</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Water Saved</span>
                  <span className="text-sm font-medium">1,240 L</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Items Rescued</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GreenTokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">156</div>
                <p className="text-muted-foreground mb-4">Total GreenTokens Earned</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Items Listed</span>
                    <span>+50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items Donated</span>
                    <span>+75</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community Engagement</span>
                    <span>+31</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="badges" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBadges.map((badge) => {
            const IconComponent = badge.icon
            return (
              <Card key={badge.id}>
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{badge.name}</h3>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </TabsContent>
    </Tabs>
  )
}
