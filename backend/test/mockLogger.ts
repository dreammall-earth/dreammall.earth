export const createMockLogger = () => {
  return {
    log: jest.fn(),

    silly: jest.fn(),
    trace: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
  }
}
