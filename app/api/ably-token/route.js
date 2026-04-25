import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAblyServer } from "@/lib/ably";

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ably = getAblyServer();

    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: session.user.id,
      capability: {
        "user:*": ["subscribe", "publish"],
        "match:*": ["subscribe", "publish"],
      },
      ttl: 3600000, // 1 hour
    });

    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error("Error creating Ably token:", error);
    return NextResponse.json(
      { error: "Failed to create token" },
      { status: 500 }
    );
  }
}
