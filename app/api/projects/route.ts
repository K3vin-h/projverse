import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const language = searchParams.get("language") || "";
    const tag = searchParams.get("tag") || "";
    const sort = searchParams.get("sort") || "recent";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    const conditions: Record<string, unknown>[] = [];

    if (search) {
      conditions.push(
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      );
    }

    if (language) {
      conditions.push({ languages: { has: language } });
    }

    if (tag) {
      conditions.push({ tags: { has: tag } });
    }

    if (conditions.length > 0) {
      if (search && (language || tag)) {
        where.AND = [
          { OR: conditions.filter((c) => "name" in c || "description" in c) },
          ...conditions.filter((c) => "languages" in c || "tags" in c),
        ];
      } else if (search) {
        where.OR = conditions;
      } else {
        Object.assign(where, ...conditions);
      }
    }

    let orderBy: Record<string, string> = {};
    switch (sort) {
      case "likes":
        // Handled separately in the query via { likes: { _count: "desc" } }
        break;
      case "views":
        orderBy = { views: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, username: true, image: true },
          },
          _count: { select: { likes: true, comments: true } },
        },
        orderBy: sort === "likes"
          ? { likes: { _count: "desc" } }
          : orderBy,
        skip,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, repoUrl, demoUrl, docUrl, tags, languages, screenshots } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        repoUrl: repoUrl || null,
        demoUrl: demoUrl || null,
        docUrl: docUrl || null,
        tags: tags || [],
        languages: languages || [],
        screenshots: screenshots || [],
        authorId: session.user.id,
      },
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
