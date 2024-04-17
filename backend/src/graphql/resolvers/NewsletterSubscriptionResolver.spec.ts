import { ApolloServer } from '@apollo/server'

import { confirmNewsletter, subscribeToNewsletter } from '#api/Brevo'
import { CONFIG } from '#config/config'
import { EventType } from '#src/event/EventType'
import { prisma } from '#src/prisma'
import { createTestServer } from '#src/server/server'

CONFIG.BREVO_KEY = 'MY KEY'
CONFIG.BREVO_ADMIN_NAME = 'Bibi Bloxberg'
CONFIG.BREVO_ADMIN_EMAIL = 'bibi@bloxberg.de'
CONFIG.BREVO_NEWSLETTER_TEMPLATE_OPTIN = 3

let testServer: ApolloServer

jest.mock('#api/Brevo', () => ({
  subscribeToNewsletter: jest.fn().mockResolvedValue(true),
  confirmNewsletter: jest
    .fn()
    .mockResolvedValueOnce(false)
    .mockResolvedValue({ email: 'peter@lustig.de' }),
}))

beforeAll(async () => {
  testServer = await createTestServer()
})

describe('NewsletterSubscriptionResolver', () => {
  describe('subscribeToNewsletter mutation', () => {
    describe('email is no email', () => {
      it('throws schema error', async () => {
        const response = await testServer.executeOperation({
          query: `mutation($data: SubscribeToNewsletterInput!) {
                    subscribeToNewsletter(subscribeToNewsletterData: $data) 
                  }`,
          variables: {
            data: {
              firstName: 'Peter',
              lastName: 'Lustig',
              email: 'peter(at)lustig.de',
            },
          },
        })
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: null,
            errors: [
              {
                message: 'Argument Validation Error',
              },
            ],
          },
        })
      })
    })

    describe('email is too long', () => {
      it('throws schema error', async () => {
        const response = await testServer.executeOperation({
          query: `mutation($data: SubscribeToNewsletterInput!) {
                    subscribeToNewsletter(subscribeToNewsletterData: $data) 
                  }`,
          variables: {
            data: {
              firstName: 'Peter',
              lastName: 'Lustig',
              email:
                'Aloysius.Bartholomew.Chauncey.Constantine.Devereaux.Ellington.Feliciano.Giuseppe.Horatio.Ignatius@lustig.de',
            },
          },
        })
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: null,
            errors: [
              {
                message: 'Argument Validation Error',
              },
            ],
          },
        })
      })
    })

    describe('first name is too long', () => {
      it('throws schema error', async () => {
        const response = await testServer.executeOperation({
          query: `mutation($data: SubscribeToNewsletterInput!) {
                    subscribeToNewsletter(subscribeToNewsletterData: $data) 
                  }`,
          variables: {
            data: {
              firstName: 'Aloysius Bartholomew Chauncey Constantine Devereaux',
              lastName: 'Lustig',
              email: 'peter@lustig.de',
            },
          },
        })
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: null,
            errors: [
              {
                message: 'Argument Validation Error',
              },
            ],
          },
        })
      })
    })

    describe('last name is too long', () => {
      it('throws schema error', async () => {
        const response = await testServer.executeOperation({
          query: `mutation($data: SubscribeToNewsletterInput!) {
                    subscribeToNewsletter(subscribeToNewsletterData: $data) 
                  }`,
          variables: {
            data: {
              firstName: 'Daenerys',
              lastName:
                'Stormborn of the House Targaryen, First of Her Name, the Unburnt, Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains, and Mother of Dragons',
              email: 'daenerys@red-keep.westeros',
            },
          },
        })
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: null,
            errors: [
              {
                message: 'Argument Validation Error',
              },
            ],
          },
        })
      })
    })

    describe('with correct data', () => {
      let response: Awaited<ReturnType<typeof testServer.executeOperation>>
      beforeEach(async () => {
        await prisma.event.deleteMany()
        response = await testServer.executeOperation({
          query: `mutation($data: SubscribeToNewsletterInput!) {
                    subscribeToNewsletter(subscribeToNewsletterData: $data) 
                  }`,
          variables: {
            data: {
              firstName: 'Peter',
              lastName: 'Lustig',
              email: 'peter@lustig.de',
            },
          },
        })
      })

      it('calls subscribeToNewsletter', () => {
        expect(subscribeToNewsletter).toHaveBeenCalledTimes(1)
        expect(subscribeToNewsletter).toHaveBeenCalledWith('Peter', 'Lustig', 'peter@lustig.de')
      })

      it('returns true', () => {
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: {
              subscribeToNewsletter: true,
            },
          },
        })
      })

      it('writes event to database', async () => {
        const result = await prisma.event.findMany()
        expect(result).toHaveLength(1)
        expect(result).toEqual([
          {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(Number),
            type: EventType.NEWSLETTER_SUBSCRIBE,
            involvedEmail: 'peter@lustig.de',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(Date),
          },
        ])
      })
    })
  })

  describe('confirmNewsletter mutation', () => {
    let response: Awaited<ReturnType<typeof testServer.executeOperation>>
    beforeEach(async () => {
      jest.clearAllMocks()
      await prisma.event.deleteMany()
      response = await testServer.executeOperation({
        query: `mutation($code: String!) {
                  confirmNewsletter(code: $code) 
                }`,
        variables: {
          code: '1234567890abcdef',
        },
      })
    })

    it('returns false on first call', () => {
      expect(response.body).toMatchObject({
        kind: 'single',
        singleResult: {
          data: {
            confirmNewsletter: false,
          },
        },
      })
    })

    it('calls confirmNewsletter', () => {
      expect(confirmNewsletter).toHaveBeenCalledTimes(1)
      expect(confirmNewsletter).toHaveBeenCalledWith('1234567890abcdef')
    })

    it('returns true', () => {
      expect(response.body).toMatchObject({
        kind: 'single',
        singleResult: {
          data: {
            confirmNewsletter: true,
          },
        },
      })
    })

    it('writes event to database', async () => {
      const result = await prisma.event.findMany()
      expect(result).toHaveLength(1)
      expect(result).toEqual([
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(Number),
          type: EventType.NEWSLETTER_CONFIRM,
          involvedEmail: 'peter@lustig.de',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          createdAt: expect.any(Date),
        },
      ])
    })
  })
})
