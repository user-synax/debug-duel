import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import MatchmakingQueue from "@/models/MatchmakingQueue";
import { rateLimit, getRateLimitKey } from "@/lib/rateLimit";

export async function DELETE(request) {
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

    // Remove user from queue
    const result = await MatchmakingQueue.deleteOne({ userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Not in queue" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error canceling matchmaking:", error);
    return NextResponse.json(
      { error: "Failed to cancel matchmaking" },
      { status: 500 }
    );
  }
}
