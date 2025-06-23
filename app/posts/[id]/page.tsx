import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { PostDetail } from "@/components/post-detail"
import { Footer } from "@/components/footer"
import { getPost } from "@/lib/posts"

interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <PostDetail post={post} />
      </main>
      <Footer />
    </div>
  )
}
