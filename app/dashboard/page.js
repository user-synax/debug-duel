import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import DailyChallengeCard from "@/components/dashboard/DailyChallengeCard";
import QuickPlay from "@/components/dashboard/QuickPlay";
import PracticeCard from "@/components/dashboard/PracticeCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import LeaderboardPreview from "@/components/dashboard/LeaderboardPreview";
import Stats from "@/components/dashboard/Stats";
import RankDistribution from "@/components/dashboard/RankDistribution";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Submission from "@/models/Submission";
import DailyChallenge from "@/models/DailyChallenge";
import Challenge from "@/models/Challenge";

async function getDashboardData(userId) {
  await connectDB();

  // Get user data
  const user = await User.findById(userId).lean();

  if (!user) {
    return {
      userStats: { user: {}, progress: {}, stats: { usersAbove: 0 }, recentSubmissions: [] },
      leaderboard: { leaderboard: [], rankDistribution: [] },
      daily: { challenge: null, leaderboard: [], totalParticipants: 0 },
      userPosition: -1,
    };
  }

  // Get recent submissions
  const recentSubmissions = await Submission.find({ userId })
    .populate("challengeId", "title category")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Calculate stats
  const totalSubmissions = await Submission.countDocuments({ userId });
  const passedSubmissions = await Submission.countDocuments({
    userId,
    passed: true,
  });

  const winRate = totalSubmissions > 0 ? passedSubmissions / totalSubmissions : 0;

  const passedSubmissionsData = await Submission.find({
    userId,
    passed: true,
  }).lean();

  const avgSolveTime =
    passedSubmissionsData.length > 0
      ? passedSubmissionsData.reduce((sum, sub) => sum + sub.timeTaken, 0) /
        passedSubmissionsData.length
      : 0;

  const categoryStats = {};
  passedSubmissionsData.forEach((sub) => {
    const category = sub.challengeId?.category || "unknown";
    categoryStats[category] = (categoryStats[category] || 0) + 1;
  });

  const bestCategory = Object.entries(categoryStats).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] || "N/A";

  const rankThresholds = {
    Intern: 0,
    Junior: 500,
    Mid: 1500,
    Senior: 3500,
    Staff: 7000,
    Principal: 12000,
    Architect: 20000,
  };

  const currentRank = user.rank || "Intern";
  const currentXP = user.xp || 0;
  const nextRank = Object.keys(rankThresholds).find(
    (rank) => rankThresholds[rank] > currentXP
  );
  const xpNeeded = nextRank ? rankThresholds[nextRank] - currentXP : 0;

  const usersAbove = await User.countDocuments({ xp: { $gt: currentXP } });

  // Get leaderboard
  const leaderboard = await User.find()
    .sort({ xp: -1 })
    .limit(10)
    .select("username xp rank avatar wins losses")
    .lean();

  const rankDistribution = await User.aggregate([
    {
      $group: {
        _id: "$rank",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Get daily challenge
  const today = new Date().toISOString().split("T")[0];
  let daily = await DailyChallenge.findOne({ date: today })
    .populate({
      path: "challengeId",
      select: "-solutionCode",
    })
    .populate({
      path: "leaderboard.userId",
      select: "username avatar rank",
    })
    .lean();

  if (!daily) {
    const randomChallenge = await Challenge.findOne({ isActive: true })
      .select("-solutionCode")
      .lean();
    daily = {
      challengeId: randomChallenge,
      date: today,
      leaderboard: [],
    };
  }

  const sortedLeaderboard = daily.leaderboard
    ? daily.leaderboard.sort((a, b) => a.timeTaken - b.timeTaken)
    : [];

  const userPosition = sortedLeaderboard.findIndex(
    (entry) => entry.userId?._id?.toString() === userId
  );

  return {
    userStats: {
      user: {
        username: user.username,
        rank: currentRank,
        xp: currentXP,
        streak: user.streak || 0,
        wins: user.wins || 0,
        losses: user.losses || 0,
      },
      stats: {
        totalSolves: passedSubmissions,
        totalSubmissions,
        winRate,
        avgSolveTime,
        bestCategory,
        usersAbove,
      },
      progress: {
        currentXP,
        nextRank,
        xpNeeded,
      },
      recentSubmissions: recentSubmissions.map((sub) => ({
        _id: sub._id.toString(),
        challengeTitle: sub.challengeId?.title || "Unknown",
        category: sub.challengeId?.category || "unknown",
        passed: sub.passed,
        score: sub.score,
        timeTaken: sub.timeTaken,
        createdAt: sub.createdAt,
      })),
    },
    leaderboard: {
      leaderboard: leaderboard.map((entry) => ({
        ...entry,
        _id: entry._id.toString(),
      })),
      rankDistribution,
    },
    daily: {
      challenge: daily.challengeId ? {
        ...daily.challengeId,
        _id: daily.challengeId._id.toString(),
        validationTests: daily.challengeId.validationTests?.map((test) => ({
          ...test,
          _id: test._id?.toString(),
        })) || [],
      } : null,
      leaderboard: sortedLeaderboard.map((entry) => ({
        ...entry,
        _id: entry._id?.toString(),
        userId: entry.userId ? {
          ...entry.userId,
          _id: entry.userId._id.toString(),
        } : null,
      })),
      totalParticipants: daily.leaderboard?.length || 0,
    },
    userPosition,
  };
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getDashboardData(session.user.id);

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <WelcomeHeader
              user={data.userStats.user}
              progress={data.userStats.progress}
            />
            <PracticeCard />
            <DailyChallengeCard
              dailyChallenge={data.daily.challenge}
              userPosition={data.userPosition}
            />
            <QuickPlay />
            <RecentActivity submissions={data.userStats.recentSubmissions} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <LeaderboardPreview leaderboard={data.leaderboard.leaderboard} />
            <Stats stats={data.userStats.stats} />
            <RankDistribution
              rankDistribution={data.leaderboard.rankDistribution}
              usersAbove={data.userStats.stats.usersAbove}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
