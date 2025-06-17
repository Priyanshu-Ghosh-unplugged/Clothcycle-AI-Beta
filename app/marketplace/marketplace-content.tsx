"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { PostCard } from "@/components/posts/post-card"
import type { Post } from "@/lib/supabase"
import { Search, Heart, ShoppingBag } from "lucide-react"

export function MarketplaceContent() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "donations" | "sales">("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [filter])

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams()
      if (filter === "donations") params.append("donations", "true")
      if (filter === "sales") params.append("sales", "true")

      const response = await fetch(`/api/posts?${params}`)
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} size="sm">
            All Items
          </Button>
          <Button
            variant={filter === "donations" ? "default" : "outline"}
            onClick={() => setFilter("donations")}
            size="sm"
          >
            <Heart className="h-4 w-4 mr-2" />
            Free Items
          </Button>
          <Button variant={filter === "sales" ? "default" : "outline"} onClick={() => setFilter("sales")} size="sm">
            <ShoppingBag className="h-4 w-4 mr-2" />
            For Sale
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{filteredPosts.length} items found</p>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">{posts.filter((p) => p.is_donation).length} free items</Badge>
          <Badge variant="secondary">{posts.filter((p) => !p.is_donation).length} for sale</Badge>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchQuery ? (
              <>
                <p>No items found matching "{searchQuery}"</p>
                <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">
                  Clear search
                </Button>
              </>
            ) : (
              <p>No items available in this category</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
