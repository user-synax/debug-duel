"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Target, Trophy } from "lucide-react";

export default function DailyChallengeCard({ dailyChallenge, userPosition }) {
  const router = useRouter();

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

  if (!dailyChallenge) {
    return (
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Daily Challenge</h2>
        <p className="text-gray-400">Loading daily challenge...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6 mb-6 hover:border-[#00ff87]/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">
            {dailyChallenge.title}
          </h2>
          <div className="flex gap-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(
                dailyChallenge.category
              )}`}
            >
              {dailyChallenge.category.toUpperCase()}
            </span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(
                dailyChallenge.difficulty
              )}`}
            >
              {dailyChallenge.difficulty.toUpperCase()}
            </span>
          </div>
        </div>
        <Target className="w-8 h-8 text-[#00ff87]" />
      </div>

      <p className="text-gray-400 mb-4">
        {dailyChallenge.totalParticipants} developers solved this today
      </p>

      {userPosition !== -1 ? (
        <div className="p-4 bg-[#00ff87]/10 border border-[#00ff87]/30 rounded mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#00ff87]" />
            <div>
              <p className="text-[#00ff87] font-semibold">
                You solved this today!
              </p>
              <p className="text-gray-400 text-sm">
                Position: #{userPosition + 1}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => router.push("/daily")}
          className="w-full"
          size="lg"
        >
          Solve Today's Bug
        </Button>
      )}
    </div>
  );
}
