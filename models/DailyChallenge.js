import mongoose from "mongoose";

const dailyChallengeSchema = new mongoose.Schema({
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: true,
  },
  date: {
    type: String,
    required: true,
    unique: true,
  },
  leaderboard: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    timeTaken: Number,
    solvedAt: Date,
  }],
});

// Indexes
dailyChallengeSchema.index({ date: 1 }, { unique: true });
dailyChallengeSchema.index({ challengeId: 1 });

export default mongoose.models.DailyChallenge || mongoose.model("DailyChallenge", dailyChallengeSchema);
