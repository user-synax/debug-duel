const mongoose = require("mongoose");

const matchmakingQueueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models?.MatchmakingQueue || mongoose.model("MatchmakingQueue", matchmakingQueueSchema);
