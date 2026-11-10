module.exports = new Proxy(
  {},
  {
    get: (_, prop) => {
      if (prop === '__esModule') return true
      if (prop === 'default') return new Proxy({}, {get: () => jest.fn()})
      return jest.fn()
    },
  },
)
