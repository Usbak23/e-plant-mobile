const analytics = () => ({
  logEvent: jest.fn(),
  setUserId: jest.fn(),
  setUserProperties: jest.fn(),
})
module.exports = analytics
module.exports.default = analytics
