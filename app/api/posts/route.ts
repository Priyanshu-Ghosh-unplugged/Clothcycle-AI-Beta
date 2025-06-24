import { NextRequest, NextResponse } from "next/server";
import { createPost } from "@/lib/posts";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const post = await createPost(data);
    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 