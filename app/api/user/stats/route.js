import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Submission from "@/models/Submission";

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get recent submissions
    const recentSubmissions = await Submission.find({ userId: session.user.id })
      .populate("challengeId", "title category")
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate stats
    const totalSubmissions = await Submission.countDocuments({
      userId: session.user.id,
    });

    const passedSubmissions = await Submission.countDocuments({
      userId: session.user.id,
      passed: true,
    });

    const winRate = totalSubmissions > 0 ? passedSubmissions / totalSubmissions : 0;

    // Calculate average solve time for passed submissions
    const passedSubmissionsData = await Submission.find({
      userId: session.user.id,
      passed: true,
    });

    const avgSolveTime =
      passedSubmissionsData.length > 0
        ? passedSubmissionsData.reduce((sum, sub) => sum + sub.timeTaken, 0) /
          passedSubmissionsData.length
        : 0;

    // Find best category
    const categoryStats = {};
    passedSubmissionsData.forEach((sub) => {
      const category = sub.challengeId?.category || "unknown";
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    });

    const bestCategory = Object.entries(categoryStats).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "N/A";

    // XP thresholds for ranks
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

    // Count users above current XP
    const usersAbove = await User.countDocuments({ xp: { $gt: currentXP } });

    return NextResponse.json({
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
        _id: sub._id,
        challengeTitle: sub.challengeId?.title || "Unknown",
        category: sub.challengeId?.category || "unknown",
        passed: sub.passed,
        score: sub.score,
        timeTaken: sub.timeTaken,
        createdAt: sub.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}
