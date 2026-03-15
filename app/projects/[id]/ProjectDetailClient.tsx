"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import {
  Heart,
  Eye,
  Github,
  ExternalLink,
  FileText,
  ArrowLeft,
  Share2,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import CommitTimeline from "@/components/CommitTimeline";
import CommentSection from "@/components/CommentSection";

interface ProjectDetailProps {
  projectId: string;
}

interface ProjectData {
  id: string;
  name: string;
  description: string;
  tags: string[];
  languages: string[];
  views: number;
  repoUrl: string | null;
  demoUrl: string | null;
  docUrl: string | null;
  screenshots: string[];
  createdAt: string;
  updatedAt: string;
  hasLiked: boolean;
  author: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
    bio: string | null;
    github: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

export default function ProjectDetailClient({
  projectId,
}: ProjectDetailProps) {
  const { data: session } = useSession();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [selectedScreenshot, setSelectedScreenshot] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
          setLiked(data.hasLiked);
          setLikeCount(data._count.likes);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleLike = async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        <div className="h-6 w-40 bg-white/[0.06] rounded mb-8" />
        <div className="h-10 w-2/3 bg-white/[0.06] rounded mb-4" />
        <div className="h-4 w-1/3 bg-white/[0.04] rounded mb-8" />
        <div className="h-64 bg-white/[0.04] rounded-2xl mb-8" />
        <div className="space-y-3">
          <div className="h-4 bg-white/[0.04] rounded" />
          <div className="h-4 w-5/6 bg-white/[0.04] rounded" />
          <div className="h-4 w-4/6 bg-white/[0.04] rounded" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">
          Project Not Found
        </h2>
        <p className="text-zinc-500 mb-6">
          The project you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/explore"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          ← Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Breadcrumb */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Explore
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-3">
            {project.name}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/profile/${project.author.id}`}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white">
                {project.author?.name?.[0]?.toUpperCase() || "?"}
              </div>
              {project.author.username || project.author.name}
            </Link>
            <span className="text-zinc-600">·</span>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Calendar className="h-3 w-3" />
              {formatDate(project.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${
              liked
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${liked ? "fill-current" : ""}`}
            />
            {likeCount}
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm text-zinc-400">
            <Eye className="h-4 w-4" />
            {project.views}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="p-2 rounded-xl border border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tags & Languages */}
      <div className="flex flex-wrap gap-2 mb-8">
        {project.languages.map((lang) => (
          <span
            key={lang}
            className="px-3 py-1 text-xs rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20"
          >
            {lang}
          </span>
        ))}
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-3 mb-8">
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.08] transition-all"
          >
            <Github className="h-4 w-4" />
            GitHub Repository
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-600/10"
          >
            <ExternalLink className="h-4 w-4" />
            Live Demo
          </a>
        )}
        {project.docUrl && (
          <a
            href={project.docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.08] transition-all"
          >
            <FileText className="h-4 w-4" />
            Documentation
          </a>
        )}
      </div>

      {/* Screenshots */}
      {project.screenshots.length > 0 && (
        <div className="mb-10">
          <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-[#111116]">
            <img
              src={project.screenshots[selectedScreenshot]}
              alt={`${project.name} screenshot ${selectedScreenshot + 1}`}
              className="w-full object-cover max-h-[500px]"
            />
          </div>
          {project.screenshots.length > 1 && (
            <div className="flex gap-2 mt-3">
              {project.screenshots.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedScreenshot(i)}
                  className={`h-16 w-24 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedScreenshot === i
                      ? "border-blue-500"
                      : "border-white/[0.06] opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#111116] p-6 sm:p-8 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">
          About this project
        </h2>
        <div className="prose-dark text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.description}
          </ReactMarkdown>
        </div>
      </div>

      {/* GitHub Integration */}
      {project.repoUrl && project.repoUrl.includes("github.com") && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Github className="h-5 w-5 text-zinc-400" />
            GitHub Activity
          </h2>
          <CommitTimeline repoUrl={project.repoUrl} />
        </div>
      )}

      {/* Comments */}
      <CommentSection projectId={project.id} />
    </div>
  );
}
