import { prisma } from "@/lib/prisma";
import ProjectGrid from "@/components/ProjectGrid";
import { Users } from "lucide-react";

export default async function CommunityPage() {
  let projects: Array<{
    id: string;
    name: string;
    description: string;
    tags: string[];
    languages: string[];
    views: number;
    repoUrl: string | null;
    demoUrl: string | null;
    screenshots: string[];
    createdAt: string;
    author: {
      id: string;
      name: string | null;
      username: string | null;
      image: string | null;
    };
    _count: {
      likes: number;
      comments: number;
    };
  }> = [];

  try {
    const data = await prisma.project.findMany({
      take: 12,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    projects = data.map((p: typeof data[number]) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error loading community page:", error);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-400" />
          Community Projects
        </h1>
        <p className="text-sm text-zinc-500">
          Discover amazing builds from developers worldwide.
        </p>
      </div>
      <div className="stagger-children">
        <ProjectGrid
          projects={projects}
          emptyMessage="No projects in the community yet."
        />
      </div>
    </div>
  );
}
