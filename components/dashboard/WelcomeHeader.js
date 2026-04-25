"use client";
import { Flame, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function WelcomeHeader({ user, progress }) {
  const router = useRouter();

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
  
  const progressPercent = progress.nextRank
    ? (
        (progress.currentXP / (progress.currentXP + progress.xpNeeded)) *
        100
      ).toFixed(1)
    : 100;

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
            Welcome back, {user.username}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded border ${getRankColor(
                user.rank,
              )}`}
            >
              {user.rank}
            </span>
            <span className="text-gray-400 text-xs sm:text-sm">{user.xp} XP</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff6b35]" />
            <span className="text-lg sm:text-xl font-bold text-[#ff6b35]">{user.streak}</span>
            <span className="text-gray-400 text-xs sm:text-sm">day streak</span>
          </div>
          <button
            onClick={() => router.push(`/profile/${user.username}`)}
            className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-lg transition-colors text-xs sm:text-sm"
          >
            <User className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Profile</span>
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-[#2a2a2a] hover:bg-red-500/20 hover:text-red-400 text-white rounded-lg transition-colors text-xs sm:text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Sign Out</span>
          </button>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">XP Progress</span>
          <span className="text-[#00ff87]">
            {progress.nextRank
              ? `${progress.xpNeeded} XP to ${progress.nextRank}`
              : "Max Rank"}
          </span>
        </div>
        <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00ff87] to-[#00d4ff] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
