"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EditorPanel from "@/components/editor/EditorPanel";
import useChallengeSolver from "@/hooks/useChallengeSolver";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Trophy, RotateCcw } from "lucide-react";

export default function ChallengeSolver({ challenge, previousSubmission }) {
  const router = useRouter();
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

  const [showDescription, setShowDescription] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (challenge) {
      setCode(challenge.starterCode || "");
      startChallenge();
    }
  }, [challenge]);

  const handleRunTests = async () => {
    await runTests(challenge);
  };

  const handleSubmit = async () => {
    try {
      const result = await submitSolution(challenge);
      
      // If all tests passed, redirect to congrats page
      if (result && results.every((r) => r.passed)) {
        const xpEarned = result.xpEarned || 0;
        const timeTaken = elapsedTime;
        const title = challenge.title;
        
        router.push(
          `/practice/${challenge._id}/congrats?xp=${xpEarned}&time=${timeTaken}&title=${encodeURIComponent(title)}`
        );
      } else {
        setShowResults(true);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const handleTryAgain = () => {
    setShowResults(false);
    resetChallenge();
    setCode(challenge.starterCode || "");
    startChallenge();
  };

  const handleNextChallenge = () => {
    router.push("/practice");
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Loading challenge...</div>
      </div>
    );
  }

  // Show already completed banner if user has passed this challenge before
  if (previousSubmission) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-8">
        {/* Already Completed Banner */}
        <div className="mb-6 bg-[#00ff87]/10 border border-[#00ff87]/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00ff87]/20 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[#00ff87]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Already Completed!</h2>
                <p className="text-gray-400">
                  You earned <span className="text-[#00ff87] font-bold">+{previousSubmission.score} XP</span> on this challenge
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                setCode(challenge.starterCode || "");
                startChallenge();
              }}
              variant="outline"
              className="border-[#00ff87]/50 text-[#00ff87] hover:bg-[#00ff87]/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>

        {/* Editor Panel */}
        <EditorPanel
          challenge={challenge}
          code={code}
          onCodeChange={setCode}
          onRunTests={handleRunTests}
          onSubmit={handleSubmit}
          testResults={results}
          isRunning={isRunning}
          hasSubmitted={hasSubmitted}
          elapsedTime={elapsedTime}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      {/* Description Panel */}
      {showDescription && (
        <div className="mb-6 bg-[#111111] border border-[#2a2a2a] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">{challenge.title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDescription(false)}
            >
              Hide
            </Button>
          </div>
          <p className="text-gray-300 mb-4">{challenge.description}</p>
          {challenge.tags && challenge.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {challenge.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-[#2a2a2a] text-gray-400 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {!showDescription && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDescription(true)}
          className="mb-6"
        >
          Show Description
        </Button>
      )}

      {/* Editor Panel */}
      <EditorPanel
        challenge={challenge}
        code={code}
        onCodeChange={setCode}
        onRunTests={handleRunTests}
        onSubmit={handleSubmit}
        testResults={results}
        isRunning={isRunning}
        hasSubmitted={hasSubmitted}
        elapsedTime={elapsedTime}
      />

      {/* Results Modal */}
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

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Time:</span>
                <span>{formatTime(elapsedTime)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tests Passed:</span>
                <span>
                  {results.filter((r) => r.passed).length} / {results.length}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleTryAgain}
                className="flex-1"
              >
                Try Again
              </Button>
              <Button onClick={handleNextChallenge} className="flex-1">
                Next Challenge
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
