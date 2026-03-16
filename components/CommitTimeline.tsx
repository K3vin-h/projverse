"use client";

import { useState, useEffect } from "react";
import { GitCommit, ExternalLink, User } from "lucide-react";
import { timeAgo } from "@/lib/utils";
//this is the commit interface, it is used to define the structure of a commit
interface Commit {
  sha: string;
  fullSha: string;
  message: string;
  author: string;
  authorLogin?: string;
  authorAvatar?: string;
  date: string;
  url: string;
}

//this is the github data interface, it is used to define the structure of the github data
interface GitHubData {
  stars: number;
  forks: number;
  mainLanguage: string;
  lastUpdate: string;
  languages: Array<{ name: string; percentage: number }>;
  commits: Commit[];
}

//this is the commit timeline props interface, it is used to define the structure of the commit timeline props
interface CommitTimelineProps {
  repoUrl: string;
}

export default function CommitTimeline({ repoUrl }: CommitTimelineProps) {
  //create state for data, loading, and error
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) {
          setError("Invalid GitHub URL");
          return;
        }
        //extract the owner and repo from the match
        const [, owner, repo] = match;
        const res = await fetch(`/api/github/${owner}/${repo}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json);
      } catch {
        setError("Failed to load GitHub data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [repoUrl]);

  if (loading) {
    //this is the loading state, it is used to display the loading state while fetching the data
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-[#111116] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-40 bg-white/[0.06] rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-white/[0.06]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 bg-white/[0.06] rounded" />
                  <div className="h-3 w-1/2 bg-white/[0.04] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return null;
  }
  //this is the commit timeline, it is used to display the commits of the repository
  return (
    <div className="space-y-6">
      {/* Repo Stats */}
      {/*display the repo stats*/}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Stars", value: data.stars.toLocaleString(), icon: "⭐" },
          { label: "Forks", value: data.forks.toLocaleString(), icon: "🍴" },
          {
            label: "Language",
            value: data.mainLanguage || "N/A",
            icon: "💻",
          },
          {
            label: "Updated",
            value: timeAgo(data.lastUpdate),
            icon: "🕐",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/[0.06] bg-[#111116] p-4 text-center"
          >
            <div className="text-lg mb-1">{stat.icon}</div>
            <div className="text-sm font-semibold text-white">{stat.value}</div>
            <div className="text-xs text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Language Breakdown */}
      {/*display the language breakdown*/}
      {data.languages.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-[#111116] p-5">
          <h4 className="text-sm font-medium text-zinc-300 mb-4">
            Language Breakdown
          </h4>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden flex mb-3">
            {data.languages.map((lang, i) => {
              const colors = [
                "bg-blue-500",
                "bg-green-500",
                "bg-yellow-500",
                "bg-purple-500",
                "bg-red-500",
                "bg-cyan-500",
                "bg-orange-500",
                "bg-pink-500",
              ];
              return (
                <div
                  key={lang.name}
                  className={`${colors[i % colors.length]} transition-all`}
                  style={{ width: `${lang.percentage}%` }}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3">
            {data.languages.map((lang, i) => {
              const colors = [
                "bg-blue-500",
                "bg-green-500",
                "bg-yellow-500",
                "bg-purple-500",
                "bg-red-500",
                "bg-cyan-500",
                "bg-orange-500",
                "bg-pink-500",
              ];
              return (
                <span
                  key={lang.name}
                  className="flex items-center gap-1.5 text-xs text-zinc-400"
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      colors[i % colors.length]
                    }`}
                  />
                  {lang.name}{" "}
                  <span className="text-zinc-600">{lang.percentage}%</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Commit Timeline */}
      {/*display the commits, if there are no commits, display a message saying no commits yet*/}
      {data.commits.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-[#111116] p-5">
          <h4 className="text-sm font-medium text-zinc-300 mb-5 flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-blue-400" />
            Recent Commits
          </h4>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-0 bottom-0 w-px bg-white/[0.06]" />

            <div className="space-y-0">
              {data.commits.map((commit, i) => (
                <div
                  key={commit.sha}
                  className="relative flex gap-4 pb-6 last:pb-0"
                >
                  {/* Dot */}
                  <div
                    className={`relative z-10 flex-shrink-0 h-[30px] w-[30px] rounded-full border-2 flex items-center justify-center ${
                      i === 0
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-white/[0.1] bg-[#0a0a0f]"
                    }`}
                  >
                    {commit.authorAvatar ? (
                      <img
                        src={commit.authorAvatar}
                        alt={commit.author}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-3 w-3 text-zinc-500" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-300 line-clamp-1">
                      {commit.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-zinc-600">
                        {commit.authorLogin || commit.author}
                      </span>
                      <span className="text-xs text-zinc-700">·</span>
                      <span className="text-xs text-zinc-600">
                        {timeAgo(commit.date)}
                      </span>
                      <span className="text-xs text-zinc-700">·</span>
                      <a
                        href={commit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-500/70 hover:text-blue-400 font-mono transition-colors"
                      >
                        {commit.sha}
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
