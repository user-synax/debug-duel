import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Submission from "@/models/Submission";
import Challenge from "@/models/Challenge";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { username } = await params;

    const user = await User.findOne({ username })
      .select("-email -passwordHash -isAdmin")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all submissions for this user
    const submissions = await Submission.find({ userId: user._id })
      .populate("challengeId", "title category difficulty")
      .sort({ createdAt: -1 })
      .lean();

    console.log("Submissions found:", submissions.length);
    console.log("Sample submission:", submissions[0]);

    const passedSubmissions = submissions.filter((s) => s.passed);
    console.log("Passed submissions:", passedSubmissions.length);

    // Calculate stats
    const totalSolves = passedSubmissions.length;
    const avgSolveTime =
      passedSubmissions.length > 0
        ? passedSubmissions.reduce((sum, s) => sum + s.timeTaken, 0) /
          passedSubmissions.length
        : 0;

    // Find fastest solve
    const fastestSolve = passedSubmissions.length > 0
      ? passedSubmissions.reduce((min, s) =>
          s.timeTaken < min.timeTaken ? s : min
        )
      : null;

    // Category breakdown
    const categoryStats = {};
    passedSubmissions.forEach((s) => {
      const category = s.challengeId?.category || "unknown";
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    });

    console.log("Category stats:", categoryStats);

    const categoryBreakdown = Object.entries(categoryStats).map(
      ([category, count]) => ({
        category,
        count,
        percentage: ((count / totalSolves) * 100).toFixed(1),
      })
    );

    console.log("Category breakdown:", categoryBreakdown);

    const bestCategory = categoryBreakdown.sort((a, b) => b.count - a.count)[0]
      ?.category || "N/A";

    // Activity heatmap data (last 365 days)
    const yearAgo = new Date();
    yearAgo.setDate(yearAgo.getDate() - 365);

    const dailyActivity = {};
    const now = new Date();

    for (let i = 0; i < 365; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dailyActivity[dateStr] = 0;
    }

    passedSubmissions.forEach((s) => {
      const dateStr = s.createdAt.toISOString().split("T")[0];
      if (dailyActivity.hasOwnProperty(dateStr)) {
        dailyActivity[dateStr]++;
      }
    });

    const heatmapData = Object.entries(dailyActivity)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Recent solves (last 20 passed)
    const recentSolves = passedSubmissions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20)
      .map((s) => ({
        _id: s._id.toString(),
        challengeId: s.challengeId?._id?.toString(),
        challengeTitle: s.challengeId?.title || "Unknown",
        category: s.challengeId?.category || "unknown",
        difficulty: s.challengeId?.difficulty || "unknown",
        score: s.score,
        timeTaken: s.timeTaken,
        createdAt: s.createdAt,
      }));

    // XP thresholds for rank calculation
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

    return NextResponse.json({
      user: {
        username: user.username,
        avatar: user.avatar,
        rank: currentRank,
        xp: currentXP,
        streak: user.streak || 0,
        wins: user.wins || 0,
        losses: user.losses || 0,
        createdAt: user.createdAt,
      },
      stats: {
        totalSolves,
        bestCategory,
        avgSolveTime,
        fastestSolve: fastestSolve
          ? {
              challengeTitle: fastestSolve.challengeId?.title || "Unknown",
              timeTaken: fastestSolve.timeTaken,
            }
          : null,
      },
      progress: {
        currentXP,
        nextRank,
        xpNeeded,
      },
      categoryBreakdown,
      heatmapData,
      recentSolves,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
