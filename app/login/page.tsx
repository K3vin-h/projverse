"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github, Mail, Lock, Loader2, Code2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex animate-fade-in">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600/20 via-[#0a0a0f] to-violet-600/20 items-center justify-center p-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Code2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the next generation
            <br />
            of builders.
          </h2>
          <p className="text-zinc-400 max-w-sm">
            Secure, scalable, and community-driven infrastructure for your
            modern applications.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-zinc-500 mt-2">
              Enter your details to access your developer console.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-zinc-400">Password</label>
                <Link
                  href="#"
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
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
              Sign In
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
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
