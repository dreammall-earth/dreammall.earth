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
          altitude: Math.PI / 6,
          distance: 1,
          magnitude: 4,
          color: 1,
        },
        {
          id: 's2',
          azimuth: Math.PI / 3,
          altitude: Math.PI / 3,
          distance: 1,
          magnitude: 3,
          color: 1,
        },
        {
          id: 's3',
          azimuth: -Math.PI / 4,
          altitude: Math.PI / 6,
          distance: 1,
          magnitude: 3,
          color: 1,
        },
        {
          id: 's4',
          azimuth: -Math.PI / 6,
          altitude: Math.PI / 4,
          distance: 1,
          magnitude: 3,
          color: 1,
        },
        {
          id: 's5',
          azimuth: -Math.PI / 3,
          altitude: -Math.PI / 6,
          distance: 1,
          magnitude: 3,
          color: 1,
        },
        {
          id: 's6',
          azimuth: -0.281666667,
          altitude: 0.043611111,
          distance: 1,
          magnitude: 3,
          color: 1,
        },
        {
          id: 's7',
          azimuth: -0.1931666667,
          altitude: -0.2131666667,
          distance: 1,
          magnitude: 3,
          color: 1,
        },
        {
          id: 's8',
          azimuth: -0.043611111,
          altitude: -0.2531666667,
          distance: 1,
          magnitude: 3,
          color: 1,
        },
        {
          id: 's9',
          azimuth: 0.1731666667,
          altitude: -0.2131666667,
          distance: 1,
          magnitude: 3,
          color: 1,
        },
        {
          id: 's10',
          azimuth: 0.251666667,
          altitude: -0.043611111,
          distance: 1,
          magnitude: 3,
          color: 1,
        },
        {
          id: 's11',
          azimuth: 0.265666667,
          altitude: 0.003611111,
          distance: 1,
          magnitude: 3,
          color: 1,
        },
        {
          id: 's12',
          azimuth: 0.205666667,
          altitude: 0.2131666667,
          distance: 1,
          magnitude: 3,
          color: 1,
        },
      ],
      [
        new StarLine('s6', 's7'),
        new StarLine('s6', 's8'),
        new StarLine('s6', 's9'),
        new StarLine('s7', 's8'),
        new StarLine('s7', 's9'),
        new StarLine('s7', 's8'),
        new StarLine('s7', 's11'),
        new StarLine('s8', 's9'),
        new StarLine('s8', 's10'),
        new StarLine('s9', 's10'),
        new StarLine('s10', 's11'),
        new StarLine('s10', 's6'),
        new StarLine('s6', 's11'),
        new StarLine('s9', 's12'),
        new StarLine('s8', 's12'),
        new StarLine('s7', 's12'),
      ],
    )
  }
}
