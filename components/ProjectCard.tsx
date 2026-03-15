"use client";

import Link from "next/link";
import { Heart, Eye, ExternalLink, Github } from "lucide-react";
import { timeAgo, truncate } from "@/lib/utils";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    tags: string[];
    languages: string[];
    views: number;
    repoUrl?: string | null;
    demoUrl?: string | null;
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
  };
}

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-500",
  Python: "bg-green-500",
  Rust: "bg-orange-600",
  Go: "bg-cyan-500",
  Java: "bg-red-500",
  "C++": "bg-pink-600",
  C: "bg-gray-500",
  Ruby: "bg-red-600",
  PHP: "bg-indigo-500",
  Swift: "bg-orange-500",
  Kotlin: "bg-purple-500",
  Dart: "bg-sky-500",
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className="group block">
      <div className="relative rounded-2xl border border-white/[0.06] bg-[#111116] overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:bg-[#141419] hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
        {/* Screenshot or gradient header */}
        {project.screenshots?.[0] ? (
          <div className="relative h-44 overflow-hidden">
            <img
              src={project.screenshots[0]}
              alt={project.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent" />
          </div>
        ) : (
          <div className="relative h-44 bg-gradient-to-br from-blue-600/20 via-violet-600/20 to-indigo-600/20 flex items-center justify-center">
            <div className="text-4xl font-bold text-white/10">
              {project.name[0]}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent" />
          </div>
        )}

        <div className="p-5">
          {/* Languages */}
          {project.languages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {project.languages.slice(0, 3).map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400"
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      languageColors[lang] || "bg-zinc-500"
                    }`}
                  />
                  {lang}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-base font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
            {project.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-zinc-500 mb-4 line-clamp-2">
            {truncate(project.description, 120)}
          </p>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="px-2 py-0.5 text-xs text-zinc-500">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white">
                {project.author?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <span className="text-xs text-zinc-500">
                {project.author?.username || project.author?.name || "Unknown"}
              </span>
              <span className="text-xs text-zinc-600">·</span>
              <span className="text-xs text-zinc-600">
                {timeAgo(project.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <Heart className="h-3.5 w-3.5" />
                {project._count?.likes || 0}
              </span>
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <Eye className="h-3.5 w-3.5" />
                {project.views}
              </span>
            </div>
          </div>

          {/* External links */}
          {(project.repoUrl || project.demoUrl) && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.06]">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                  Source
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Demo
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
