import { Resolver, Query, Authorized } from 'type-graphql'

import { StarMap } from '#models/StarModel'

import { randomStarsinSector } from './starmap/starmap'

@Resolver()
export class StarmapResolver {
  @Authorized()
  @Query(() => StarMap)
  starmap(): StarMap {
    return new StarMap(
      [
        ...randomStarsinSector(0, 512).stars.map((s, i) => ({
          id: `s${i}`,
          azimuth: s.azimuth,
          altitude: s.altitude,
          distance: 1,
          magnitude: 1,
          color: 1,
        })),
        ...randomStarsinSector(1, 256).stars.map((s, i) => ({
          id: `s${i}`,
          azimuth: s.azimuth,
          altitude: s.altitude,
          distance: 1,
          magnitude: 1,
          color: 1,
        })),
        ...randomStarsinSector(2, 256).stars.map((s, i) => ({
          id: `s${i}`,
          azimuth: s.azimuth,
          altitude: s.altitude,
          distance: 1,
          magnitude: 1,
          color: 1,
        })),
        ...randomStarsinSector(3, 256).stars.map((s, i) => ({
          id: `s${i}`,
          azimuth: s.azimuth,
          altitude: s.altitude,
          distance: 1,
          magnitude: 1,
          color: 1,
        })),
        ...randomStarsinSector(4, 256).stars.map((s, i) => ({
          id: `s${i}`,
          azimuth: s.azimuth,
          altitude: s.altitude,
          distance: 1,
          magnitude: 1,
          color: 1,
        })),
        ...randomStarsinSector(5, 128).stars.map((s, i) => ({
          id: `s${i}`,
          azimuth: s.azimuth,
          altitude: s.altitude,
          distance: 1,
          magnitude: 1,
          color: 1,
        })),
        ...randomStarsinSector(6, 128).stars.map((s, i) => ({
          id: `s${i}`,
          azimuth: s.azimuth,
          altitude: s.altitude,
          distance: 1,
          magnitude: 1,
          color: 1,
        })),
        ...randomStarsinSector(7, 128).stars.map((s, i) => ({
          id: `s${i}`,
          azimuth: s.azimuth,
          altitude: s.altitude,
          distance: 1,
          magnitude: 1,
          color: 1,
        })),
        ...randomStarsinSector(8, 128).stars.map((s, i) => ({
          id: `s${i}`,
          azimuth: s.azimuth,
          altitude: s.altitude,
          distance: 1,
          magnitude: 1,
          color: 1,
        })),
      ],
      [],
    )
    /*
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
    */
  }
}
