"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import ProjectGrid from "@/components/ProjectGrid";

interface Project {
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
}

const LANGUAGES = [
  "TypeScript", "JavaScript", "Python", "Rust", "Go", "Java", "C++", "Ruby",
];
const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "likes", label: "Most Liked" },
  { value: "views", label: "Most Viewed" },
  { value: "oldest", label: "Oldest" },
];

export default function ExplorePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (language) params.set("language", language);
      params.set("sort", sort);
      params.set("page", page.toString());
      params.set("limit", "12");

      const res = await fetch(`/api/projects?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  }, [search, language, sort, page]);

  useEffect(() => {
    const debounce = setTimeout(fetchProjects, 300);
    return () => clearTimeout(debounce);
  }, [fetchProjects]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Explore Projects
        </h1>
        <p className="text-sm text-zinc-500">
          Discover amazing builds from developers worldwide
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search projects by name or technology..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              showFilters
                ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Filters</span>
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="rounded-xl border border-white/[0.06] bg-[#111116] p-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-2 block">
                Language
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setLanguage("");
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    !language
                      ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                      : "border-white/[0.06] text-zinc-500 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  All
                </button>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang === language ? "" : lang);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      language === lang
                        ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                        : "border-white/[0.06] text-zinc-500 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-400 mb-2 block">
                Sort By
              </label>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSort(opt.value);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                      sort === opt.value
                        ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                        : "border-white/[0.06] text-zinc-500 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.06] bg-[#111116] overflow-hidden"
            >
              <div className="h-44 bg-white/[0.03] animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-2/3 bg-white/[0.06] rounded animate-pulse" />
                <div className="h-3 w-full bg-white/[0.04] rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-white/[0.04] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ProjectGrid
          projects={projects}
          emptyMessage="No projects match your search. Try different filters."
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-9 w-9 rounded-lg text-sm transition-all ${
                page === p
                  ? "bg-blue-600 text-white"
                  : "bg-white/[0.03] text-zinc-500 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
