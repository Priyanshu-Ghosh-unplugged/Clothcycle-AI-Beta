"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PostCard } from "@/components/post-card"
import { Progress } from "@/components/ui/progress"
import { Leaf, Award, TrendingUp, Package, Trash2 } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"
import { useAuth } from "@/lib/auth-context"

export function ProfileTabs() {
  const { user, userProfile } = useAuth()
  const [listings, setListings] = useState<any[]>([])
  const [purchases, setPurchases] = useState<any[]>([])
  const [badges, setBadges] = useState<any[]>([])
  const [loadingListings, setLoadingListings] = useState(false)
  const [loadingPurchases, setLoadingPurchases] = useState(false)
  const [loadingBadges, setLoadingBadges] = useState(false)

  // Fetch user listings
  useEffect(() => {
    if (!user) return
    setLoadingListings(true)
    const fetchListings = async () => {
      const q = query(collection(db, "posts"), where("ownerId", "==", user.uid))
      const snap = await getDocs(q)
      setListings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoadingListings(false)
    }
    fetchListings()
  }, [user])

  // Fetch user purchases
  useEffect(() => {
    if (!user) return
    setLoadingPurchases(true)
    const fetchPurchases = async () => {
      const q = query(collection(db, "transactions"), where("buyerId", "==", user.uid))
      const snap = await getDocs(q)
      setPurchases(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoadingPurchases(false)
    }
    fetchPurchases()
  }, [user])

  // Fetch user badges
  useEffect(() => {
    if (!user) return
    setLoadingBadges(true)
    const fetchBadges = async () => {
      const q = query(collection(db, "badges"), where("userId", "==", user.uid))
      const snap = await getDocs(q)
      setBadges(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoadingBadges(false)
    }
    fetchBadges()
  }, [user])

  // Delete listing
  const handleDeleteListing = async (id: string) => {
    await deleteDoc(doc(db, "posts", id))
    setListings(listings.filter(post => post.id !== id))
  }

  return (
    <Tabs defaultValue="listings" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="listings">My Listings</TabsTrigger>
        <TabsTrigger value="purchases">Purchases</TabsTrigger>
        <TabsTrigger value="impact">Impact</TabsTrigger>
        <TabsTrigger value="badges">Badges</TabsTrigger>
      </TabsList>

      <TabsContent value="listings" className="space-y-6">
        {loadingListings ? (
          <div>Loading...</div>
        ) : listings.length === 0 ? (
          <div className="text-center text-muted-foreground">No listings found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((post) => (
              <div key={post.id} className="relative group">
                <PostCard post={post} />
                <button
                  className="absolute top-2 right-2 bg-destructive text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
                  title="Delete Listing"
                  onClick={() => handleDeleteListing(post.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="purchases" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingPurchases ? (
              <div>Loading...</div>
            ) : purchases.length === 0 ? (
              <div className="text-center text-muted-foreground">No purchases found.</div>
            ) : (
              <div className="space-y-4">
                {purchases.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{transaction.item || transaction.postTitle || "Item"}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.type === "donation" ? "Donated" : "Purchased"} on {transaction.date || "-"}
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
            )}
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
                  <span className="text-sm font-medium">{userProfile?.total_co2_saved ?? 0} kg</span>
                </div>
                <Progress value={Math.min((userProfile?.total_co2_saved ?? 0) * 2, 100)} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Items Rescued</span>
                  <span className="text-sm font-medium">{userProfile?.total_items_listed ?? 0}</span>
                </div>
                <Progress value={Math.min((userProfile?.total_items_listed ?? 0) * 10, 100)} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Items Donated</span>
                  <span className="text-sm font-medium">{userProfile?.total_items_donated ?? 0}</span>
                </div>
                <Progress value={Math.min((userProfile?.total_items_donated ?? 0) * 10, 100)} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>GreenTokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{userProfile?.green_tokens ?? 0}</div>
                <p className="text-muted-foreground mb-4">Total GreenTokens Earned</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Items Listed</span>
                    <span>+{userProfile?.total_items_listed ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Items Donated</span>
                    <span>+{userProfile?.total_items_donated ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community Engagement</span>
                    <span>+{userProfile?.sustainability_score ?? 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="badges" className="space-y-6">
        {loadingBadges ? (
          <div>Loading...</div>
        ) : badges.length === 0 ? (
          <div className="text-center text-muted-foreground">No badges found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => {
              const IconComponent = Award // You can map badge.icon to a real icon if you store it
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
        )}
      </TabsContent>
    </Tabs>
  )
}
