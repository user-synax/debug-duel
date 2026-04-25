import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Challenge from "@/models/Challenge";

export async function GET(request) {
  try {
    const session = await auth();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || session?.user?.email !== adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const challenges = await Challenge.find().lean();

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
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
    const {
      title,
      category,
      difficulty,
      description,
      starterCode,
      solutionCode,
      validationTests,
      hints,
      tags,
      isActive,
    } = body;

    await connectDB();

    const challenge = await Challenge.create({
      title,
      category,
      difficulty,
      description,
      starterCode,
      solutionCode,
      validationTests,
      hints,
      tags,
      isActive: isActive ?? true,
    });

    return NextResponse.json({ challenge }, { status: 201 });
  } catch (error) {
    console.error("Error creating challenge:", error);
    return NextResponse.json(
      { error: "Failed to create challenge" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await auth();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || session?.user?.email !== adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    await connectDB();

    const challenge = await Challenge.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).lean();

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json({ challenge });
  } catch (error) {
    console.error("Error updating challenge:", error);
    return NextResponse.json(
      { error: "Failed to update challenge" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || session?.user?.email !== adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await connectDB();

    const challenge = await Challenge.findByIdAndDelete(id);

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting challenge:", error);
    return NextResponse.json(
      { error: "Failed to delete challenge" },
      { status: 500 }
    );
  }
}
