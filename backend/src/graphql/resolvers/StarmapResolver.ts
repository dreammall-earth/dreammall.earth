import { Resolver, Query, Authorized } from 'type-graphql'

import { StarMap, StarLine } from '#models/StarModel'

@Resolver()
export class StarmapResolver {
  @Authorized()
  @Query(() => StarMap)
  starmap(): StarMap {
    return new StarMap(
      [
        {
          id: 's1',
          azimuth: 0.0,
          altitude: 0.0,
          distance: 1,
          magnitude: 1,
          color: 1,
        },
        {
          id: 's2',
          azimuth: Math.PI / 4,
          altitude: Math.PI / 4,
          distance: 1,
          magnitude: 1,
          color: 1,
        },
        {
          id: 's3',
          azimuth: -Math.PI / 4,
          altitude: Math.PI / 6,
          distance: 1,
          magnitude: 1,
          color: 1,
        },
        {
          id: 's4',
          azimuth: -Math.PI / 6,
          altitude: (2 * Math.PI) / 6,
          distance: 1,
          magnitude: 1,
          color: 1,
        },
        {
          id: 's5',
          azimuth: (-2 * Math.PI) / 6,
          altitude: -Math.PI / 6,
          distance: 1,
          magnitude: 1,
          color: 1,
        },
      ],
      [new StarLine('s1', 's3'), new StarLine('s1', 's2')],
    )
  }
}
