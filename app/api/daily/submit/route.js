import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import DailyChallenge from "@/models/DailyChallenge";
import User from "@/models/User";
import Submission from "@/models/Submission";

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

    const body = await request.json();
    const { code, passed, timeTaken, score, testResults } = body;

    await connectDB();

    const today = new Date().toISOString().split("T")[0];
    const dailyChallenge = await DailyChallenge.findOne({ date: today });

    if (!dailyChallenge) {
      return NextResponse.json(
        { error: "No daily challenge for today" },
        { status: 404 }
      );
    }

    // Check if user already submitted today
    const existingEntry = dailyChallenge.leaderboard.find(
      (entry) => entry.userId.toString() === session.user.id
    );

    if (existingEntry) {
      return NextResponse.json(
        { error: "Already submitted today" },
        { status: 400 }
      );
    }

    if (!passed) {
      return NextResponse.json(
        { error: "Challenge not passed" },
        { status: 400 }
      );
    }

    // Add to leaderboard
    dailyChallenge.leaderboard.push({
      userId: session.user.id,
      timeTaken,
      solvedAt: new Date(),
    });

    // Sort leaderboard by timeTaken
    dailyChallenge.leaderboard.sort((a, b) => a.timeTaken - b.timeTaken);

    // Find user's position
    const position = dailyChallenge.leaderboard.findIndex(
      (entry) => entry.userId.toString() === session.user.id
    ) + 1;

    // Calculate position bonus
    let positionBonus = 0;
    if (position === 1) positionBonus = 100;
    else if (position === 2) positionBonus = 50;
    else if (position === 3) positionBonus = 25;

    // Calculate total XP (base 200 + position bonus + score)
    const baseXp = 200;
    const totalXp = baseXp + positionBonus + score;

    // Update user XP and streak
    const user = await User.findById(session.user.id);
    const oldXp = user.xp || 0;
    const newXp = oldXp + totalXp;
    const newRank = getRankFromXP(newXp);

    // Check streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split("T")[0];

    const yesterdayDaily = await DailyChallenge.findOne({ date: yesterdayDate });
    let newStreak = 1;

    if (yesterdayDaily) {
      const solvedYesterday = yesterdayDaily.leaderboard.some(
        (entry) => entry.userId.toString() === session.user.id
      );
      if (solvedYesterday) {
        newStreak = (user.streak || 0) + 1;
      }
    }

    await User.findByIdAndUpdate(session.user.id, {
      xp: newXp,
      rank: newRank,
      streak: newStreak,
      lastActive: new Date(),
      $inc: { wins: 1 },
    });

    // Save daily challenge
    await dailyChallenge.save();

    // Create submission record
    await Submission.create({
      userId: session.user.id,
      challengeId: dailyChallenge.challengeId,
      code,
      passed,
      timeTaken,
      score: totalXp,
      testResults,
    });

    return NextResponse.json({
      success: true,
      position,
      xpEarned: totalXp,
      newXp,
      newRank,
      streak: newStreak,
    });
  } catch (error) {
    console.error("Error submitting daily challenge:", error);
    return NextResponse.json(
      { error: "Failed to submit daily challenge" },
      { status: 500 }
    );
  }
}
