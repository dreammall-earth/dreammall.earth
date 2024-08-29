import { ObjectType, Field, Float } from 'type-graphql'

export type StarData = {
  id: string
  azimuth: number // longitude in radients 0 <= azimuth <= 2 * pi
  altitude: number // latitude in radients - pi / 2 <= altitude <= pi / 2
  distance: number // relative distance
  magnitude: number // relative size
  color: number // relative color
}

@ObjectType()
export class Star {
  constructor(starData: StarData) {
    this.id = starData.id
    this.azimuth = starData.azimuth
    this.altitude = starData.altitude
    this.distance = starData.distance
    this.magnitude = starData.magnitude
    this.color = starData.color
  }

  @Field()
  id: string

  @Field(() => Float)
  azimuth: number

  @Field(() => Float)
  altitude: number

  @Field(() => Float)
  distance: number

  @Field(() => Float)
  magnitude: number

  @Field(() => Float)
  color: number
}

@ObjectType()
export class StarLine {
  constructor(a: string, b: string) {
    this.from = a
    this.to = b
  }

  @Field()
  from: string

  @Field()
  to: string
}

@ObjectType()
export class StarMap {
  constructor(starData: StarData[], lines: StarLine[]) {
    this.stars = starData.map((s: StarData) => new Star(s))
    this.starLines = lines
  }

  @Field(() => [Star])
  stars: Star[]

  @Field(() => [StarLine])
  starLines: StarLine[]
}
