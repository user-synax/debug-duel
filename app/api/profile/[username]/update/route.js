import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function PATCH(request, { params }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await params;
    const body = await request.json();
    const { newUsername, avatar } = body;

    await connectDB();

    // Verify the user is updating their own profile
    const currentUser = await User.findById(session.user.id);

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (currentUser.username !== username) {
      return NextResponse.json(
        { error: "You can only update your own profile" },
        { status: 403 }
      );
    }

    // Validate new username if provided
    if (newUsername && newUsername !== username) {
      // Check if username is already taken
      const existingUser = await User.findOne({ username: newUsername });
      if (existingUser) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }

      // Validate username format (alphanumeric, underscores, hyphens, 3-20 chars)
      const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
      if (!usernameRegex.test(newUsername)) {
        return NextResponse.json(
          { error: "Username must be 3-20 characters and can only contain letters, numbers, underscores, and hyphens" },
          { status: 400 }
        );
      }

      currentUser.username = newUsername;
    }

    // Update avatar if provided
    if (avatar !== undefined) {
      currentUser.avatar = avatar;
    }

    await currentUser.save();

    return NextResponse.json({
      user: {
        username: currentUser.username,
        avatar: currentUser.avatar,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
