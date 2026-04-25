// User model schema for MongoDB
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
  },
  avatar: {
    type: String,
    default: "",
  },
  provider: {
    type: String,
    enum: ["credentials", "google"],
    default: "credentials",
  },
  xp: {
    type: Number,
    default: 0,
  },
  rank: {
    type: String,
    default: "Intern",
  },
  rating: {
    type: Number,
    default: 1000,
  },
  wins: {
    type: Number,
    default: 0,
  },
  losses: {
    type: Number,
    default: 0,
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastActive: {
    type: Date,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ xp: -1 });
userSchema.index({ rating: -1 });

module.exports = mongoose.models?.User || mongoose.model("User", userSchema);
