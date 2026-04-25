"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAblyClient } from "@/lib/ably";
import useMatchStore from "@/store/useMatchStore";
import CodeEditor from "@/components/editor/CodeEditor";
import MatchResultModal from "@/components/match/MatchResultModal";
import { Clock, Trophy, Loader2 } from "lucide-react";

export default function MatchPage() {
  const router = useRouter();
  const params = useParams();
  const { matchId } = params;
  const [session, setSession] = useState(null);
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(0);
  const ablyRef = useRef(null);
  const channelRef = useRef(null);
  const timerRef = useRef(null);

  const {
    challenge,
    opponent,
    opponentProgress,
    matchStatus,
    matchResult,
    setChallenge,
    setOpponent,
    setOpponentProgress,
    setMatchStatus,
    setMatchResult,
    setMyResults,
    reset,
  } = useMatchStore();

  useEffect(() => {
    const loadSession = async () => {
      const s = await auth();
      setSession(s);
    };
    loadSession();
  }, []);

  useEffect(() => {
    if (challenge) {
      setCode(challenge.starterCode);
    }
  }, [challenge]);

  useEffect(() => {
    if (matchStatus === "active" && !submitted) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [matchStatus, submitted]);

  useEffect(() => {
    if (!session?.user?.id || !matchId) return;

    const subscribeToMatch = async () => {
      try {
        const ably = getAblyClient();
        ablyRef.current = ably;

        await ably.connection.once("connected");

        const channel = ably.channels.get(`match:${matchId}`);
        channelRef.current = channel;

        channel.subscribe("match-start", (message) => {
          setChallenge(message.data.challenge);
          setOpponent(message.data.opponent);
          setMatchStatus("active");
        });

        channel.subscribe("opponent.progress", (message) => {
          setOpponentProgress(message.data);
        });

        channel.subscribe("match-complete", (message) => {
          setMatchResult(message.data);
          setMatchStatus("completed");
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        });
      } catch (error) {
        console.error("Error subscribing to match channel:", error);
      }
    };

    subscribeToMatch();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
      if (ablyRef.current) {
        ablyRef.current.close();
      }
    };
  }, [session, matchId, setChallenge, setOpponent, setOpponentProgress, setMatchStatus, setMatchResult]);

  const runTests = async () => {
    if (!challenge) return;

    setIsRunning(true);
    setTestResults(null);

    try {
      const response = await fetch("/api/test-validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          validationTests: challenge.validationTests,
        }),
      });

      const data = await response.json();
      setTestResults(data);

      // Publish progress to opponent
      if (ablyRef.current) {
        const channel = ablyRef.current.channels.get(`match:${matchId}`);
        await channel.publish("opponent.progress", {
          userId: session.user.id,
          passed: data.passed,
          total: data.total,
        });
      }
    } catch (error) {
      console.error("Error running tests:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const submitSolution = async () => {
    if (!testResults || !challenge) return;

    setIsSubmitting(true);

    try {
      const score = testResults.passed * 10;
      const response = await fetch(`/api/matches/${matchId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          passed: testResults.allPassed,
          timeTaken: timer * 1000,
          score,
          testResults,
        }),
      });

      const data = await response.json();
      setSubmitted(true);
      setMyResults({
        code,
        passed: testResults.allPassed,
        timeTaken: timer * 1000,
        score,
        testResults,
      });
    } catch (error) {
      console.error("Error submitting solution:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

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

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00ff87] animate-spin" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Loading challenge...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top Bar */}
      <div className="bg-[#111111] border-b border-[#2a2a2a] px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border-2 border-[#00ff87] flex items-center justify-center">
                {session.user.avatar ? (
                  <img
                    src={session.user.avatar}
                    alt="avatar"
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <span className="text-lg font-bold text-white">
                    {session.user.username[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="text-white font-medium">{session.user.username}</p>
                <span
                  className={`px-2 py-0.5 text-xs rounded border ${getRankColor(
                    session.user.rank || "Intern"
                  )}`}
                >
                  {session.user.rank || "Intern"}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold text-[#00ff87]">VS</div>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-white font-medium">{opponent?.username || "Opponent"}</p>
                <span
                  className={`px-2 py-0.5 text-xs rounded border ${getRankColor(
                    opponent?.rank || "Intern"
                  )}`}
                >
                  {opponent?.rank || "Intern"}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border-2 border-[#ff4444] flex items-center justify-center">
                {opponent?.avatar ? (
                  <img
                    src={opponent.avatar}
                    alt="opponent"
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <span className="text-lg font-bold text-white">
                    {opponent?.username?.[0]?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-xl">{formatTime(timer * 1000)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Opponent Progress */}
      <div className="bg-[#111111] border-b border-[#2a2a2a] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Opponent:</span>
            <span className="text-white font-medium">
              {opponentProgress.passed}/{opponentProgress.total} tests passing
            </span>
          </div>
          <div className="w-48 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#ff4444] transition-all duration-300"
              style={{
                width: `${(opponentProgress.passed / opponentProgress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Challenge Info */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">{challenge.title}</h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-[#00ff87]/20 text-[#00ff87] rounded text-sm">
                {challenge.category.toUpperCase()}
              </span>
              <span className="px-3 py-1 bg-[#00d4ff]/20 text-[#00d4ff] rounded text-sm">
                {challenge.difficulty.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-400 mb-6">{challenge.description}</p>

            {/* Test Results */}
            {testResults && (
              <div
                className={`p-4 rounded-lg mb-6 ${
                  testResults.allPassed
                    ? "bg-[#00ff87]/20 border border-[#00ff87]/30"
                    : "bg-[#ff4444]/20 border border-[#ff4444]/30"
                }`}
              >
                <p className="font-medium mb-2">
                  {testResults.allPassed ? "All tests passed!" : "Tests failed"}
                </p>
                <p className="text-sm">
                  {testResults.passed}/{testResults.total} tests passed
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={runTests}
                disabled={isRunning}
                className="flex-1 py-3 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50"
              >
                {isRunning ? "Running..." : "Run Tests"}
              </button>
              <button
                onClick={submitSolution}
                disabled={!testResults || isSubmitting || submitted}
                className="flex-1 py-3 bg-[#00ff87] text-black font-bold rounded-lg hover:bg-[#00cc6a] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : submitted ? "Submitted" : "Submit"}
              </button>
            </div>

            {submitted && (
              <div className="mt-4 p-4 bg-[#1a1a1a] rounded-lg text-center">
                <p className="text-gray-400">Waiting for opponent...</p>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg overflow-hidden">
            <CodeEditor
              code={code}
              onChange={setCode}
              language="html"
              height="calc(100vh - 250px)"
            />
          </div>
        </div>
      </div>

      {/* Match Result Modal */}
      {matchResult && <MatchResultModal />}
    </div>
  );
}
