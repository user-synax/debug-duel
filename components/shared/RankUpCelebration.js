"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function RankUpCelebration({ newRank, onClose }) {
  useEffect(() => {
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
  }, []);

  const getRankColor = (rank) => {
    switch (rank) {
      case "Architect":
        return "text-purple-400";
      case "Principal":
        return "text-pink-400";
      case "Staff":
        return "text-blue-400";
      case "Senior":
        return "text-green-400";
      case "Mid":
        return "text-yellow-400";
      case "Junior":
        return "text-orange-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9998] p-4">
      <div className="bg-[#111111] border-2 border-[#00ff87] rounded-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-white mb-2">Rank Up!</h2>
        <p className="text-gray-400 mb-6">You've been promoted to</p>
        <div className={`text-4xl font-bold mb-6 ${getRankColor(newRank)}`}>
          {newRank}
        </div>
        <button
          onClick={onClose}
          className="px-8 py-3 bg-[#00ff87] text-black font-bold rounded-lg hover:bg-[#00cc6a] transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
