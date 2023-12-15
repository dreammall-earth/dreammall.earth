// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata'

const consoleWarnMock = jest.fn()
// eslint-disable-next-line no-console
console.warn = consoleWarnMock
