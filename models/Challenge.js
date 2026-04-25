const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["html", "css", "javascript", "react"],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  starterCode: {
    type: String,
    required: true,
  },
  solutionCode: {
    type: String,
    required: true,
  },
  validationTests: [{
    description: String,
    testFn: String,
  }],
  hints: [String],
  tags: [String],
  playCount: {
    type: Number,
    default: 0,
  },
  avgSolveTime: {
    type: Number,
    default: 0,
  },
  passRate: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
challengeSchema.index({ category: 1, difficulty: 1 });
challengeSchema.index({ isActive: 1 });
challengeSchema.index({ tags: 1 });

module.exports = mongoose.models?.Challenge || mongoose.model("Challenge", challengeSchema);
