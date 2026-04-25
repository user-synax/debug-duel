"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown, Settings, LogOut, User } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/practice", label: "Practice" },
    { href: "/daily", label: "Daily" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  const getRankColor = (rank) => {
    switch (rank) {
      case "Architect":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Principal":
        return "bg-pink-500/20 text-pink-400 border-pink-500/30";
      case "Staff":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Senior":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Mid":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Junior":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  // Don't show navbar on auth pages
  if (pathname?.startsWith("/login") || pathname?.startsWith("/register")) {
    return null;
  }

  if (!session) {
    return null;
  }

  return (
    <nav className="bg-[#111111] border-b border-[#2a2a2a] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">Debug</span>
            <span className="text-2xl font-bold text-[#00ff87]">Duel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors relative ${
                  pathname === link.href
                    ? "text-[#00ff87]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-[#00ff87]" />
                )}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 hover:bg-[#1a1a1a] rounded-lg px-3 py-2 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                  {session.user.avatar ? (
                    <img
                      src={session.user.avatar}
                      alt="avatar"
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {session.user.username[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-white font-medium text-sm">
                  {session.user.username}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs rounded border ${getRankColor(
                    session.user.rank || "Intern"
                  )}`}
                >
                  {session.user.rank || "Intern"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-lg py-2">
                  <Link
                    href={`/profile/${session.user.username}`}
                    className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <hr className="border-[#2a2a2a] my-2" />
                  <button
                    onClick={() => {
                      signOut();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-[#2a2a2a] transition-colors w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#111111] border-t border-[#2a2a2a]">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-[#00ff87]/10 text-[#00ff87]"
                    : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-[#2a2a2a] my-4" />
            <Link
              href={`/profile/${session.user.username}`}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-[#1a1a1a] rounded-lg transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
