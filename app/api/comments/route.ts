import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, content } = await request.json();

    if (!projectId || !content) {
      return NextResponse.json(
        { error: "Project ID and content are required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        userId: session.user.id,
        projectId,
        content,
      },
      include: {
        user: {
          select: { id: true, name: true, username: true, image: true },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
