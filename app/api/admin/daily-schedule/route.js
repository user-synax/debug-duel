import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import DailyChallenge from "@/models/DailyChallenge";
import Challenge from "@/models/Challenge";

export async function GET(request) {
  try {
    const session = await auth();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || session?.user?.email !== adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");

    await connectDB();

    let query = {};
    if (startDate) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      query = {
        date: {
          $gte: start.toISOString().split("T")[0],
          $lt: end.toISOString().split("T")[0],
        },
      };
    }

    const schedule = await DailyChallenge.find(query)
      .populate("challengeId", "title category difficulty")
      .sort({ date: 1 })
      .lean();

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error("Error fetching daily schedule:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily schedule" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || session?.user?.email !== adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { date, challengeId } = body;

    await connectDB();

    // Check if a daily challenge already exists for this date
    const existing = await DailyChallenge.findOne({ date });
    if (existing) {
      // Update existing
      existing.challengeId = challengeId;
      await existing.save();
      return NextResponse.json({ schedule: existing });
    }

    // Create new
    const schedule = await DailyChallenge.create({
      date,
      challengeId,
    });

    return NextResponse.json({ schedule }, { status: 201 });
  } catch (error) {
    console.error("Error updating daily schedule:", error);
    return NextResponse.json(
      { error: "Failed to update daily schedule" },
      { status: 500 }
    );
  }
}
