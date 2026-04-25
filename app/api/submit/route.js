import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Submission from "@/models/Submission";
import Challenge from "@/models/Challenge";
import User from "@/models/User";
import { rateLimit, getRateLimitKey } from "@/lib/rateLimit";
import mongoose from "mongoose";

function getRankFromXP(xp) {
  if (xp >= 20000) return "Architect";
  if (xp >= 12000) return "Principal";
  if (xp >= 7000) return "Staff";
  if (xp >= 3500) return "Senior";
  if (xp >= 1500) return "Mid";
  if (xp >= 500) return "Junior";
  return "Intern";
}

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 10 requests per minute per user
    const rateLimitKey = getRateLimitKey(request, session.user.id);
    const { success, remaining } = rateLimit(rateLimitKey, 10, 60 * 1000);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { challengeId, code, passed, timeTaken, score, testResults } = body;

    await connectDB();

    // Create submission - convert userId to ObjectId
    const submission = await Submission.create({
      userId: new mongoose.Types.ObjectId(session.user.id),
      challengeId: new mongoose.Types.ObjectId(challengeId),
      code,
      passed,
      timeTaken,
      score,
      testResults,
    });

    // Update user XP
    const user = await User.findById(session.user.id);
    const oldXp = user.xp || 0;
    const newXp = oldXp + score;
    const newRank = getRankFromXP(newXp);

    await User.findByIdAndUpdate(session.user.id, {
      xp: newXp,
      rank: newRank,
      lastActive: new Date(),
      ...(passed ? { $inc: { wins: 1 } } : { $inc: { losses: 1 } }),
    });

    // Update challenge stats
    const challenge = await Challenge.findById(challengeId);
    if (challenge) {
      const newPlayCount = (challenge.playCount || 0) + 1;
      const newAvgSolveTime =
        (challenge.avgSolveTime * challenge.playCount + timeTaken) /
        newPlayCount;
      const newPassRate =
        ((challenge.passRate * challenge.playCount) + (passed ? 1 : 0)) /
        newPlayCount;

      await Challenge.findByIdAndUpdate(challengeId, {
        playCount: newPlayCount,
        avgSolveTime: newAvgSolveTime,
        passRate: newPassRate,
      });
    }

    return NextResponse.json({
      success: true,
      xpEarned: score,
      newXp,
      newRank,
      oldRank: user.rank,
    });
  } catch (error) {
    console.error("Error submitting solution:", error);
    return NextResponse.json(
      { error: "Failed to submit solution" },
      { status: 500 }
    );
  }
}
