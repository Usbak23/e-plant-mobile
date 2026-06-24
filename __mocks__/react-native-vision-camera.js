const React = require('react')

const Camera = React.forwardRef((props, ref) => null)
Camera.getCameraPermissionStatus = jest.fn(() => 'granted')
Camera.requestCameraPermission = jest.fn(() => Promise.resolve('granted'))
Camera.getMicrophonePermissionStatus = jest.fn(() => 'granted')
Camera.requestMicrophonePermission = jest.fn(() => Promise.resolve('granted'))
Camera.getAvailableCameraDevices = jest.fn(() => [])

module.exports = {
  Camera,
  useCameraDevice: jest.fn(() => null),
  useCameraDevices: jest.fn(() => ({})),
  useCameraPermission: jest.fn(() => ({ hasPermission: true, requestPermission: jest.fn() })),
  useCodeScanner: jest.fn(() => ({})),
  useFrameProcessor: jest.fn(),
}
