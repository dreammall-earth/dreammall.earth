/* eslint-disable jest/max-nested-describe */
import logger from '#src/logger'
import { prisma } from '#src/prisma'
import { deleteAll } from '#test/helpers'

import { createWebhook } from '.'

import type { AuthentikPayload } from '.'

const dependencies = {
  prisma,
  logger,
  config: {
    WEBHOOK_SECRET: undefined,
  },
} satisfies Parameters<typeof createWebhook>[0]

const userDelete = jest.spyOn(prisma.user, 'deleteMany')
const meetingDelete = jest.spyOn(prisma.meeting, 'deleteMany')
const userDetailDelete = jest.spyOn(prisma.userDetail, 'deleteMany')
const socialMediaDelete = jest.spyOn(prisma.socialMedia, 'deleteMany')

describe('createHandleWebhook', () => {
  beforeEach(jest.clearAllMocks)

  it('returns a webhook handler that can be plugged into an express app', () => {
    expect(createWebhook(dependencies).isAuthorized).toBeInstanceOf(Function)
    expect(createWebhook(dependencies).handleWebhook).toBeInstanceOf(Function)
  })
})

describe('isAuthorized', () => {
  describe('CONFIG.WEBHOOK_SECRET not set', () => {
    it('always returns false', () => {
      expect(
        createWebhook(dependencies).isAuthorized({
          query: { authorization: 'WEBHOOK_SECRET-1234-1234' },
        }),
      ).toBe(false)
    })
  })

  describe('CONFIG.WEBHOOK_SECRET is too short', () => {
    it('always returns false', () => {
      const deps = {
        ...dependencies,
        config: { WEBHOOK_SECRET: '1234' },
      }
      expect(
        createWebhook(deps).isAuthorized({ query: { authorization: 'WEBHOOK_SECRET-1234-1234' } }),
      ).toBe(false)
    })
  })

  describe('CONFIG.WEBHOOK_SECRET set and long enough', () => {
    describe('query param ?authorization= does not match', () => {
      it('returns false', () => {
        const deps = {
          ...dependencies,
          config: { WEBHOOK_SECRET: 'WEBHOOK_SECRET-1234-1234' },
        }
        expect(
          createWebhook(deps).isAuthorized({ query: { authorization: 'something-else' } }),
        ).toBe(false)
      })
    })

    describe('query param ?authorization= matches', () => {
      it('returns true', () => {
        const deps = {
          ...dependencies,
          config: { WEBHOOK_SECRET: 'WEBHOOK_SECRET-1234-1234' },
        }
        expect(
          createWebhook(deps).isAuthorized({
            query: { authorization: 'WEBHOOK_SECRET-1234-1234' },
          }),
        ).toBe(true)
      })
    })
  })
})

describe('webhook.handleWebhook', () => {
  beforeEach(async () => {
    await deleteAll()
    jest.clearAllMocks()
  })

  const { handleWebhook } = createWebhook(dependencies)

  describe('when authentik sends an event', () => {
    describe('"model_updated"', () => {
      const authentikPayload: AuthentikPayload = {
        body: "model_updated: {'model': {'pk': '6acb7dd0024d45ad93fe69ba784a0e1d', 'app': 'authentik_events', 'name': 'webhook_notification_transport', 'model_name': 'notificationtransport'}, 'http_request': {'args': {}, 'path': '/api/v3/events/transports/6acb7dd0-024d-45ad-93fe-69ba784a0e1d/', 'method': 'PUT', 'request_id': 'df417136b5c546e59afb9a62c0e37d91', 'user_agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0'}}",
        severity: 'notice',
        user_email: 'admin@dreammall.earth',
        user_username: 'akadmin',
        event_user_email: 'admin@dreammall.earth',
        event_user_username: 'akadmin',
      }
      const req = {
        body: authentikPayload,
      } satisfies Parameters<typeof handleWebhook>[0]

      it('returns undefined', async () => {
        await expect(handleWebhook(req)).resolves.toBeUndefined()
      })

      it("won't call prisma", async () => {
        await handleWebhook(req)
        expect(userDelete).not.toHaveBeenCalled()
      })
    })

    describe('"model_deleted"', () => {
      describe('`model_name` is "group"', () => {
        const authentikPayload: AuthentikPayload = {
          body: "model_deleted: {'model': {'pk': 'd2311204b673426cae5e30b34f387e78', 'app': 'authentik_core', 'name': 'foobar', 'model_name': 'group'}, 'http_request': {'args': {}, 'path': '/api/v3/core/groups/d2311204-b673-426c-ae5e-30b34f387e78/', 'method': 'DELETE', 'request_id': 'c928378b419b46eeaf8f0682efac48be', 'user_agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0'}}",
          severity: 'notice',
          user_email: 'admin@dreammall.earth',
          user_username: 'akadmin',
          event_user_email: 'admin@dreammall.earth',
          event_user_username: 'akadmin',
        }
        const req = {
          body: authentikPayload,
        } satisfies Parameters<typeof handleWebhook>[0]

        it('returns undefined', async () => {
          await expect(handleWebhook(req)).resolves.toBeUndefined()
        })

        it("won't call prisma", async () => {
          await handleWebhook(req)
          expect(userDelete).not.toHaveBeenCalled()
        })
      })

      describe('`model_name` is "user"', () => {
        const authentikPayload: AuthentikPayload = {
          body: "model_deleted: {'model': {'pk': 5, 'app': 'authentik_core', 'name': 'User Name', 'model_name': 'user'}, 'http_request': {'args': {}, 'path': '/api/v3/core/users/5/', 'method': 'DELETE', 'request_id': '686dd61a2a0d4fbd9c64bb4aad5206a9', 'user_agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0'}}",
          severity: 'notice',
          user_email: 'admin@dreammall.earth',
          user_username: 'akadmin',
          event_user_email: 'admin@dreammall.earth',
          event_user_username: 'akadmin',
        }
        const req = {
          body: authentikPayload,
        } satisfies Parameters<typeof handleWebhook>[0]

        it('returns undefined', async () => {
          await expect(handleWebhook(req)).resolves.toBeUndefined()
        })

        describe('given a user in the database', () => {
          const setup = async () => {
            await prisma.user.create({
              data: {
                referenceId: 'ABCDEFGHI',
                username: 'username',
                name: 'User Name',
                id: 43,
                pk: 5,
              },
            })
          }

          it('returns undefined', async () => {
            await setup()
            await expect(handleWebhook(req)).resolves.toBeUndefined()
          })

          it('deletes the particular user in our database', async () => {
            await setup()
            await handleWebhook(req)
            expect(userDelete).toHaveBeenCalledTimes(1)
            expect(userDelete).toHaveBeenCalledWith({
              where: { pk: 5 },
            })
            await expect(prisma.user.count()).resolves.toBe(0)
          })

          it('does not delete meetings by default', async () => {
            await setup()
            await handleWebhook(req)
            expect(meetingDelete).not.toHaveBeenCalled()
          })

          it.each([
            ['userDetail', userDetailDelete],
            ['socialMedia', socialMediaDelete],
          ] as const)(`deletes %s in the database`, async (_model, mock) => {
            await setup()
            await handleWebhook(req)
            expect(mock).toHaveBeenCalledTimes(1)
            expect(mock).toHaveBeenCalledWith({ where: { userId: 43 } })
          })

          describe('if the user owned a meeting', () => {
            const setup = async () => {
              await prisma.meeting.create({
                data: {
                  id: 47,
                  name: 'Some meeting',
                  meetingID: 'some-meeting-id',
                },
              })
              await prisma.user.create({
                data: {
                  meetingId: 47,
                  referenceId: 'ABCDEFGHI',
                  username: 'username',
                  name: 'User Name',
                  pk: 5,
                  id: 43,
                },
              })
            }

            it('deletes that one, too', async () => {
              await setup()
              await handleWebhook(req)
              expect(meetingDelete).toHaveBeenCalledTimes(1)
              expect(meetingDelete).toHaveBeenCalledWith({
                where: { id: 47 },
              })
              await expect(prisma.meeting.count()).resolves.toBe(0)
            })
          })

          describe('if the deleted user would leave an orphaned meeting without moderator', () => {
            const setup = async () => {
              await Promise.all([
                prisma.meeting.create({
                  data: {
                    id: 47,
                    name: 'Some meeting',
                    meetingID: 'some-meeting-id',
                  },
                }),
                prisma.meeting.create({
                  data: {
                    id: 48,
                    name: 'Orphaned meeting',
                    meetingID: 'orphaned-meeting-id',
                  },
                }),
              ])
              await Promise.all([
                prisma.user.create({
                  data: {
                    referenceId: 'ABCDEFGHI',
                    username: 'username',
                    name: 'User Name',
                    pk: 5,
                    id: 43,
                  },
                }),
                prisma.user.create({
                  data: {
                    referenceId: 'ABCDEFGHJ',
                    username: 'another-moderator',
                    name: 'Another Moderator',
                    pk: 6,
                    id: 44,
                  },
                }),
              ])
              await Promise.all([
                prisma.usersInMeetings.create({
                  data: {
                    meetingId: 47,
                    userId: 43,
                    role: 'MODERATOR',
                  },
                }),
                prisma.usersInMeetings.create({
                  data: {
                    meetingId: 48,
                    userId: 43,
                    role: 'MODERATOR',
                  },
                }),
                prisma.usersInMeetings.create({
                  data: {
                    meetingId: 47,
                    userId: 44,
                    role: 'MODERATOR',
                  },
                }),
              ])
            }

            it('deletes any meetings where the deleted user was the only moderator', async () => {
              await setup()
              await expect(prisma.meeting.count()).resolves.toBe(2)
              await handleWebhook(req)
              await expect(prisma.meeting.count()).resolves.toBe(1)
              await expect(prisma.meeting.findUnique({ where: { id: 47 } })).resolves.toMatchObject(
                {
                  name: 'Some meeting',
                  meetingID: 'some-meeting-id',
                },
              )
            })
          })
        })
      })
    })
  })
})
