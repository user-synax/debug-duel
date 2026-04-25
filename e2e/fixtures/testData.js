// Test data fixtures for E2E tests
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'

const TEST_USERS = {
  admin: {
    username: 'test_admin',
    email: 'admin@test.com',
    password: 'AdminPass123!',
    role: 'admin',
  },
  user1: {
    username: 'test_user1',
    email: 'user1@test.com',
    password: 'UserPass123!',
    role: 'user',
  },
  user2: {
    username: 'test_user2',
    email: 'user2@test.com',
    password: 'UserPass456!',
    role: 'user',
  },
}

const TEST_CHALLENGES = [
  {
    title: 'HTML Structure Test',
    description: 'Fix the HTML structure issues',
    type: 'html',
    difficulty: 'easy',
    initialCode: '<div><p>Test</div>',
    expectedOutput: '<div><p>Test</p></div>',
    hints: ['Check closing tags'],
  },
  {
    title: 'CSS Styling Test',
    description: 'Fix the CSS styling',
    type: 'css',
    difficulty: 'easy',
    initialCode: '.box { color: red; background: blue',
    expectedOutput: '.box { color: red; background: blue; }',
    hints: ['Check semicolons and braces'],
  },
  {
    title: 'JavaScript Array Test',
    description: 'Fix the array manipulation',
    type: 'javascript',
    difficulty: 'medium',
    initialCode: 'const arr = [1, 2, 3]; arr.push(4); return arr.length;',
    expectedOutput: '4',
    hints: ['Array methods'],
  },
  {
    title: 'JavaScript Function Test',
    description: 'Fix the function logic',
    type: 'javascript',
    difficulty: 'medium',
    initialCode: 'function add(a, b) { return a - b; }',
    expectedOutput: 'function add(a, b) { return a + b; }',
    hints: ['Check operation'],
  },
  {
    title: 'React Component Test',
    description: 'Fix the React component',
    type: 'react',
    difficulty: 'hard',
    initialCode: 'export default function Test() { return <div>Hello</div> }',
    expectedOutput: 'export default function Test() { return <div>Hello</div>; }',
    hints: ['Check JSX syntax'],
  },
]

const TEST_DAILY_CHALLENGE = {
  date: new Date().toISOString().split('T')[0],
  challengeId: 'test-daily-001',
  title: 'Daily Debug Challenge',
  description: 'Today\'s daily challenge',
}

module.exports = {
  BASE_URL,
  TEST_USERS,
  TEST_CHALLENGES,
  TEST_DAILY_CHALLENGE,
}
