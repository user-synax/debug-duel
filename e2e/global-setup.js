const { TEST_USERS, TEST_CHALLENGES, TEST_DAILY_CHALLENGE } = require('./fixtures/testData.js')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = require('../../models/User.js')
const Challenge = require('../../models/Challenge.js')
const DailyChallenge = require('../../models/DailyChallenge.js')

// MongoDB connection string - use test database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/debugduel-test'

let serverProcess = null

async function setup() {
  console.log('🚀 Starting E2E test setup...')
  
  // Connect to test database
  console.log('📦 Connecting to test database...')
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected to test database')
  
  // Clean existing test data
  console.log('🧹 Cleaning existing test data...')
  await User.deleteMany({ username: { $in: Object.values(TEST_USERS).map(u => u.username) } })
  await Challenge.deleteMany({ title: { $in: TEST_CHALLENGES.map(c => c.title) } })
  await DailyChallenge.deleteMany({ date: TEST_DAILY_CHALLENGE.date })
  console.log('✅ Cleaned existing test data')
  
  // Seed test users
  console.log('👤 Seeding test users...')
  for (const [key, userData] of Object.entries(TEST_USERS)) {
    const passwordHash = await bcrypt.hash(userData.password, 10)
    await User.create({
      username: userData.username,
      email: userData.email,
      passwordHash,
      isAdmin: userData.role === 'admin',
      xp: key === 'admin' ? 1000 : key === 'user1' ? 500 : 0,
      rating: key === 'admin' ? 1500 : key === 'user1' ? 1200 : 1000,
    })
  }
  console.log('✅ Seeded 3 test users')
  
  // Seed test challenges
  console.log('🎯 Seeding test challenges...')
  for (const challengeData of TEST_CHALLENGES) {
    await Challenge.create({
      title: challengeData.title,
      category: challengeData.type,
      difficulty: challengeData.difficulty,
      description: challengeData.description,
      starterCode: challengeData.initialCode,
      solutionCode: challengeData.expectedOutput,
      hints: challengeData.hints,
      tags: [challengeData.type, 'test'],
      isActive: true,
    })
  }
  console.log('✅ Seeded 5 test challenges')
  
  // Seed daily challenge
  console.log('📅 Seeding daily challenge...')
  const challenges = await Challenge.find({ title: { $in: TEST_CHALLENGES.map(c => c.title) } })
  if (challenges.length > 0) {
    await DailyChallenge.create({
      challengeId: challenges[0]._id,
      date: TEST_DAILY_CHALLENGE.date,
    })
    console.log('✅ Seeded daily challenge')
  }
  
  console.log('✨ E2E test setup complete!')
}

async function teardown() {
  console.log('🧹 Starting E2E test teardown...')
  
  // Clean test data
  await User.deleteMany({ username: { $in: Object.values(TEST_USERS).map(u => u.username) } })
  await Challenge.deleteMany({ title: { $in: TEST_CHALLENGES.map(c => c.title) } })
  await DailyChallenge.deleteMany({ date: TEST_DAILY_CHALLENGE.date })
  
  // Close database connection
  await mongoose.disconnect()
  console.log('✅ E2E test teardown complete!')
}

module.exports = { setup, teardown }
