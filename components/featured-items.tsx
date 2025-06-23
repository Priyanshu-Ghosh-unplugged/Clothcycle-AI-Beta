import { getFeaturedPosts } from "@/lib/posts"
import { PostCard } from "@/components/post-card"

export async function FeaturedItems() {
  const posts = await getFeaturedPosts()

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Items</h2>
          <p className="text-muted-foreground text-lg">Discover amazing sustainable fashion finds from our community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
