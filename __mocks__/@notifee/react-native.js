module.exports = {
  default: {
    displayNotification: jest.fn(),
    createChannel: jest.fn(() => Promise.resolve()),
    requestPermission: jest.fn(() => Promise.resolve()),
    onForegroundEvent: jest.fn(() => jest.fn()),
    onBackgroundEvent: jest.fn(),
  },
  EventType: { PRESS: 1, ACTION_PRESS: 2, DISMISSED: 3 },
  AndroidImportance: { HIGH: 4 },
}
