import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(request) {
  try {
    const session = await auth();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || session?.user?.email !== adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    await connectDB();

    let query = {};
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(query)
      .select("username email rank xp wins losses isAdmin isBanned createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
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
    const { id, isAdmin, isBanned } = body;

    await connectDB();

    const updateData = {};
    if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
    if (isBanned !== undefined) updateData.isBanned = isBanned;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select("username email rank xp wins losses isAdmin isBanned createdAt")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
