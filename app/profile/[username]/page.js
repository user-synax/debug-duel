import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ActivityHeatmap from "@/components/profile/ActivityHeatmap";
import CategoryBreakdown from "@/components/profile/CategoryBreakdown";
import { Flame, Trophy, Clock, Zap } from "lucide-react";

async function getProfileData(username) {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/profile/${username}`
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function ProfilePage({ params }) {
  const { username } = await params;
  const session = await auth();
  const isOwnProfile = session?.user?.username === username;
  const data = await getProfileData(username);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">User not found</div>
      </div>
    );
  }

  const { user, stats, progress, categoryBreakdown, heatmapData, recentSolves } = data;

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

  const getRankGlowColor = (rank) => {
    switch (rank) {
      case "Architect":
        return "shadow-purple-500/50";
      case "Principal":
        return "shadow-pink-500/50";
      case "Staff":
        return "shadow-blue-500/50";
      case "Senior":
        return "shadow-green-500/50";
      case "Mid":
        return "shadow-yellow-500/50";
      case "Junior":
        return "shadow-orange-500/50";
      default:
        return "shadow-gray-500/50";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-[#00ff87]/20 text-[#00ff87]";
      case "medium":
        return "bg-[#00d4ff]/20 text-[#00d4ff]";
      case "hard":
        return "bg-[#ff4444]/20 text-[#ff4444]";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "html":
        return "bg-orange-500/20 text-orange-400";
      case "css":
        return "bg-blue-500/20 text-blue-400";
      case "javascript":
        return "bg-yellow-500/20 text-yellow-400";
      case "react":
        return "bg-cyan-500/20 text-cyan-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const progressPercent = progress.nextRank
    ? ((progress.currentXP / (progress.currentXP + progress.xpNeeded)) * 100).toFixed(1)
    : 100;

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white border-4 ${getRankColor(user.rank)} ${getRankGlowColor(user.rank)} shadow-lg`}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-full h-full rounded-full"
                />
              ) : (
                user.username[0].toUpperCase()
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded border ${getRankColor(
                    user.rank
                  )}`}
                >
                  {user.rank}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-4">
                <span>Joined {joinDate}</span>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-[#ff6b35]" />
                  <span>{user.streak} day streak</span>
                </div>
                <span>{stats.totalSolves} total solves</span>
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

            {/* Edit Profile Button */}
            {isOwnProfile && (
              <button className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-lg transition-colors">
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-[#00ff87]" />
              <span className="text-gray-400 text-sm">Total Solves</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalSolves}</p>
          </div>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-[#00d4ff]" />
              <span className="text-gray-400 text-sm">Best Category</span>
            </div>
            <p className="text-3xl font-bold text-white capitalize">
              {stats.bestCategory}
            </p>
          </div>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-[#ffaa00]" />
              <span className="text-gray-400 text-sm">Avg Solve Time</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {formatTime(stats.avgSolveTime)}
            </p>
          </div>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-[#ff6b35]" />
              <span className="text-gray-400 text-sm">Fastest Solve</span>
            </div>
            <p className="text-lg font-bold text-white truncate">
              {stats.fastestSolve
                ? `${formatTime(stats.fastestSolve.timeTaken)}`
                : "N/A"}
            </p>
            {stats.fastestSolve && (
              <p className="text-xs text-gray-500 truncate">
                {stats.fastestSolve.challengeTitle}
              </p>
            )}
          </div>
        </div>

        {/* Activity Heatmap & Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ActivityHeatmap data={heatmapData} />
          <CategoryBreakdown data={categoryBreakdown} />
        </div>

        {/* Recent Solves */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Solves</h2>
          {recentSolves.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No solves yet</p>
          ) : (
            <div className="space-y-3">
              {recentSolves.map((solve) => (
                <div
                  key={solve._id}
                  className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded hover:bg-[#222] transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">
                      {solve.challengeTitle}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${getCategoryColor(
                          solve.category
                        )}`}
                      >
                        {solve.category.toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${getDifficultyColor(
                          solve.difficulty
                        )}`}
                      >
                        {solve.difficulty.toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {formatTime(solve.timeTaken)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#00ff87] font-mono">
                      {solve.score} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
