"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/posts/post-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Package, Heart, ShoppingBag, TrendingUp, Leaf, Plus } from "lucide-react"
import Link from "next/link"
import type { Post, Transaction } from "@/lib/supabase"

export function ProfileContent() {
  const { data: session } = useSession()
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalItems: 0,
    itemsDonated: 0,
    itemsSold: 0,
    totalEarnings: 0,
    sustainabilityScore: 0,
  })

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData()
    }
  }, [session])

  const fetchUserData = async () => {
    try {
      // Fetch user's posts
      const postsResponse = await fetch(`/api/users/${session?.user?.id}/posts`)
      const posts = await postsResponse.json()
      setUserPosts(posts)

      // Fetch user's transactions
      const transactionsResponse = await fetch(`/api/users/${session?.user?.id}/transactions`)
      const userTransactions = await transactionsResponse.json()
      setTransactions(userTransactions)

      // Calculate stats
      const totalItems = posts.length
      const itemsDonated = posts.filter((p: Post) => p.is_donation && p.status !== "available").length
      const itemsSold = posts.filter((p: Post) => !p.is_donation && p.status === "sold").length
      const totalEarnings = userTransactions
        .filter((t: Transaction) => t.seller_id === session?.user?.id && t.status === "completed")
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
      const sustainabilityScore = Math.round(
        posts.reduce((sum: number, p: Post) => sum + p.eco_score, 0) / Math.max(posts.length, 1),
      )

      setStats({
        totalItems,
        itemsDonated,
        itemsSold,
        totalEarnings,
        sustainabilityScore,
      })
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="text-2xl">
                {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{session?.user?.name || "Anonymous User"}</h2>
              <p className="text-muted-foreground">{session?.user?.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary">
                  <Leaf className="h-3 w-3 mr-1" />
                  Sustainability Score: {stats.sustainabilityScore}/100
                </Badge>
                <Badge variant="outline">Member since {new Date().getFullYear()}</Badge>
              </div>
            </div>
            <Button asChild>
              <Link href="/create">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">Items in your closet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Donated</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.itemsDonated}</div>
            <p className="text-xs text-muted-foreground">Given to community</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.itemsSold}</div>
            <p className="text-xs text-muted-foreground">Successfully sold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">My Items</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          {userPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No items yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start building your sustainable wardrobe by adding your first item.
                </p>
                <Button asChild>
                  <Link href="/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Item
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">
                          {transaction.transaction_type === "donation" ? "Donation" : "Sale"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${transaction.total_amount.toFixed(2)}</p>
                        <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                <p className="text-muted-foreground">Your buying and selling activity will appear here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="h-5 w-5 mr-2" />
                  Environmental Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Items kept from landfill</p>
                  <p className="text-2xl font-bold">{stats.itemsDonated + stats.itemsSold}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average sustainability score</p>
                  <p className="text-2xl font-bold">{stats.sustainabilityScore}/100</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CO₂ saved (estimated)</p>
                  <p className="text-2xl font-bold">{((stats.itemsDonated + stats.itemsSold) * 2.3).toFixed(1)} kg</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Community Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">People helped through donations</p>
                  <p className="text-2xl font-bold">{stats.itemsDonated}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sustainable sales made</p>
                  <p className="text-2xl font-bold">{stats.itemsSold}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Community contribution</p>
                  <Badge variant="secondary" className="text-sm">
                    {stats.itemsDonated > 10
                      ? "Super Contributor"
                      : stats.itemsDonated > 5
                        ? "Active Contributor"
                        : stats.itemsDonated > 0
                          ? "Contributor"
                          : "New Member"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
