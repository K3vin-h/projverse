"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Github,
  Mail,
  Lock,
  User,
  AtSign,
  Loader2,
  Code2,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Auto sign in after registration
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex animate-fade-in">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-violet-600/20 via-[#0a0a0f] to-blue-600/20 items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Code2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Start showcasing
            <br />
            your projects today.
          </h2>
          <p className="text-zinc-400 max-w-sm">
            Join a growing community of developers sharing innovative builds.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Create account</h1>
            <p className="text-sm text-zinc-500 mt-2">
              Get started with your developer profile.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    required
                    placeholder="Alex Rivera"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Username</label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, username: e.target.value }))
                    }
                    required
                    placeholder="arivera_dev"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                  required
                  minLength={6}
                  placeholder="Min. 6 characters"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Account
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0a0a0f] px-3 text-zinc-600">
                or continue with
              </span>
            </div>
          </div>

          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-zinc-300 bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.08] transition-all"
          >
            <Github className="h-4 w-4" />
            GitHub
          </button>

          <p className="text-sm text-center text-zinc-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
