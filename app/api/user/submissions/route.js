import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Submission from "@/models/Submission";

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const submissions = await Submission.find({ userId: session.user.id })
      .select("challengeId passed score timeTaken submittedAt")
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json({ 
      submissions: submissions.map((sub) => ({
        ...sub,
        _id: sub._id.toString(),
        challengeId: sub.challengeId.toString(),
      }))
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
