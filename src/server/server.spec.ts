// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ApolloServer } from 'apollo-server-express'
import express from 'express'

import { listen } from './server'

jest.mock('express', () => {
  const originalModule = jest.requireActual('express')
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => {
      return {
        listen: jest.fn(),
      }
    }),
  }
})

jest.mock('apollo-server-express')

describe('server', () => {
  describe('listen', () => {
    beforeEach(async () => {
      jest.clearAllMocks()
      await listen(4000)
    })

    it('calls express', () => {
      expect(express).toBeCalled()
    })
  })
})
