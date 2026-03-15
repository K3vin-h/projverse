import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
            github: true,
          },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.project.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    // Check if current user has liked
    const session = await getServerSession(authOptions);
    let hasLiked = false;
    if (session?.user?.id) {
      const like = await prisma.like.findUnique({
        where: {
          userId_projectId: {
            userId: session.user.id,
            projectId: id,
          },
        },
      });
      hasLiked = !!like;
    }

    return NextResponse.json({ ...project, hasLiked });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (existing.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, repoUrl, demoUrl, docUrl, tags, languages, screenshots } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        description: description ?? existing.description,
        repoUrl: repoUrl !== undefined ? repoUrl : existing.repoUrl,
        demoUrl: demoUrl !== undefined ? demoUrl : existing.demoUrl,
        docUrl: docUrl !== undefined ? docUrl : existing.docUrl,
        tags: tags ?? existing.tags,
        languages: languages ?? existing.languages,
        screenshots: screenshots ?? existing.screenshots,
      },
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true },
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (existing.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
