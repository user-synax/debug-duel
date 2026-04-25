// Global teardown for E2E tests
const { teardown } = require('./global-setup.js')

module.exports = async () => {
  await teardown()
}
