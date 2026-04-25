import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Challenge from "@/models/Challenge";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const challenge = await Challenge.findById(params.id).select(
      "-solutionCode"
    );

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json({ challenge });
  } catch (error) {
    console.error("Error fetching challenge:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenge" },
      { status: 500 }
    );
  }
}
