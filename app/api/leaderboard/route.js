import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Submission from "@/models/Submission";
import Challenge from "@/models/Challenge";

export async function GET(request) {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;

    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "global";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 25;
    const category = searchParams.get("category");
    const skip = (page - 1) * limit;

    let leaderboard = [];
    let total = 0;

    if (type === "global") {
      // Global leaderboard - sort by XP
      leaderboard = await User.find()
        .sort({ xp: -1 })
        .skip(skip)
        .limit(limit)
        .select("username xp rank avatar wins losses streak")
        .lean();

      total = await User.countDocuments();
    } else if (type === "weekly") {
      // Weekly leaderboard - aggregate XP from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const weeklyStats = await Submission.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
            passed: true,
          },
        },
        {
          $group: {
            _id: "$userId",
            totalXP: { $sum: "$score" },
            solves: { $sum: 1 },
          },
        },
        {
          $sort: { totalXP: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);

      const userIds = weeklyStats.map((stat) => stat._id);
      const users = await User.find({ _id: { $in: userIds } })
        .select("username rank avatar wins losses streak")
        .lean();

      leaderboard = weeklyStats.map((stat) => {
        const user = users.find((u) => u._id.toString() === stat._id.toString());
        return {
          ...user,
          xp: stat.totalXP,
          solves: stat.solves,
        };
      });

      total = await Submission.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
            passed: true,
          },
        },
        {
          $group: {
            _id: "$userId",
          },
        },
      ]).then((results) => results.length);
    } else if (type === "category" && category) {
      // Category leaderboard - count solves by category
      const categoryStats = await Submission.aggregate([
        {
          $match: {
            passed: true,
          },
        },
        {
          $lookup: {
            from: "challenges",
            localField: "challengeId",
            foreignField: "_id",
            as: "challenge",
          },
        },
        {
          $unwind: "$challenge",
        },
        {
          $match: {
            "challenge.category": category,
          },
        },
        {
          $group: {
            _id: "$userId",
            solves: { $sum: 1 },
            totalXP: { $sum: "$score" },
          },
        },
        {
          $sort: { solves: -1, totalXP: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);

      const userIds = categoryStats.map((stat) => stat._id);
      const users = await User.find({ _id: { $in: userIds } })
        .select("username rank avatar wins losses streak xp")
        .lean();

      leaderboard = categoryStats.map((stat) => {
        const user = users.find((u) => u._id.toString() === stat._id.toString());
        return {
          ...user,
          solves: stat.solves,
          xp: stat.totalXP,
        };
      });

      total = await Submission.aggregate([
        {
          $match: {
            passed: true,
          },
        },
        {
          $lookup: {
            from: "challenges",
            localField: "challengeId",
            foreignField: "_id",
            as: "challenge",
          },
        },
        {
          $unwind: "$challenge",
        },
        {
          $match: {
            "challenge.category": category,
          },
        },
        {
          $group: {
            _id: "$userId",
          },
        },
      ]).then((results) => results.length);
    }

    // Calculate positions
    leaderboard = leaderboard.map((user, index) => ({
      ...user,
      position: skip + index + 1,
    }));

    // Get current user's position
    let currentUserPosition = null;
    let currentUserData = null;

    if (currentUserId) {
      if (type === "global") {
        const position = await User.countDocuments({ xp: { $gt: leaderboard[leaderboard.length - 1]?.xp || 0 } });
        currentUserPosition = position + 1;
        currentUserData = await User.findById(currentUserId)
          .select("username xp rank avatar wins losses streak")
          .lean();
      } else if (type === "weekly") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const userWeeklyStats = await Submission.aggregate([
          {
            $match: {
              userId: currentUserId,
              createdAt: { $gte: sevenDaysAgo },
              passed: true,
            },
          },
          {
            $group: {
              _id: "$userId",
              totalXP: { $sum: "$score" },
              solves: { $sum: 1 },
            },
          },
        ]);

        if (userWeeklyStats.length > 0) {
          const userXP = userWeeklyStats[0].totalXP;
          const position = await Submission.aggregate([
            {
              $match: {
                createdAt: { $gte: sevenDaysAgo },
                passed: true,
              },
            },
            {
              $group: {
                _id: "$userId",
                totalXP: { $sum: "$score" },
              },
            },
            {
              $match: {
                totalXP: { $gt: userXP },
              },
            },
            {
              $count: "count",
            },
          ]).then((results) => results[0]?.count || 0);

          currentUserPosition = position + 1;
          currentUserData = await User.findById(currentUserId)
            .select("username rank avatar wins losses streak")
            .lean();
          currentUserData.xp = userWeeklyStats[0].totalXP;
          currentUserData.solves = userWeeklyStats[0].solves;
        }
      } else if (type === "category" && category) {
        const userCategoryStats = await Submission.aggregate([
          {
            $match: {
              userId: currentUserId,
              passed: true,
            },
          },
          {
            $lookup: {
              from: "challenges",
              localField: "challengeId",
              foreignField: "_id",
              as: "challenge",
            },
          },
          {
            $unwind: "$challenge",
          },
          {
            $match: {
              "challenge.category": category,
            },
          },
          {
            $group: {
              _id: "$userId",
              solves: { $sum: 1 },
              totalXP: { $sum: "$score" },
            },
          },
        ]);

        if (userCategoryStats.length > 0) {
          const userSolves = userCategoryStats[0].solves;
          const position = await Submission.aggregate([
            {
              $match: {
                passed: true,
              },
            },
            {
              $lookup: {
                from: "challenges",
                localField: "challengeId",
                foreignField: "_id",
                as: "challenge",
              },
            },
            {
              $unwind: "$challenge",
            },
            {
              $match: {
                "challenge.category": category,
              },
            },
            {
              $group: {
                _id: "$userId",
                solves: { $sum: 1 },
              },
            },
            {
              $match: {
                solves: { $gt: userSolves },
              },
          },
          {
            $count: "count",
          },
        ]).then((results) => results[0]?.count || 0);

          currentUserPosition = position + 1;
          currentUserData = await User.findById(currentUserId)
            .select("username rank avatar wins losses streak xp")
            .lean();
          currentUserData.solves = userCategoryStats[0].solves;
          currentUserData.xp = userCategoryStats[0].totalXP;
        }
      }
    }

    return NextResponse.json({
      leaderboard,
      total,
      page,
      limit,
      currentUserPosition,
      currentUserData,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
