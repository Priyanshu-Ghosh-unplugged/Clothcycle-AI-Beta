import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Sparkles } from "lucide-react"
import type { Post } from "@/lib/types"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={post.imageUrl || "/placeholder.svg?height=300&width=300"}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-2 left-2">
            {post.isDonation ? (
              <Badge className="bg-green-500 hover:bg-green-600">Free</Badge>
            ) : (
              <Badge className="bg-primary">${post.price}</Badge>
            )}
          </div>
          <div className="absolute top-2 right-2">
            <button className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
              <Heart className="h-4 w-4" />
            </button>
          </div>
          {post.aiInsights && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary" className="bg-white/90">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Analyzed
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.description}</p>

          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>By {post.owner?.name || "Anonymous"}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
