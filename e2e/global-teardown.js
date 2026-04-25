const { teardown } = require('./global-setup.js')

module.exports = async () => {
  await teardown()
}
