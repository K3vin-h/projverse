import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProjectGrid from "@/components/ProjectGrid";
import { ArrowRight, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
//home page
export default async function HomePage() {
  let trendingProjects: Array<{
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

  let recentProjects: typeof trendingProjects = [];
  let projectCount = 0;
  let userCount = 0;

  try {
    //displaying the projects from the database, 6 trending and 6 recent projects
    const [trending, recent, pCount, uCount] = await Promise.all([
      prisma.project.findMany({
        take: 6,
        orderBy: { likes: { _count: "desc" } },
        include: {
          author: {
            select: { id: true, name: true, username: true, image: true },
          },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      prisma.project.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { id: true, name: true, username: true, image: true },
          },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      prisma.project.count(),
      prisma.user.count(),
    ]);

    trendingProjects = trending.map((p: (typeof trending)[number]) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    }));
    recentProjects = recent.map((p: (typeof recent)[number]) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
    }));
    projectCount = pCount;
    userCount = uCount;
  } catch (error) {
    console.error("Error loading homepage data:", error);
  }

  return (
    //this is the home page component, it is used to display the home page
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              Community-Driven Developer Showcase
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              Discover Amazing
              <br />
              <span className="gradient-text">Developer Projects</span>
            </h1>

            <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
              Showcase your builds, explore innovative projects, and connect
              with a vibrant developer community.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/explore"
                className="flex items-center gap-2 px-8 py-3.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
              >
                Explore Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 px-8 py-3.5 text-sm font-medium text-zinc-300 bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.08] transition-all"
              >
                Join Community
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-16">
            {[
              { icon: Users, label: "Developers", value: userCount },
              { icon: Zap, label: "Projects", value: projectCount },
              {
                icon: TrendingUp,
                label: "This Week",
                value: recentProjects.length,
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Icon className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-xl font-bold text-white">{value}</div>
                <div className="text-xs text-zinc-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Projects */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-400" />
              Trending Projects
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Most loved by the community
            </p>
          </div>
          <Link
            href="/explore?sort=likes"
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="stagger-children">
          <ProjectGrid
            projects={trendingProjects}
            emptyMessage="No trending projects yet. Be the first to share!"
          />
        </div>
      </section>

      {/* Recent Projects */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-white/[0.04]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              Recently Added
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Fresh projects from the community
            </p>
          </div>
          <Link
            href="/explore?sort=recent"
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="stagger-children">
          <ProjectGrid
            projects={recentProjects}
            emptyMessage="No projects yet. Create the first one!"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl border border-white/[0.06] bg-gradient-to-br from-blue-600/10 via-[#111116] to-violet-600/10 p-12 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Showcase Your Work?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
              Join our community of developers and share your amazing projects
              with the world.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © 2026 Projverse . Built for developers, by developers.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/explore"
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/community"
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Community
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
