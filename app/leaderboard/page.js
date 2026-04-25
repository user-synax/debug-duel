"use client";

import { useState, useEffect } from "react";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { Button } from "@/components/ui/button";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("global");
  const [category, setCategory] = useState("html");
  const [page, setPage] = useState(1);
  const [leaderboard, setLeaderboard] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentUserPosition, setCurrentUserPosition] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, category, page]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: activeTab,
        page,
        limit: 25,
      });

      if (activeTab === "category") {
        params.append("category", category);
      }

      const response = await fetch(`/api/leaderboard?${params}`);
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
      setTotal(data.total || 0);
      setCurrentUserPosition(data.currentUserPosition);
      setCurrentUserData(data.currentUserData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const getWeeklyResetCountdown = () => {
    const now = new Date();
    const daysUntilMonday = (7 - now.getDay()) % 7 || 7;
    return daysUntilMonday;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Leaderboard</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={activeTab === "global" ? "default" : "outline"}
          onClick={() => {
            setActiveTab("global");
            setPage(1);
          }}
        >
          Global
        </Button>
        <Button
          variant={activeTab === "weekly" ? "default" : "outline"}
          onClick={() => {
            setActiveTab("weekly");
            setPage(1);
          }}
        >
          This Week
        </Button>
        <Button
          variant={activeTab === "category" ? "default" : "outline"}
          onClick={() => {
            setActiveTab("category");
            setPage(1);
          }}
        >
          By Category
        </Button>
      </div>

      {/* Category Tabs */}
      {activeTab === "category" && (
        <div className="flex flex-wrap gap-2 mb-6">
          {["html", "css", "javascript", "react"].map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              size="sm"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>
      )}

      {/* Weekly Reset Countdown */}
      {activeTab === "weekly" && (
        <div className="mb-6 text-gray-400 text-sm">
          Resets in {getWeeklyResetCountdown()} days
        </div>
      )}

      {/* Leaderboard Table */}
      {loading ? (
        <div className="text-center text-gray-400 py-8">Loading...</div>
      ) : (
        <>
          <LeaderboardTable
            leaderboard={leaderboard}
            currentUserPosition={currentUserPosition}
            currentUserData={currentUserData}
            type={activeTab}
          />

          {/* Load More Button */}
          {leaderboard.length < total && (
            <div className="mt-6 text-center">
              <Button onClick={handleLoadMore} variant="outline">
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
