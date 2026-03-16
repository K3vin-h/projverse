"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  Code2,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User,
  LogIn,
  Plus,
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    //this is the navbar, it is used to display the navbar shown on top of every page
  return (

    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20 transition-shadow group-hover:shadow-blue-500/40">
              <Code2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              Proj<span className="text-blue-400">verse</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {/*this is the desktop nav, it is used to display the desktop nav, includes links to explore, community, and dashboard pages*/}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/explore"
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
            >
              Explore
            </Link>
            <Link
              href="/community"
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
            >
              Community
            </Link>
            {session && (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right side */}
          {/*this is the right side of the navbar, it is used to display the right side of the navbar, includes links to new project, profile, dashboard, and sign out if they are signed in*/}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard/new"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
                >
                  <Plus className="h-4 w-4" />
                  New Project
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.04] transition-colors">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm text-zinc-300">
                      {session.user?.name || "User"}
                    </span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/[0.06] bg-[#141419] p-1 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link
                      href={`/profile/${session.user?.id}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <hr className="my-1 border-white/[0.06]" />
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
              {/* this is the sign in and sign up buttons, if the user is not logged in, display the sign in and sign up buttons instead of the profile and dashboard buttons*/}
              
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-600/20"
                >
                  <LogIn className="h-4 w-4" />
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          {/*mobile version of the navbar, similar to desktop but with a hamburger menu that opens and closes when clicked*/}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/[0.06] pt-4 space-y-1">
            <Link
              href="/explore"
              className="block px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/community"
              className="block px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/new"
                  className="block px-4 py-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  + New Project
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/[0.04] rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
