import type { Post } from "@/lib/types"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, getDoc, doc, query, orderBy } from "firebase/firestore"

// Mock data for development - replace with real Supabase queries
const mockPosts: Post[] = [
  {
    id: "1",
    title: "Vintage Denim Jacket",
    description:
      "Classic blue denim jacket in excellent condition. Perfect for layering and adding a vintage touch to any outfit.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    price: 45,
    isDonation: false,
    tags: ["vintage", "denim", "jacket", "sustainable"],
    ownerId: "user1",
    owner: {
      id: "user1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      createdAt: "2023-01-15T00:00:00Z",
    },
    aiInsights: {
      clothingType: "Jacket",
      condition: "Excellent",
      sustainabilityScore: 85,
      tags: ["vintage", "denim", "sustainable"],
      upcycleIdeas: ["Add patches for personalization", "Distress for modern look"],
      styleTips: ["Pair with white tee and black jeans", "Layer over summer dresses"],
      brandAnalysis: {
        brand: "Levi's",
        sustainabilityRating: "B+",
        fastFashionRisk: 20,
      },
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Floral Summer Dress",
    description: "Beautiful floral print dress, perfect for summer occasions. Barely worn, like new condition.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    price: 0,
    isDonation: true,
    tags: ["dress", "floral", "summer", "donation"],
    ownerId: "user2",
    owner: {
      id: "user2",
      name: "Emma Wilson",
      email: "emma@example.com",
      createdAt: "2023-03-20T00:00:00Z",
    },
    aiInsights: {
      clothingType: "Dress",
      condition: "Like New",
      sustainabilityScore: 92,
      tags: ["dress", "floral", "sustainable"],
      upcycleIdeas: ["Shorten for casual wear", "Add belt for different silhouette"],
      styleTips: ["Perfect for garden parties", "Pair with sandals and sun hat"],
    },
    createdAt: "2024-01-14T14:30:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
  },
  {
    id: "3",
    title: "Designer Wool Coat",
    description: "Luxury wool coat from premium brand. Timeless design that never goes out of style.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    price: 120,
    isDonation: false,
    tags: ["coat", "wool", "designer", "luxury"],
    ownerId: "user3",
    owner: {
      id: "user3",
      name: "Michael Chen",
      email: "michael@example.com",
      createdAt: "2023-02-10T00:00:00Z",
    },
    aiInsights: {
      clothingType: "Coat",
      condition: "Good",
      sustainabilityScore: 78,
      tags: ["coat", "wool", "luxury"],
      styleTips: ["Perfect for business meetings", "Dress up or down easily"],
      brandAnalysis: {
        brand: "Hugo Boss",
        sustainabilityRating: "B",
        fastFashionRisk: 15,
      },
    },
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
  },
]

export async function getPosts(): Promise<Post[]> {
  const postsCol = collection(db, "posts")
  const q = query(postsCol, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Post))
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const posts = await getPosts()
  return posts.slice(0, 3)
}

export async function getPost(id: string): Promise<Post | null> {
  const postDoc = doc(db, "posts", id)
  const docSnap = await getDoc(postDoc)
  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() } as Post
}

export async function createPost(postData: Omit<Post, "id" | "createdAt" | "updatedAt">): Promise<Post> {
  const now = new Date().toISOString()
  const docRef = await addDoc(collection(db, "posts"), {
    ...postData,
    createdAt: now,
    updatedAt: now,
  })
  const docSnap = await getDoc(docRef)
  return { id: docSnap.id, ...docSnap.data() } as Post
}
