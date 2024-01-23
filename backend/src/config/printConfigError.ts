export const printConfigError = (error: string) => {
  // eslint-disable-next-line n/no-process-env
  switch (process.env.NODE_ENV) {
    case 'test':
      return
    case 'production':
      throw new Error(error)
    default:
      // eslint-disable-next-line no-console
      console.warn(error)
  }
}
