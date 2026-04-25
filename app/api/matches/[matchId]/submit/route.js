import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Match from "@/models/Match";
import User from "@/models/User";
import { getAblyServer } from "@/lib/ably";

export async function POST(request, { params }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { matchId } = await params;
    const body = await request.json();
    const { code, passed, timeTaken, score, testResults } = body;

    await connectDB();

    const userId = session.user.id;

    // Find the match
    const match = await Match.findById(matchId);
    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Verify user is part of the match
    if (match.player1.toString() !== userId && match.player2.toString() !== userId) {
      return NextResponse.json({ error: "Not part of this match" }, { status: 403 });
    }

    // Determine which player is submitting
    const isPlayer1 = match.player1.toString() === userId;
    const resultField = isPlayer1 ? "player1Result" : "player2Result";

    // Check if already submitted
    if (match[resultField]) {
      return NextResponse.json({ error: "Already submitted" }, { status: 400 });
    }

    // Update match with player's result
    match[resultField] = {
      code,
      passed,
      timeTaken,
      score,
      testResults,
      submittedAt: new Date(),
    };

    // Check if both players have submitted
    const bothSubmitted = match.player1Result && match.player2Result;

    if (bothSubmitted) {
      // Determine winner
      let winner;
      if (match.player1Result.passed && !match.player2Result.passed) {
        winner = match.player1;
      } else if (!match.player1Result.passed && match.player2Result.passed) {
        winner = match.player2;
      } else if (match.player1Result.passed && match.player2Result.passed) {
        // Both passed - faster time wins
        winner =
          match.player1Result.timeTaken < match.player2Result.timeTaken
            ? match.player1
            : match.player2;
      } else {
        // Both failed - no winner
        winner = null;
      }

      match.winner = winner;
      match.status = "completed";
      match.completedAt = new Date();

      await match.save();

      // Update user ratings (Elo system)
      const ratingChange = 25;
      const winnerGain = 20 + Math.floor(Math.random() * 10); // 20-30
      const loserLoss = 15 + Math.floor(Math.random() * 10); // 15-25

      if (winner) {
        await User.findByIdAndUpdate(winner, {
          $inc: { rating: winnerGain, wins: 1 },
        });

        const loserId =
          winner.toString() === match.player1.toString()
            ? match.player2
            : match.player1;

        await User.findByIdAndUpdate(loserId, {
          $inc: { rating: -loserLoss, losses: 1 },
        });
      } else {
        // Both failed - both lose rating
        await User.findByIdAndUpdate(match.player1, {
          $inc: { rating: -10, losses: 1 },
        });
        await User.findByIdAndUpdate(match.player2, {
          $inc: { rating: -10, losses: 1 },
        });
      }

      // Publish match result to both players via Ably
      const ably = getAblyServer();
      const resultData = {
        matchId: match._id.toString(),
        winner: winner?.toString() || null,
        player1Result: {
          passed: match.player1Result.passed,
          timeTaken: match.player1Result.timeTaken,
          score: match.player1Result.score,
        },
        player2Result: {
          passed: match.player2Result.passed,
          timeTaken: match.player2Result.timeTaken,
          score: match.player2Result.score,
        },
      };

      await ably.channels.get(`match:${matchId}`).publish("match-complete", resultData);

      return NextResponse.json({
        submitted: true,
        waiting: false,
        winner: winner?.toString() || null,
      });
    } else {
      await match.save();
      return NextResponse.json({
        submitted: true,
        waiting: true,
      });
    }
  } catch (error) {
    console.error("Error submitting match result:", error);
    return NextResponse.json(
      { error: "Failed to submit result" },
      { status: 500 }
    );
  }
}
