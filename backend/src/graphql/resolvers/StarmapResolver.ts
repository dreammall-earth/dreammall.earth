import { Resolver, Query, Authorized } from 'type-graphql'

import { StarMap } from '#models/StarModel'
import { prisma, UserWithProfile } from '#src/prisma'

import { distributeStarsToSectorsRecursive } from './starmap/starmap'

@Resolver()
export class StarmapResolver {
  @Authorized()
  @Query(() => StarMap)
  async starmap(): Promise<StarMap> {
    const users: UserWithProfile[] = await prisma.user.findMany({
      include: {
        userDetail: true,
        socialMedia: true,
        meeting: true,
      },
    })

    return new StarMap(
      distributeStarsToSectorsRecursive(users.length).map((s, i) => ({
        // eslint-disable-next-line security/detect-object-injection
        id: `u${users[i].id}`,
        azimuth: s.coordinates.azimuth,
        altitude: s.coordinates.altitude,
        distance: 1,
        magnitude: 1,
        color: 1,
        data: {
          // eslint-disable-next-line security/detect-object-injection
          ...users[i],
          meeting: null,
        },
      })),
      [],
    )
  }
}
