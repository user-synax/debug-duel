"use client";

import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

export default function RecentActivity({ submissions }) {
  const router = useRouter();

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
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
      {submissions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No submissions yet</p>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub._id}
              className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded hover:bg-[#222] transition-colors cursor-pointer"
              onClick={() => router.push(`/practice/${sub.challengeId}`)}
            >
              <div className="flex-1">
                <p className="text-white font-medium mb-1">{sub.challengeTitle}</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-xs rounded ${getCategoryColor(
                      sub.category
                    )}`}
                  >
                    {sub.category.toUpperCase()}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {formatTime(sub.timeTaken)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#00ff87] font-mono">{sub.score} XP</span>
                {sub.passed ? (
                  <Check className="w-5 h-5 text-[#00ff87]" />
                ) : (
                  <X className="w-5 h-5 text-[#ff4444]" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
