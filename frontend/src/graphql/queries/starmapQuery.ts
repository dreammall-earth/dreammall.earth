import { gql } from 'graphql-tag'

export const starmapQuery = gql`
  query {
    starmap {
      stars {
        id
        azimuth
        altitude
        distance
        magnitude
        color
      }
      starLines {
        from
        to
      }
    }
  }
`

export type Star = {
  id: string
  azimuth: number // longitude in radients 0 <= azimuth <= 2 * pi
  altitude: number // latitude in radients - pi / 2 <= altitude <= pi / 2
  distance: number // relative distance
  magnitude: number // relative size
  color: number // relative color
}

export type StarLine = {
  from: string
  to: string
}

export type StarmapQueryResult = {
  stars: Star[]
  starLines: StarLine[]
}
