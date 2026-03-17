import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

// GET single post
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PUT update post
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, author, category, imageUrl } = body;

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: "Title, content and author are required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.update({
      where: { id },
      data: { title, content, author, imageUrl, category: category || "General" },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE post
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
