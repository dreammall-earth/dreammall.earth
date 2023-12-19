/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApolloServer } from '@apollo/server'
import { NewsletterSubscription } from '@prisma/client'

import { prisma } from '#src/prisma'
import { createServer } from '#src/server/server'

let testServer: ApolloServer

beforeAll(async () => {
  testServer = await createServer()
})

describe('NewsletterSubscriptionResolver', () => {
  describe('subscribeToNewsletter mutation', () => {
    describe('with correct data', () => {
      it('returns true', async () => {
        const response = await testServer.executeOperation({
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
        expect(response.body).toMatchObject({
          kind: 'single',
          singleResult: {
            data: {
              subscribeToNewsletter: true,
            },
          },
        })
      })

      it('has the newsletter subscription form stored in the database', async () => {
        const result: NewsletterSubscription[] = await prisma.newsletterSubscription.findMany()
        expect(result).toHaveLength(1)
        expect(result).toEqual([
          {
            id: expect.any(Number),
            firstName: 'Peter',
            lastName: 'Lustig',
            email: 'peter@lustig.de',
            createdAt: expect.any(Date),
            brevoSuccess: null,
          },
        ])
      })
    })
  })
})
