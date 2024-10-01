/* eslint-disable security/detect-object-injection */

// 15º = 1h
const GRID_UNIT = Math.PI / 12

// smallest possible distance: 1'
const DELTA_MIN = Math.PI / 180 / 60

// max value is 6
// until calrified vertical scrolling, we skip the two sectors from 45º to 90º
const MAX_VERTICAL_SECTORS = 3

type Coordinates = {
  azimuth: number
  altitude: number
}

// each sector is as 15º x 15º square
type Sector = {
  iteration: number
  bottomLeft: Coordinates
  topRight: Coordinates
}

type Star = {
  sectorIdx: number
  coordinates: Coordinates
}

type StarDistribution = {
  starsPlacedInIteration: number
  starsPlacedInSectorIteration: number[]
}

const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

// these are static singletons, access by the getter functions
const sectors: Sector[] = []
const starDistribution: StarDistribution[] = []
const sectorsPerIteration: number[] = []
const starInSector: number[] = []

/*

This table shows the distribution of the sectors.
Lower iterations are filled first

al | iteration (1 - 10)
----------------------------------------
75 |  6  7  8  8  9  9  9  0  0  0  0  0
60 |  5  6  7  7  8  8  8  9  9  9  9  9
45 |  4  5  6  6  7  7  7  8  8  8  8  8
---------------------------------------- (max vertical sectors)
30 |  3  4  5  5  6  6  6  7  7  7  7  7
15 |  2  3  4  4  5  5  5  6  6  6  6  6
0  |  1  2  3  3  4  4  4  5  5  5  5  5
-----------------------------------------
   |  0  1  2  3  4  5  6  7  8  9 10 11 (hours)

Applying the symetry the sectors look partially like this
with C being the center (0,0)

    -2 |-1 | 0 | 1 | 2 | 3
--------------------------
 15  3 | 2 | 2 | 3 | 4 | 4
     --+---+---+---+---+--
  0  2 | 1 | 1 | 2 | 3 | 3
     --+---C---+---+---+--
-15  2 | 1 | 1 | 2 | 3 | 3
     --+---+---+---+---+--
-30  3 | 2 | 2 | 3 | 4 | 4
--------------------------

The sectors array is ordered like this:

[
 (0, 0), (0, -15), (-1, -15), (-1, 0),
 (1, 0), (1, -15), (-2, -15), (-2, 9),
 (0, 15), (0, -30), (-1, -30), (-1, 15),
 ...
]

This is how the stars are distributed to the sectors
(with max vertical sectors of 3),
formalized in singleton starDistribution (see spec)

Iteration | distribution                                            | sum         | total
----------------------------------------------------------------------------------------
 1        | 1 star in each sector with iteration 1 (1 * 4 sectors)  | 1 * 4 = 4   |    4
----------------------------------------------------------------------------------------
 2        | 1 star in each sector with iteration 2 (2 * 4 sectors)  | 1 * 8 = 8   |   12
          | 1 star in each sector with iteration 1                  | 1 * 4 = 4   |   16
----------------------------------------------------------------------------------------
 3        | 1 star in each sector with iteration 3 (4 * 4 sectors)  | 1 * 16 = 16 |   32
          | 1 star in each sector with iteration 2                  | 1 * 8 = 8   |   40
          | 2 stars in each sector with iteration 1                 | 2 * 4 = 8   |   48
----------------------------------------------------------------------------------------
 4        | 1 star in each sector with iteration 4 (6 * 4 sectors)  | 1 * 24 = 24 |   72
          | 1 star in each sector with iteration 3                  | 1 * 16 = 16 |   88
          | 2 stars in each sector with iteration 2                 | 2 * 8 = 16  |  104
          | 3 stars in each sector with iteration 1                 | 3 * 4 = 12  |  116
........................................................................................
 5        | 1 star in each sector with iteration 5 (10 * 4 sectors) | 1 * 40 = 40 |  156
          | 1 star in each sector with iteration 4                  | 1 * 24 = 24 |  180
          | 2 stars in each sector with iteration 3                 | 2 * 16 = 32 |  212
          | 3 stars in each sector with iteration 2                 | 3 * 8 = 24  |  236
          | 5 stars in each sector with iteration 1                 | 5 * 4 = 20  |  256
----------------------------------------------------------------------------------------
 6        | 1 star in each sector with iteration 6 (8 * 4 sectors)  | 1 * 32 = 32 |  288
          | 1 star in each sector with iteration 5                  | 1 * 40 = 40 |  328
          | 2 stars in each sector with iteration 4                 | 2 * 24 = 48 |  376 
          | 3 stars in each sector with iteration 3                 | 3 * 16 = 48 |  424
          | 5 stars in each sector with iteration 2                 | 5 * 8 = 40  |  464
          | 8 stars in each sector with iteration 1                 | 8 * 4 = 32  |  496
----------------------------------------------------------------------------------------
 7        | 1 star in each sector with iteration 7 (5 * 4 sectors)  | 1 * 20 = 20 |  516
          | 1 star in each sector with iteration 6                  | 1 * 32 = 32 |  548
          | 2 stars in each sector with iteration 5                 | 2 * 40 = 80 |  628
          | 3 stars in each sector with iteration 4                 | 3 * 24 = 72 |  700
          | 5 stars in each sector with iteration 3                 | 5 * 16 = 80 |  780
          | 8 stars in each sector with iteration 2                 | 8 * 8 = 64  |  844
          | 13 stars in each sector with iteration 1                | 13 * 4 = 52 |  896
----------------------------------------------------------------------------------------
 8        | 1 star in each sector with iteration 7                  | 1 * 20 = 20 |  916
          | 2 stars in each sector with iteration 6                 | 2 * 32 = 64 |  980
          | 3 stars in each sector with iteration 5                 | 3 * 40 = 120| 1100
          | 5 stars in each sector with iteration 4                 | 5 * 24 = 120| 1220
          | 8 stars in each sector with iteration 3                 | 8 * 16 = 128| 1348
          | 13 stars in each sector with iteration 2                | 13 * 8 = 104| 1452
          | 21 stars in each sector with iteration 1                | 21 * 4 = 84 | 1536
----------------------------------------------------------------------------------------
 9        | ...                                                     | ...         | 2576
----------------------------------------------------------------------------------------
10        | ...                                                     | ...         | 4256
----------------------------------------------------------------------------------------
11        | ...                                                     | ...         | 6976
----------------------------------------------------------------------------------------

To reduce the max number, remove a fibonacci number

*/

const symetry: Coordinates[] = [
  {
    // top right sector
    azimuth: 1.0,
    altitude: 1.0,
  },
  {
    // bottom right sector
    azimuth: 1.0,
    altitude: -1.0,
  },
  {
    // bottom left sector
    azimuth: -1.0,
    altitude: -1.0,
  },
  {
    // top left sector
    azimuth: -1.0,
    altitude: 1.0,
  },
]

// add 4 more sectors clockwise
const addSectorsSymetrically = (azimuth: number, altitude: number, iteration: number) => {
  symetry.forEach((s) => {
    const azimuths = [azimuth * s.azimuth, (azimuth + GRID_UNIT) * s.azimuth]
    const altitudes = [altitude * s.altitude, (altitude + GRID_UNIT) * s.altitude]
    sectors.push({
      iteration,
      bottomLeft: {
        azimuth: Math.min(...azimuths),
        altitude: Math.min(...altitudes),
      },
      topRight: {
        azimuth: Math.max(...azimuths),
        altitude: Math.max(...altitudes),
      },
    })
  })
}

const numberOfSectorsAdded = (iteration: number): number => {
  return fibonacci.slice(0, iteration).reduce((acc, curr) => acc + curr, 0)
}

export const getSectors = (): Sector[] => {
  if (sectors.length) return sectors

  let iteration = 1

  while (sectors.length < 4 * 12 * MAX_VERTICAL_SECTORS) {
    const linesAlreadyFilled = iteration > 5 ? iteration - 5 : 0
    for (
      let i = iteration;
      i > Math.max(0, iteration - MAX_VERTICAL_SECTORS + linesAlreadyFilled);
      i--
    ) {
      const alreadyAdded = numberOfSectorsAdded(i - 1 - linesAlreadyFilled)
      for (let j = 0; j < fibonacci[i - 1 - linesAlreadyFilled]; j++) {
        addSectorsSymetrically(
          GRID_UNIT * (alreadyAdded + j),
          GRID_UNIT * (iteration - i + linesAlreadyFilled),
          iteration,
        )
      }
    }
    iteration++
  }
  return sectors
}

const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

// returns the index of the element with the greatest distance to the next element
export const getMaxDistance = (x: number[]) => {
  let maxIdx: number = 0
  const length = x.length
  let maxDistance: number = 0.0
  return x.reduce((acc: number, _, i: number) => {
    if (i === length - 1) return maxIdx
    const distance = x[i + 1] - x[i]
    if (distance > maxDistance) {
      maxDistance = distance
      maxIdx = i
      return maxIdx
    }
    return maxIdx
  }, maxIdx)
}

const getSectorsPerIteration = (): number[] => {
  if (sectorsPerIteration.length) return sectorsPerIteration
  const sectors = getSectors()
  let i = 1
  let count = 0
  while ((count = sectors.filter((s) => s.iteration === i).length) > 0) {
    sectorsPerIteration.push(count)
    i++
  }
  return sectorsPerIteration
}

export const getStarDistribution = (): StarDistribution[] => {
  if (starDistribution.length) return starDistribution
  const iterationLength = 4 + MAX_VERTICAL_SECTORS
  const sectorsPerIteration = getSectorsPerIteration()

  let starsAdded = 4

  fibonacci.forEach((_, i) => {
    if (i === 0) {
      starDistribution.push({
        starsPlacedInSectorIteration: [starsAdded],
        starsPlacedInIteration: starsAdded,
      })
    } else {
      const starsPlacedInSectorIteration = []
      const startIdx = i > iterationLength - 1 ? i - iterationLength + 1 : 0
      const length = Math.min(iterationLength, i + 1)
      for (let j = startIdx; j < length + startIdx; j++) {
        const starsAddedInSectorIteration =
          fibonacci[j] * sectorsPerIteration[length - j - 1 + startIdx]
        starsAdded += starsAddedInSectorIteration
        starsPlacedInSectorIteration.push(starsAddedInSectorIteration)
      }
      starDistribution.push({
        starsPlacedInSectorIteration,
        starsPlacedInIteration: starsAdded,
      })
    }
  })
  return starDistribution
}

const getNextSectorIdx = (starsPlaced: number): number => {
  if (starInSector[starsPlaced] || starInSector[starsPlaced] === 0) {
    return starInSector[starsPlaced]
  }

  const pushAndReturn = (n: number): number => {
    starInSector.push(n)
    return n
  }

  if (starsPlaced === 0) {
    return pushAndReturn(0)
  }

  const starDistribution = getStarDistribution()
  const sectors = getSectors()

  let iteration: number = 0

  if (
    (iteration = starDistribution.findIndex((sD) => sD.starsPlacedInIteration === starsPlaced)) > -1
  ) {
    return pushAndReturn(
      sectors.findIndex(
        (s: Sector) =>
          s.iteration ===
          starDistribution[Math.min(iteration + 1, 3 + MAX_VERTICAL_SECTORS)]
            .starsPlacedInSectorIteration.length,
      ),
    )
  }

  iteration = starDistribution.findIndex((sD) => sD.starsPlacedInIteration > starsPlaced)
  const starsAddedInPreviousIterations =
    iteration === 0 ? 0 : starDistribution[iteration - 1].starsPlacedInIteration

  const starsToPlace = starsPlaced - starsAddedInPreviousIterations

  let sectorIterationIdx = 0
  let starsAddedInSectorIterations = 0
  const { starsPlacedInSectorIteration } = starDistribution[iteration]
  while (starsToPlace > starsAddedInSectorIterations) {
    starsAddedInSectorIterations += starsPlacedInSectorIteration[sectorIterationIdx]
    sectorIterationIdx++
  }

  if (starsToPlace === starsAddedInSectorIterations) {
    return pushAndReturn(
      sectors.findIndex(
        (s: Sector) => s.iteration === starsPlacedInSectorIteration.length - sectorIterationIdx,
      ),
    )
  }

  const f = fibonacci[sectorIterationIdx - 1 + Math.max(iteration - 3 - MAX_VERTICAL_SECTORS, 0)]

  if (f > 1) {
    const starsPlacedInThisSectorIteration = starsPlacedInSectorIteration
      .slice(0, sectorIterationIdx - 1)
      .reduce((acc, curr) => acc + curr, 0)
    const starsToPlcaeInThisSectorIteration = starsToPlace - starsPlacedInThisSectorIteration

    const sectorsPerIteration =
      getSectorsPerIteration()[starsPlacedInSectorIteration.length - sectorIterationIdx]

    if (starsToPlcaeInThisSectorIteration % sectorsPerIteration === 0) {
      return pushAndReturn(starInSector[starsPlaced - 1] - sectorsPerIteration + 1)
    }
    return pushAndReturn(starInSector[starsPlaced - 1] + 1)
  }

  return pushAndReturn(starInSector[starsPlaced - 1] + 1)
}

export const distributeStarsToSectorsRecursive = (
  starsToPlace: number,
  stars: Star[] = [],
): Star[] => {
  if (starsToPlace === 0) return stars
  stars.push(addRandomStarToSector(getNextSectorIdx(stars.length), stars))
  return distributeStarsToSectorsRecursive(starsToPlace - 1, stars)
}

const addRandomStarToSector = (sectorIdx: number, stars: Star[]): Star => {
  const sector = getSectors()[sectorIdx]

  const azimuths = [sector.bottomLeft.azimuth, sector.topRight.azimuth]

  const altitudes = [sector.bottomLeft.altitude, sector.topRight.altitude]

  stars
    .filter((s) => s.sectorIdx === sectorIdx)
    .forEach((s) => {
      azimuths.push(s.coordinates.azimuth)
      altitudes.push(s.coordinates.altitude)
    })

  const sortFn = (a: number, b: number): number => {
    return a - b
  }

  const azimuthMaxIdx = getMaxDistance(azimuths.sort(sortFn))
  const altitudeMaxIdx = getMaxDistance(altitudes.sort(sortFn))

  const azimuth = randomBetween(
    azimuths[azimuthMaxIdx] + DELTA_MIN,
    azimuths[azimuthMaxIdx + 1] - DELTA_MIN,
  )
  const altitude = randomBetween(
    altitudes[altitudeMaxIdx] + DELTA_MIN,
    altitudes[altitudeMaxIdx + 1] - DELTA_MIN,
  )

  return {
    sectorIdx,
    coordinates: {
      azimuth,
      altitude,
    },
  }
}
