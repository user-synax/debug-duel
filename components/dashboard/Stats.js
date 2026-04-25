"use client";

export default function Stats({ stats }) {
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
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

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-4">Your Stats</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total Solves</span>
          <span className="text-white font-semibold">{stats.totalSolves}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Win Rate</span>
          <span className="text-white font-semibold">
            {(stats.winRate * 100).toFixed(1)}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Best Category</span>
          <span
            className={`px-2 py-1 text-xs rounded ${getCategoryColor(
              stats.bestCategory,
            )}`}
          >
            {stats.bestCategory.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Avg Solve Time</span>
          <span className="text-white font-semibold">
            {formatTime(stats.avgSolveTime)}
          </span>
        </div>
      </div>
    </div>
  );
}
