import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DailyChallenge from "@/models/DailyChallenge";
import Challenge from "@/models/Challenge";
import User from "@/models/User";

export async function GET(request) {
  try {
    await connectDB();

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    let dailyChallenge = await DailyChallenge.findOne({ date: today })
      .populate({
        path: "challengeId",
        select: "-solutionCode",
      })
      .populate({
        path: "leaderboard.userId",
        select: "username avatar rank",
      });

    // Fallback to random active challenge if no daily challenge set
    if (!dailyChallenge) {
      const randomChallenge = await Challenge.findOne({ isActive: true }).select(
        "-solutionCode"
      );

      if (!randomChallenge) {
        return NextResponse.json(
          { error: "No challenges available" },
          { status: 404 }
        );
      }

      dailyChallenge = {
        challengeId: randomChallenge,
        date: today,
        leaderboard: [],
      };
    }

    // Sort leaderboard by timeTaken and get top 10
    const sortedLeaderboard = dailyChallenge.leaderboard
      .sort((a, b) => a.timeTaken - b.timeTaken)
      .slice(0, 10);

    return NextResponse.json({
      challenge: dailyChallenge.challengeId,
      leaderboard: sortedLeaderboard,
      totalParticipants: dailyChallenge.leaderboard.length,
      date: dailyChallenge.date,
    });
  } catch (error) {
    console.error("Error fetching daily challenge:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily challenge" },
      { status: 500 }
    );
  }
}
