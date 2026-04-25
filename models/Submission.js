import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
  },
  timeTaken: {
    type: Number,
  },
  score: {
    type: Number,
    default: 0,
  },
  testResults: [{
    description: String,
    passed: Boolean,
  }],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
submissionSchema.index({ userId: 1, challengeId: 1 });
submissionSchema.index({ userId: 1, submittedAt: -1 });
submissionSchema.index({ challengeId: 1 });

export default mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
