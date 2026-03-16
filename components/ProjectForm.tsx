"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Upload, Link as LinkIcon, FileText, Loader2 } from "lucide-react";

//this is the project form props interface, it is used to define the structure of the project form props
interface ProjectFormProps {
  //this is the initial data, it is used to define the initial data of the project form
  initialData?: {
    id?: string;
    name: string;
    description: string;
    repoUrl: string;
    demoUrl: string;
    docUrl: string;
    tags: string[];
    languages: string[];
    screenshots: string[];
  };
  mode: "create" | "edit";
}
//provide the most popular languages and tags for the project form
const POPULAR_LANGUAGES = [
  "TypeScript", "JavaScript", "Python", "Rust", "Go", "Java",
  "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Dart", "SQL",
];

const POPULAR_TAGS = [
  "Open Source", "AI/ML", "Web App", "API", "CLI Tool", "Framework",
  "DevOps", "Mobile", "Database", "Security", "Blockchain", "Game",
];

//this is the project form component, it is used to display the project form
export default function ProjectForm({
  initialData,
  mode,
}: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    repoUrl: initialData?.repoUrl || "",
    demoUrl: initialData?.demoUrl || "",
    docUrl: initialData?.docUrl || "",
    tags: initialData?.tags || [],
    languages: initialData?.languages || [],
    screenshots: initialData?.screenshots || [],
  });
  const [tagInput, setTagInput] = useState("");
  const [langInput, setLangInput] = useState("");
//create funcitons to add and remove tags and languages
  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !form.tags.includes(trimmed)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addLanguage = (lang: string) => {
    const trimmed = lang.trim();
    if (trimmed && !form.languages.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        languages: [...prev.languages, trimmed],
      }));
    }
    setLangInput("");
  };

  const removeLanguage = (lang: string) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== lang),
    }));
  };
//handle the create and update of the project
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url =
        mode === "edit"
          ? `/api/projects/${initialData?.id}`
          : "/api/projects";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save project");

      const project = await res.json();
      router.push(`/projects/${project.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Project Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">
          Project Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
          placeholder="My Awesome Project"
          className="w-full px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300">
          Description <span className="text-red-400">*</span>
        </label>
        <p className="text-xs text-zinc-500">Supports Markdown formatting</p>
        <textarea
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          required
          rows={8}
          placeholder="Describe your project in detail. What problem does it solve? How does it work?"
          className="w-full px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none"
        />
      </div>

      {/* Languages */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-zinc-300">
          Technologies / Languages
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.languages.map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20"
            >
              {lang}
              <button
                type="button"
                onClick={() => removeLanguage(lang)}
                className="hover:text-blue-300"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={langInput}
            onChange={(e) => setLangInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLanguage(langInput);
              }
            }}
            placeholder="Add a language..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 text-sm"
          />
          <button
            type="button"
            onClick={() => addLanguage(langInput)}
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_LANGUAGES.filter((l) => !form.languages.includes(l)).map(
            (lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => addLanguage(lang)}
                className="px-2.5 py-1 text-xs rounded-md bg-white/[0.03] text-zinc-500 hover:text-white hover:bg-white/[0.06] border border-white/[0.04] transition-colors"
              >
                + {lang}
              </button>
            )
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-zinc-300">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {form.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 text-sm border border-violet-500/20"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-violet-300"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag(tagInput);
              }
            }}
            placeholder="Add a tag..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 text-sm"
          />
          <button
            type="button"
            onClick={() => addTag(tagInput)}
            className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_TAGS.filter((t) => !form.tags.includes(t)).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="px-2.5 py-1 text-xs rounded-md bg-white/[0.03] text-zinc-500 hover:text-white hover:bg-white/[0.06] border border-white/[0.04] transition-colors"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
            <LinkIcon className="h-3.5 w-3.5 text-zinc-500" />
            GitHub Repository URL
          </label>
          <input
            type="url"
            value={form.repoUrl}
            onChange={(e) =>
              setForm((p) => ({ ...p, repoUrl: e.target.value }))
            }
            placeholder="https://github.com/user/repo"
            className="w-full px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
            <LinkIcon className="h-3.5 w-3.5 text-zinc-500" />
            Live Demo URL
          </label>
          <input
            type="url"
            value={form.demoUrl}
            onChange={(e) =>
              setForm((p) => ({ ...p, demoUrl: e.target.value }))
            }
            placeholder="https://www.google.com/"
            className="w-full px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-zinc-500" />
          Documentation URL
        </label>
        <input
          type="url"
          value={form.docUrl}
          onChange={(e) =>
            setForm((p) => ({ ...p, docUrl: e.target.value }))
          }
          placeholder="https://www.google.com/"
          className="w-full px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
        />
      </div>

      {/* Screenshots */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <Upload className="h-3.5 w-3.5 text-zinc-500" />
          Screenshot URLs
        </label>
        <p className="text-xs text-zinc-500">
          Add direct image URLs for project screenshots
        </p>
        {form.screenshots.map((url, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => {
                const updated = [...form.screenshots];
                updated[i] = e.target.value;
                setForm((p) => ({ ...p, screenshots: updated }));
              }}
              placeholder="https://www.google.com/"
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 text-sm"
            />
            <button
              type="button"
              onClick={() => {
                setForm((p) => ({
                  ...p,
                  screenshots: p.screenshots.filter((_, idx) => idx !== i),
                }));
              }}
              className="px-3 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setForm((p) => ({ ...p, screenshots: [...p.screenshots, ""] }))
          }
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-dashed border-white/[0.08] text-zinc-500 hover:text-white hover:bg-white/[0.05] hover:border-white/[0.12] transition-all text-sm w-full justify-center"
        >
          <Plus className="h-4 w-4" />
          Add Screenshot URL
        </button>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "edit" ? "Save Changes" : "Submit Project"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 text-sm text-zinc-400 hover:text-white bg-white/[0.03] border border-white/[0.06] rounded-xl hover:bg-white/[0.06] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
