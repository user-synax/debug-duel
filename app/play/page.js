"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAblyClient } from "@/lib/ably";
import useMatchStore from "@/store/useMatchStore";
import { X, Loader2 } from "lucide-react";

export default function PlayPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [isQueueing, setIsQueueing] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const ablyRef = useRef(null);
  const channelRef = useRef(null);
  const setMatchState = useMatchStore();

  useEffect(() => {
    const loadSession = async () => {
      const s = await auth();
      setSession(s);
    };
    loadSession();
  }, []);

  const joinQueue = async () => {
    try {
      const response = await fetch("/api/matchmaking/join", {
        method: "POST",
      });
      const data = await response.json();

      if (data.matched) {
        // Already matched
        setMatchState.setMatchId(data.matchId);
        router.push(`/match/${data.matchId}`);
      } else {
        setIsQueueing(true);
        setQueuePosition(data.queuePosition);
        subscribeToMatch();
      }
    } catch (error) {
      console.error("Error joining queue:", error);
    }
  };

  const cancelQueue = async () => {
    try {
      await fetch("/api/matchmaking/cancel", { method: "DELETE" });
      setIsQueueing(false);
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    } catch (error) {
      console.error("Error canceling queue:", error);
    }
  };

  const subscribeToMatch = async () => {
    if (!session?.user?.id) return;

    try {
      const ably = getAblyClient();
      ablyRef.current = ably;

      await ably.connection.once("connected");

      const channel = ably.channels.get(`user:${session.user.id}`);
      channelRef.current = channel;

      channel.subscribe("match-found", (message) => {
        const { matchId, channelName, challenge, opponent: opp, you } = message.data;
        
        setOpponent(opp);
        setMatchState.setMatchId(matchId);
        setMatchState.setChallenge(challenge);
        setMatchState.setOpponent(opp);
        setMatchState.setMatchStatus("matched");

        // Start countdown
        let count = 3;
        setCountdown(count);
        
        const countdownInterval = setInterval(() => {
          count--;
          if (count > 0) {
            setCountdown(count);
          } else {
            clearInterval(countdownInterval);
            setCountdown(null);
            router.push(`/match/${matchId}`);
          }
        }, 1000);
      });
    } catch (error) {
      console.error("Error subscribing to Ably:", error);
    }
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

  if (countdown !== null) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-[#111111] border-4 border-[#00ff87] flex items-center justify-center">
              {opponent?.avatar ? (
                <img
                  src={opponent.avatar}
                  alt="opponent"
                  className="w-full h-full rounded-full"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {opponent?.username?.[0]?.toUpperCase() || "?"}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {opponent?.username || "Opponent"}
            </h2>
            <span
              className={`px-3 py-1 text-sm font-medium rounded border ${getRankColor(
                opponent?.rank || "Intern"
              )}`}
            >
              {opponent?.rank || "Intern"}
            </span>
          </div>
          <div className="text-9xl font-bold text-[#00ff87] animate-pulse">
            {countdown}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        {!isQueueing ? (
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">1v1 Debug Duel</h1>
            <p className="text-gray-400 mb-8">
              Challenge another developer to a real-time coding battle!
            </p>
            <button
              onClick={joinQueue}
              className="w-full py-4 bg-[#00ff87] text-black font-bold rounded-lg hover:bg-[#00cc6a] transition-colors text-lg"
            >
              Enter Queue
            </button>
          </div>
        ) : (
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-lg p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#1a1a1a] border-4 border-[#00ff87] flex items-center justify-center animate-pulse">
              {session.user.avatar ? (
                <img
                  src={session.user.avatar}
                  alt="avatar"
                  className="w-full h-full rounded-full"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {session.user.username[0].toUpperCase()}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Finding opponent...
            </h2>
            <p className="text-gray-400 mb-4">
              Queue position: #{queuePosition}
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Loader2 className="w-5 h-5 text-[#00ff87] animate-spin" />
              <span className="text-gray-500 text-sm">Searching for players near your rating</span>
            </div>
            <button
              onClick={cancelQueue}
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#333] transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
