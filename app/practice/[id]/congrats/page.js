"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Trophy, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

export default function CongratsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [xpEarned, setXpEarned] = useState(0);
  const [timeTaken, setTimetaken] = useState(0);
  const [challengeTitle, setChallengeTitle] = useState("");

  useEffect(() => {
    // Get data from URL params
    const xp = searchParams.get("xp");
    const time = searchParams.get("time");
    const title = searchParams.get("title");

    if (xp) setXpEarned(parseInt(xp));
    if (time) setTimetaken(parseInt(time));
    if (title) setChallengeTitle(title);

    // Trigger confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#00ff87", "#00d4ff", "#ffaa00", "#ff4444", "#a855f7"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#00ff87", "#00d4ff", "#ffaa00", "#ff4444", "#a855f7"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, [searchParams]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleNextChallenge = () => {
    router.push("/practice");
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="bg-[#111111] border-2 border-[#00ff87] rounded-2xl p-8 max-w-lg w-full text-center">
        {/* Trophy Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-[#00ff87]/10 rounded-full flex items-center justify-center">
          <Trophy className="w-12 h-12 text-[#00ff87]" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-2">Challenge Solved!</h1>
        <p className="text-gray-400 mb-6">{challengeTitle}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
            <div className="text-3xl font-bold text-[#00ff87] mb-1">+{xpEarned}</div>
            <div className="text-gray-400 text-sm">XP Earned</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
            <div className="text-3xl font-bold text-white mb-1">{formatTime(timeTaken)}</div>
            <div className="text-gray-400 text-sm">Time Taken</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Button
            onClick={handleNextChallenge}
            className="w-full bg-[#00ff87] text-black font-bold hover:bg-[#00cc6a] transition-colors"
            size="lg"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Move to Next One
          </Button>
          <Button
            onClick={handleGoToDashboard}
            variant="outline"
            className="w-full border-[#2a2a2a] text-white hover:bg-[#1a1a1a] transition-colors"
            size="lg"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
