import { notFound } from "next/navigation"
import { PostDetail } from "./post-detail"
import { createServerClient } from "@/lib/supabase"

interface PostPageProps {
  params: {
    id: string
  }
}

async function getPost(id: string) {
  const supabase = createServerClient()

  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      owner:users(id, name, email, image)
    `)
    .eq("id", id)
    .eq("status", "available")
    .single()

  if (error || !post) {
    return null
  }

  return post
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.id)

  if (!post) {
    notFound()
  }

  return <PostDetail post={post} />
}
