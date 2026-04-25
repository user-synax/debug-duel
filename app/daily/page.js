"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import EditorPanel from "@/components/editor/EditorPanel";
import useChallengeSolver from "@/hooks/useChallengeSolver";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Trophy, Medal, CheckCircle, XCircle } from "lucide-react";

export default function DailyChallengePage() {
  const { data: session } = useSession();
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState(0);

  const {
    code,
    setCode,
    isRunning,
    results,
    hasSubmitted,
    elapsedTime,
    startChallenge,
    runTests,
    submitSolution,
    resetChallenge,
  } = useChallengeSolver();

  useEffect(() => {
    fetchDailyChallenge();
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  const updateTimer = () => {
    const now = new Date();
    const utcMidnight = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
    );
    const diff = utcMidnight - now;
    setTimeUntilReset(diff);
  };

  const fetchDailyChallenge = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/daily");
      const data = await response.json();
      setDailyData(data);
    } catch (error) {
      console.error("Error fetching daily challenge:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    if (!session) {
      signIn();
      return;
    }
    setStarted(true);
    setCode(dailyData.challenge.starterCode || "");
    startChallenge();
  };

  const handleRunTests = async () => {
    await runTests(dailyData.challenge);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/daily/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          passed: results.every((r) => r.passed),
          timeTaken: elapsedTime,
          score: 0,
          testResults: results,
        }),
      });

      const data = await response.json();
      setShowResults(true);
      await fetchDailyChallenge(); // Refresh leaderboard
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const handleShare = () => {
    const today = new Date().toISOString().split("T")[0];
    const url = `${window.location.origin}/daily?date=${today}`;
    navigator.clipboard.writeText(url);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatCountdown = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

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

  const userPosition = dailyData?.leaderboard?.findIndex(
    (entry) => entry.userId?._id === session?.user?.id
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Loading daily challenge...</div>
      </div>
    );
  }

  if (!dailyData?.challenge) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">No daily challenge available</div>
      </div>
    );
  }

  if (started) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Daily Challenge</h1>
          <div className="text-gray-400">
            Resets in: {formatCountdown(timeUntilReset)}
          </div>
        </div>
        <EditorPanel
          challenge={dailyData.challenge}
          code={code}
          onCodeChange={setCode}
          onRunTests={handleRunTests}
          onSubmit={handleSubmit}
          testResults={results}
          isRunning={isRunning}
          hasSubmitted={hasSubmitted}
          elapsedTime={elapsedTime}
        />
        {showResults && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                {results.every((r) => r.passed) ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-[#00ff87]" />
                    Passed!
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-[#ff4444]" />
                    Failed
                  </>
                )}
              </h2>
              <Button onClick={() => setShowResults(false)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Daily Challenge
            </h1>
            <p className="text-gray-400">
              Resets in: {formatCountdown(timeUntilReset)}
            </p>
          </div>
          <Button variant="outline" onClick={handleShare}>
            Share
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Challenge Info */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              {dailyData.challenge.title}
            </h2>
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 text-xs bg-[#00d4ff]/20 text-[#00d4ff] rounded">
                {dailyData.challenge.category.toUpperCase()}
              </span>
              <span className="px-2 py-1 text-xs bg-[#00ff87]/20 text-[#00ff87] rounded">
                {dailyData.challenge.difficulty.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-300 mb-6">{dailyData.challenge.description}</p>
            {userPosition !== -1 ? (
              <div className="p-4 bg-[#00ff87]/10 border border-[#00ff87]/30 rounded mb-4">
                <p className="text-[#00ff87] font-semibold">
                  You solved this in position #{userPosition + 1}!
                </p>
                <p className="text-gray-400 text-sm">
                  Time: {formatTime(dailyData.leaderboard[userPosition].timeTaken)}
                </p>
              </div>
            ) : (
              <Button
                onClick={handleStart}
                className="w-full"
                disabled={hasSubmitted}
              >
                {hasSubmitted ? "Already Submitted" : "Start Challenge"}
              </Button>
            )}
          </div>

          {/* Leaderboard */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Leaderboard</h2>
              <span className="text-gray-400 text-sm">
                {dailyData.totalParticipants} participants
              </span>
            </div>
            <div className="space-y-2">
              {dailyData.leaderboard.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No submissions yet. Be the first!
                </p>
              ) : (
                dailyData.leaderboard.map((entry, index) => {
                  const isCurrentUser =
                    entry.userId?._id === session?.user?.id;
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded ${
                        isCurrentUser
                          ? "bg-[#00ff87]/10 border border-[#00ff87]/30"
                          : "bg-[#1a1a1a]"
                      }`}
                    >
                      <div className="w-8 text-center font-bold text-white">
                        {getMedalIcon(index + 1) || index + 1}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-gray-400">
                        {entry.userId?.avatar ? (
                          <img
                            src={entry.userId.avatar}
                            alt="avatar"
                            className="w-full h-full rounded-full"
                          />
                        ) : (
                          entry.userId?.username?.[0]?.toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {entry.userId?.username}
                        </p>
                        <span
                          className={`text-xs px-1 rounded ${getRankColor(
                            entry.userId?.rank
                          )}`}
                        >
                          {entry.userId?.rank}
                        </span>
                      </div>
                      <div className="text-gray-400 font-mono">
                        {formatTime(entry.timeTaken)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
