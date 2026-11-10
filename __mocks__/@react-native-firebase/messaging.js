const messaging = () => ({
  onMessage: jest.fn(),
  onNotificationOpenedApp: jest.fn(),
  getInitialNotification: jest.fn(() => Promise.resolve(null)),
  requestPermission: jest.fn(() => Promise.resolve(1)),
  getToken: jest.fn(() => Promise.resolve('mock-token')),
  setBackgroundMessageHandler: jest.fn(),
  subscribeToTopic: jest.fn(),
  unsubscribeFromTopic: jest.fn(),
})
messaging.AuthorizationStatus = { AUTHORIZED: 1, PROVISIONAL: 2 }
module.exports = messaging
module.exports.default = messaging
