import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PostForm } from "@/components/posts/post-form"

export default async function CreatePostPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/create")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Item</h1>
        <p className="text-muted-foreground mt-2">Share your pre-loved fashion with the community</p>
      </div>

      <PostForm />
    </div>
  )
}
