const Database = jest.fn().mockImplementation(() => ({}))
const Model = jest.fn()
const Q = { where: jest.fn(), and: jest.fn(), or: jest.fn() }
const field = jest.fn()
const date = jest.fn()
const readonly = jest.fn()
const relation = jest.fn()
const children = jest.fn()
const lazy = jest.fn()
const tableSchema = jest.fn(t => t)
const appSchema = jest.fn(s => s)

module.exports = { Database, Model, Q, field, date, readonly, relation, children, lazy, tableSchema, appSchema }
