"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PostCard } from "@/components/posts/post-card"
import { Badge } from "@/components/ui/badge"
import { Heart, Plus, Package, Users, Leaf } from "lucide-react"
import Link from "next/link"
import type { Post } from "@/lib/supabase"

export function DonateContent() {
  const [donationPosts, setDonationPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDonationPosts()
  }, [])

  const fetchDonationPosts = async () => {
    try {
      const response = await fetch("/api/posts?donations=true")
      const posts = await response.json()
      setDonationPosts(posts)
    } catch (error) {
      console.error("Error fetching donation posts:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Impact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardHeader>
            <Heart className="h-12 w-12 mx-auto text-red-500" />
            <CardTitle>Items Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{donationPosts.length}</div>
            <p className="text-muted-foreground">Ready for new homes</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Users className="h-12 w-12 mx-auto text-blue-500" />
            <CardTitle>Community Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">500+</div>
            <p className="text-muted-foreground">People helped this month</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Leaf className="h-12 w-12 mx-auto text-green-500" />
            <CardTitle>Environmental Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2.3 kg</div>
            <p className="text-muted-foreground">CO₂ saved per donation</p>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Donations Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold">List Your Item</h3>
              <p className="text-sm text-muted-foreground">
                Upload photos and mark your item as "donation" when creating a post
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold">Someone Claims It</h3>
              <p className="text-sm text-muted-foreground">Community members browse and claim items they love</p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold">We Handle Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Recipient pays only for delivery ($5.99), you ship for free
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="text-lg px-8">
          <Link href="/create">
            <Plus className="h-5 w-5 mr-2" />
            Donate an Item
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="text-lg px-8">
          <Link href="/marketplace?filter=donations">
            <Heart className="h-5 w-5 mr-2" />
            Browse Donations
          </Link>
        </Button>
      </div>

      {/* Recent Donations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Donations</h2>
          <Badge variant="secondary">{donationPosts.length} items available</Badge>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading donations...</div>
        ) : donationPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {donationPosts.slice(0, 8).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No donations yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to donate an item to the community!</p>
              <Button asChild>
                <Link href="/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Donate Your First Item
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {donationPosts.length > 8 && (
          <div className="text-center">
            <Button asChild variant="outline">
              <Link href="/marketplace?filter=donations">View All Donations</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
