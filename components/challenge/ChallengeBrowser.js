"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, Palette, Zap, Atom, FileText, CheckCircle2, Flame } from "lucide-react";

export default function ChallengeBrowser() {
  const router = useRouter();
  const { data: session } = useSession();
  const [challenges, setChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState(new Set());
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchChallenges();
    if (session?.user?.id) {
      fetchCompletedChallenges();
      fetchUserStreak();
    }
  }, [category, difficulty, search, session]);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.append("category", category);
      if (difficulty !== "all") params.append("difficulty", difficulty);
      if (search) params.append("search", search);

      const response = await fetch(`/api/challenges?${params}`);
      const data = await response.json();
      setChallenges(data.challenges || []);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedChallenges = async () => {
    try {
      const response = await fetch("/api/user/submissions");
      const data = await response.json();
      const completedIds = new Set(
        data.submissions
          ?.filter((sub) => sub.passed)
          .map((sub) => sub.challengeId.toString()) || []
      );
      setCompletedChallenges(completedIds);
    } catch (error) {
      console.error("Error fetching completed challenges:", error);
    }
  };

  const fetchUserStreak = async () => {
    try {
      const response = await fetch("/api/user/stats");
      const data = await response.json();
      setStreak(data.streak || 0);
    } catch (error) {
      console.error("Error fetching user streak:", error);
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "html":
        return <Globe className="w-6 h-6 text-orange-400" />;
      case "css":
        return <Palette className="w-6 h-6 text-blue-400" />;
      case "javascript":
        return <Zap className="w-6 h-6 text-yellow-400" />;
      case "react":
        return <Atom className="w-6 h-6 text-cyan-400" />;
      default:
        return <FileText className="w-6 h-6 text-gray-400" />;
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
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

  const getCategoryColor = (cat) => {
    switch (cat) {
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
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Practice Mode</h1>
        {session?.user && (
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#ff6b35]" />
            <span className="text-2xl font-bold text-[#ff6b35]">{streak}</span>
            <span className="text-gray-400">day streak</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {["all", "html", "css", "javascript", "react"].map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              onClick={() => setCategory(cat)}
              className="text-sm"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-2">
          {["all", "easy", "medium", "hard"].map((diff) => (
            <Button
              key={diff}
              variant={difficulty === diff ? "default" : "outline"}
              onClick={() => setDifficulty(diff)}
              className="text-sm"
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </Button>
          ))}
        </div>

        {/* Search */}
        <Input
          placeholder="Search challenges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Challenge Grid */}
      {loading ? (
        <div className="text-center text-gray-400">Loading challenges...</div>
      ) : challenges.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-32 h-32 mb-6 bg-[#111111] border border-[#2a2a2a] rounded-full flex items-center justify-center">
            <FileText className="w-16 h-16 text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No challenges found</h3>
          <p className="text-gray-400 mb-6 text-center max-w-md">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>
          <Button
            onClick={() => {
              setCategory("all");
              setDifficulty("all");
              setSearch("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => {
            const isCompleted = completedChallenges.has(challenge._id);
            return (
              <div
                key={challenge._id}
                className={`bg-[#111111] border rounded-lg p-6 transition-all cursor-pointer group ${
                  isCompleted
                    ? "border-[#00ff87]/50 opacity-75"
                    : "border-[#2a2a2a] hover:border-[#00ff87] hover:shadow-[0_0_20px_rgba(0,255,135,0.1)]"
                }`}
                onClick={() => router.push(`/practice/${challenge._id}`)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  {getCategoryIcon(challenge.category)}
                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-[#00ff87]/20 text-[#00ff87]">
                        <CheckCircle2 className="w-3 h-3" />
                        Solved
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(
                        challenge.difficulty
                      )}`}
                    >
                      {challenge.difficulty.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className={`text-lg font-semibold mb-2 group-hover:text-[#00ff87] transition-colors ${
                  isCompleted ? "text-gray-400" : "text-white"
                }`}>
                  {challenge.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {challenge.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span>Pass Rate: {Math.round(challenge.passRate * 100)}%</span>
                  <span>
                    Avg: {Math.round(challenge.avgSolveTime / 1000)}s
                  </span>
                  <span>{challenge.playCount} plays</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(
                      challenge.category
                    )}`}
                  >
                    {challenge.category.toUpperCase()}
                  </span>
                  <Button 
                    size="sm" 
                    className={`${
                      isCompleted 
                        ? "bg-[#2a2a2a] text-gray-400 hover:bg-[#333]" 
                        : "group-hover:bg-[#00ff87]"
                    }`}
                  >
                    {isCompleted ? "Retry" : "Solve"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
