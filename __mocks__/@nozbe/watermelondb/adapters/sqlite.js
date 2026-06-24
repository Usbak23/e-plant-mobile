const SQLiteAdapter = jest.fn().mockImplementation(() => ({}))
module.exports = SQLiteAdapter
module.exports.default = SQLiteAdapter
