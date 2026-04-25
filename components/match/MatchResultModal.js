"use client";

import { useRouter } from "next/navigation";
import useMatchStore from "@/store/useMatchStore";
import { Trophy, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";

export default function MatchResultModal() {
  const router = useRouter();
  const { matchResult, myResults, opponent, reset } = useMatchStore();

  const handlePlayAgain = () => {
    reset();
    router.push("/play");
  };

  const handleBackToDashboard = () => {
    reset();
    router.push("/dashboard");
  };

  const isWinner = matchResult?.winner === myResults?.userId;
  const ratingChange = isWinner ? "+25" : "-20";
  const xpEarned = myResults?.passed * 10 || 0;

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!matchResult) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-8 max-w-2xl w-full">
        {/* Winner/Loser Announcement */}
        <div className="text-center mb-8">
          {isWinner ? (
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-12 h-12 text-[#00ff87]" />
              <h2 className="text-4xl font-bold text-[#00ff87]">Victory!</h2>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 mb-4">
              <XCircle className="w-12 h-12 text-[#ff4444]" />
              <h2 className="text-4xl font-bold text-[#ff4444]">Defeat</h2>
            </div>
          )}
          <p className="text-gray-400">
            {isWinner ? "You outperformed your opponent!" : "Better luck next time!"}
          </p>
        </div>

        {/* Side-by-side Comparison */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Your Results */}
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Your Results</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Time</span>
                <span className="text-white font-mono">
                  {formatTime(myResults?.timeTaken || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tests Passed</span>
                <span className="text-white">
                  {myResults?.testResults?.passed || 0}/
                  {myResults?.testResults?.total || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Score</span>
                <span className="text-[#00ff87] font-bold">{myResults?.score || 0} XP</span>
              </div>
            </div>
          </div>

          {/* Opponent Results */}
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Opponent Results</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Time</span>
                <span className="text-white font-mono">
                  {formatTime(
                    matchResult.player1Result?.timeTaken ||
                      matchResult.player2Result?.timeTaken ||
                      0
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tests Passed</span>
                <span className="text-white">
                  {matchResult.player1Result?.passed || 0}/
                  {matchResult.player1Result?.total || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Score</span>
                <span className="text-[#00ff87] font-bold">
                  {matchResult.player1Result?.score ||
                    matchResult.player2Result?.score ||
                    0}{" "}
                  XP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#1a1a1a] rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-[#ffaa00]" />
              <span className="text-gray-400 text-sm">Rating Change</span>
            </div>
            <p
              className={`text-2xl font-bold ${
                isWinner ? "text-[#00ff87]" : "text-[#ff4444]"
              }`}
            >
              {ratingChange}
            </p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-[#00ff87]" />
              <span className="text-gray-400 text-sm">XP Earned</span>
            </div>
            <p className="text-2xl font-bold text-[#00ff87]">+{xpEarned}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePlayAgain}
            className="flex-1 py-3 bg-[#00ff87] text-black font-bold rounded-lg hover:bg-[#00cc6a] transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            Play Again
          </button>
          <button
            onClick={handleBackToDashboard}
            className="flex-1 py-3 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#333] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
