import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import MatchmakingQueue from "@/models/MatchmakingQueue";
import Match from "@/models/Match";
import Challenge from "@/models/Challenge";
import { getAblyServer } from "@/lib/ably";
import { rateLimit, getRateLimitKey } from "@/lib/rateLimit";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 5 requests per minute per user
    const rateLimitKey = getRateLimitKey(request, session.user.id);
    const { success } = rateLimit(rateLimitKey, 5, 60 * 1000);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    await connectDB();

    const userId = session.user.id;

    // Get user's rating
    const user = await User.findById(userId).select("rating").lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is already in queue
    const existingInQueue = await MatchmakingQueue.findOne({ userId });
    if (existingInQueue) {
      return NextResponse.json({ error: "Already in queue" }, { status: 400 });
    }

    // Add user to queue
    await MatchmakingQueue.create({
      userId,
      rating: user.rating,
    });

    // Check for opponents within ±200 rating range
    const minRating = user.rating - 200;
    const maxRating = user.rating + 200;

    const opponents = await MatchmakingQueue.find({
      userId: { $ne: userId },
      rating: { $gte: minRating, $lte: maxRating },
    })
      .sort({ joinedAt: 1 })
      .limit(1)
      .lean();

    if (opponents.length > 0) {
      const opponent = opponents[0];

      // Remove both from queue
      await MatchmakingQueue.deleteMany({
        userId: { $in: [userId, opponent.userId] },
      });

      // Get a random active challenge (medium difficulty)
      const challenge = await Challenge.findOne({
        isActive: true,
        difficulty: "medium",
      }).lean();

      if (!challenge) {
        return NextResponse.json(
          { error: "No available challenges" },
          { status: 500 }
        );
      }

      // Create match
      const match = await Match.create({
        player1: userId,
        player2: opponent.userId,
        challengeId: challenge._id,
        status: "pending",
      });

      // Get opponent user details
      const opponentUser = await User.findById(opponent.userId)
        .select("username avatar")
        .lean();

      // Get current user details
      const currentUser = await User.findById(userId)
        .select("username avatar")
        .lean();

      // Publish match details to both players via Ably
      const ably = getAblyServer();
      const matchData = {
        matchId: match._id.toString(),
        channelName: `match:${match._id.toString()}`,
        challenge: {
          id: challenge._id.toString(),
          title: challenge.title,
          category: challenge.category,
          difficulty: challenge.difficulty,
          description: challenge.description,
          starterCode: challenge.starterCode,
          validationTests: challenge.validationTests,
        },
        opponent: {
          id: opponent.userId.toString(),
          username: opponentUser.username,
          avatar: opponentUser.avatar,
          rank: opponentUser.rank,
        },
        you: {
          id: userId,
          username: currentUser.username,
          avatar: currentUser.avatar,
          rank: currentUser.rank,
        },
      };

      // Publish match-start to the match channel
      await ably.channels.get(`match:${match._id.toString()}`).publish("match-start", matchData);

      // Publish match-found to opponent
      await ably.channels.get(`user:${opponent.userId.toString()}`).publish("match-found", {
        matchId: match._id.toString(),
        channelName: `match:${match._id.toString()}`,
        opponent: {
          id: userId,
          username: currentUser.username,
          avatar: currentUser.avatar,
          rank: currentUser.rank,
        },
      });

      // Publish match-found to current user
      await ably.channels.get(`user:${userId}`).publish("match-found", {
        matchId: match._id.toString(),
        channelName: `match:${match._id.toString()}`,
        opponent: {
          id: opponent.userId.toString(),
          username: opponentUser.username,
          avatar: opponentUser.avatar,
          rank: opponentUser.rank,
        },
      });

      return NextResponse.json({
        matched: true,
        matchId: match._id.toString(),
        channelName: `match:${match._id.toString()}`,
      });
    }

    // No opponent found, return queue position
    const queuePosition = await MatchmakingQueue.countDocuments({
      joinedAt: { $lt: new Date() },
    });

    return NextResponse.json({
      matched: false,
      queuePosition,
    });
  } catch (error) {
    console.error("Error joining matchmaking:", error);
    return NextResponse.json(
      { error: "Failed to join matchmaking" },
      { status: 500 }
    );
  }
}
