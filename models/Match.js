const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "active", "completed"],
    default: "pending",
  },
  player1Result: {
    code: String,
    passed: Boolean,
    timeTaken: Number,
    score: Number,
    testResults: [Object],
    submittedAt: Date,
  },
  player2Result: {
    code: String,
    passed: Boolean,
    timeTaken: Number,
    score: Number,
    testResults: [Object],
    submittedAt: Date,
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  startedAt: Date,
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models?.Match || mongoose.model("Match", matchSchema);
