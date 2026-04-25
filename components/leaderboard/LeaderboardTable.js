"use client";

import { Flame, Trophy, Medal } from "lucide-react";

export default function LeaderboardTable({
  leaderboard,
  currentUserPosition,
  currentUserData,
  type,
}) {
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
    if (position === 1) return <Trophy className="w-5 h-5 text-[#ffd700]" />;
    if (position === 2) return <Medal className="w-5 h-5 text-[#c0c0c0]" />;
    if (position === 3) return <Medal className="w-5 h-5 text-[#cd7f32]" />;
    return null;
  };

  const getRowStyle = (position) => {
    if (position === 1) return "bg-[#ffd700]/10 border-[#ffd700]/30";
    if (position === 2) return "bg-[#c0c0c0]/10 border-[#c0c0c0]/30";
    if (position === 3) return "bg-[#cd7f32]/10 border-[#cd7f32]/30";
    return position % 2 === 0 ? "bg-[#0f0f0f]" : "bg-[#111111]";
  };

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0d0d0d] sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Pos
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                {type === "category" ? "Solves" : "XP"}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Streak
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {leaderboard.map((user) => (
              <tr
                key={user._id}
                className={`border border-[#2a2a2a] ${getRowStyle(user.position)}`}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    {getMedalIcon(user.position) || (
                      <span className="text-lg font-bold text-white">
                        {user.position}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-gray-400 mr-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt="avatar"
                          className="w-full h-full rounded-full"
                        />
                      ) : (
                        user.username?.[0]?.toUpperCase()
                      )}
                    </div>
                    <span className="text-white font-medium">{user.username}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded ${getRankColor(user.rank)}`}
                  >
                    {user.rank}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <span className="text-[#00ff87] font-mono">
                    {type === "category" ? user.solves : user.xp}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Flame className="w-4 h-4 text-[#ff6b35]" />
                    <span className="text-white">{user.streak || 0}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Current User Row */}
      {currentUserData && currentUserPosition && !leaderboard.find((u) => u._id === currentUserData._id) && (
        <div className="border-t-2 border-[#00ff87] bg-[#00ff87]/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 text-center font-bold text-[#00ff87]">
                #{currentUserPosition}
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-gray-400 mr-3">
                  {currentUserData.avatar ? (
                    <img
                      src={currentUserData.avatar}
                      alt="avatar"
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    currentUserData.username?.[0]?.toUpperCase()
                  )}
                </div>
                <span className="text-white font-medium">
                  {currentUserData.username} (You)
                </span>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded ${getRankColor(currentUserData.rank)}`}
              >
                {currentUserData.rank}
              </span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[#00ff87] font-mono">
                {type === "category" ? currentUserData.solves : currentUserData.xp}
              </span>
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-[#ff6b35]" />
                <span className="text-white">{currentUserData.streak || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
