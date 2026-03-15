import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Plus,
  Eye,
  Heart,
  MessageCircle,
  Pencil,
  Trash2,
  LayoutDashboard,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import DeleteProjectButton from "./DeleteProjectButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    where: { authorId: session.user.id },
    include: {
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalViews = projects.reduce((sum: number, p: typeof projects[number]) => sum + p.views, 0);
  const totalLikes = projects.reduce(
    (sum: number, p: typeof projects[number]) => sum + p._count.likes,
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-blue-400" />
            Dashboard
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your projects
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          {
            label: "Total Projects",
            value: projects.length,
            icon: LayoutDashboard,
            color: "text-blue-400",
          },
          {
            label: "Total Views",
            value: totalViews,
            icon: Eye,
            color: "text-green-400",
          },
          {
            label: "Total Likes",
            value: totalLikes,
            icon: Heart,
            color: "text-red-400",
          },
          {
            label: "Comments",
            value: projects.reduce(
              (sum: number, p: typeof projects[number]) => sum + p._count.comments,
              0
            ),
            icon: MessageCircle,
            color: "text-violet-400",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-white/[0.06] bg-[#111116] p-5"
          >
            <Icon className={`h-5 w-5 ${color} mb-3`} />
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-zinc-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Projects list */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01]">
          <div className="h-16 w-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-zinc-600" />
          </div>
          <p className="text-zinc-500 text-sm mb-4">
            You haven&apos;t created any projects yet
          </p>
          <Link
            href="/dashboard/new"
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Create your first project →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project: typeof projects[number]) => (
            <div
              key={project.id}
              className="flex items-center gap-5 rounded-xl border border-white/[0.06] bg-[#111116] p-5 hover:border-white/[0.1] hover:bg-[#141419] transition-all group"
            >
              {/* Screenshot or placeholder */}
              {project.screenshots?.[0] ? (
                <div className="h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-white/[0.03]">
                  <img
                    src={project.screenshots[0]}
                    alt={project.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-16 w-24 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-600/20 to-violet-600/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-white/10">
                    {project.name[0]}
                  </span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/projects/${project.id}`}
                  className="text-sm font-semibold text-white hover:text-blue-400 transition-colors line-clamp-1"
                >
                  {project.name}
                </Link>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <Eye className="h-3 w-3" />
                    {project.views}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <Heart className="h-3 w-3" />
                    {project._count.likes}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <MessageCircle className="h-3 w-3" />
                    {project._count.comments}
                  </span>
                  <span className="text-xs text-zinc-600">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                  href={`/dashboard/edit/${project.id}`}
                  className="p-2 rounded-lg bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteProjectButton projectId={project.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
