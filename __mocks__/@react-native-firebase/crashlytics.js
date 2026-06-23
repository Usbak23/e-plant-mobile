const crashlytics = () => ({
  recordError: jest.fn(),
  log: jest.fn(),
  setUserId: jest.fn(),
  crash: jest.fn(),
})
module.exports = crashlytics
module.exports.default = crashlytics
