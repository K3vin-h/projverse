import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectGrid from "@/components/ProjectGrid";
import {
  Github,
  Globe,
  MapPin,
  Calendar,
  Star,
  BookOpen,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      projects: {
        include: {
          author: {
            select: { id: true, name: true, username: true, image: true },
          },
          _count: { select: { likes: true, comments: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { projects: true, likes: true } },
    },
  });

  if (!user) {
    notFound();
  }

  const totalStars = user.projects.reduce(
    (sum, p) => sum + (p._count?.likes || 0),
    0
  );

  const projects = user.projects.map((p) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, authorId, ...rest } = p;
    return {
      ...rest,
      createdAt: createdAt.toISOString(),
    };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Profile Header */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#111116] p-8 mb-10">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="h-24 w-24 flex-shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/20">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Avatar"}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              user.name?.[0]?.toUpperCase() || "?"
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">
              {user.name || "Developer"}
            </h1>
            {user.username && (
              <p className="text-sm text-zinc-500 mt-0.5">
                @{user.username}
              </p>
            )}
            {user.bio && (
              <p className="text-sm text-zinc-400 mt-3 max-w-xl leading-relaxed">
                {user.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-4">
              {user.github && (
                <a
                  href={`https://github.com/${user.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                  {user.github}
                </a>
              )}
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
                >
                  <Globe className="h-3.5 w-3.5" />
                  {user.website}
                </a>
              )}
              <span className="flex items-center gap-1.5 text-xs text-zinc-600">
                <Calendar className="h-3.5 w-3.5" />
                Joined {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/[0.06]">
          {[
            {
              icon: BookOpen,
              label: "Projects",
              value: user._count.projects,
              color: "text-blue-400",
            },
            {
              icon: Star,
              label: "Total Stars",
              value: totalStars,
              color: "text-yellow-400",
            },
            {
              icon: MapPin,
              label: "Contributions",
              value: user._count.likes,
              color: "text-green-400",
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="text-center">
              <Icon className={`h-4 w-4 ${color} mx-auto mb-1.5`} />
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-zinc-500">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Projects */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-5">
          Featured Projects
        </h2>
        <div className="stagger-children">
          <ProjectGrid
            projects={projects}
            emptyMessage="This developer hasn't published any projects yet."
          />
        </div>
      </div>
    </div>
  );
}
