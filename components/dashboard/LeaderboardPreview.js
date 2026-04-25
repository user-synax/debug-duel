"use client";

import { useRouter } from "next/navigation";
import { Trophy, Medal } from "lucide-react";

export default function LeaderboardPreview({ leaderboard }) {
  const router = useRouter();

  const getRankColor = (rank) => {
    switch (rank) {
      case "Architect":
        return "bg-purple-500/20 text-purple-400";
      case "Principal":
        return "bg-pink-500/20 text-pink-400";
      case "Staff":
        return "bg-blue-500/20 text-blue-400";
      case "Senior":
        return "bg-green-500/20 text-green-400";
      case "Mid":
        return "bg-yellow-500/20 text-yellow-400";
      case "Junior":
        return "bg-orange-500/20 text-orange-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getMedalIcon = (position) => {
    if (position === 1) return <Trophy className="w-4 h-4 text-[#ffd700]" />;
    if (position === 2) return <Medal className="w-4 h-4 text-[#c0c0c0]" />;
    if (position === 3) return <Medal className="w-4 h-4 text-[#cd7f32]" />;
    return null;
  };

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Leaderboard</h2>
        <button
          onClick={() => router.push("/leaderboard")}
          className="text-[#00ff87] text-sm hover:underline"
        >
          View Full
        </button>
      </div>
      <div className="space-y-2">
        {leaderboard.slice(0, 5).map((user, index) => (
          <div
            key={user._id}
            className="flex items-center gap-3 p-2 rounded bg-[#1a1a1a]"
          >
            <div className="w-6 text-center font-bold text-white">
              {getMedalIcon(index + 1) || index + 1}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{user.username}</p>
              <span
                className={`text-xs px-1 rounded ${getRankColor(user.rank)}`}
              >
                {user.rank}
              </span>
            </div>
            <div className="text-[#00ff87] font-mono text-sm">{user.xp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
