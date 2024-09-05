/* eslint-disable security/detect-object-injection */

// 15º = 1h
const GRID_UNIT = Math.PI / 12

// smallest possible distance 1'
const DELTA_MIN = Math.PI / 180 / 60

type COORDINATE = {
  azimuth: number
  altitude: number
}

// each sector is as 30º x 30º square
type SECTOR = {
  bottomLeft: COORDINATE
  topRight: COORDINATE
}

const sectors: SECTOR[] = [
  {
    // first sector has coordinates (0,0) as center
    bottomLeft: {
      azimuth: -GRID_UNIT,
      altitude: -GRID_UNIT,
    },
    topRight: {
      azimuth: GRID_UNIT,
      altitude: GRID_UNIT,
    },
  },
  {
    // second sector is on top of sector[0]
    bottomLeft: {
      azimuth: -GRID_UNIT,
      altitude: GRID_UNIT,
    },
    topRight: {
      azimuth: GRID_UNIT,
      altitude: 3 * GRID_UNIT,
    },
  },
  {
    // third sector is under sector[0]
    bottomLeft: {
      azimuth: -GRID_UNIT,
      altitude: -3 * GRID_UNIT,
    },
    topRight: {
      azimuth: GRID_UNIT,
      altitude: -GRID_UNIT,
    },
  },
]

// add sectors to the right and the left
for (let shift = GRID_UNIT; shift < Math.PI / 2; shift += 2 * GRID_UNIT) {
  // add sector to the right
  sectors.push({
    bottomLeft: {
      azimuth: shift,
      altitude: -GRID_UNIT,
    },
    topRight: {
      azimuth: shift + 2 * GRID_UNIT,
      altitude: GRID_UNIT,
    },
  })
  // add sector to the left
  sectors.push({
    bottomLeft: {
      azimuth: -shift - 2 * GRID_UNIT,
      altitude: -GRID_UNIT,
    },
    topRight: {
      azimuth: -shift,
      altitude: GRID_UNIT,
    },
  })
  // add sector top right
  sectors.push({
    bottomLeft: {
      azimuth: shift,
      altitude: GRID_UNIT,
    },
    topRight: {
      azimuth: shift + 2 * GRID_UNIT,
      altitude: 3 * GRID_UNIT,
    },
  })
  // add sector bottom right
  sectors.push({
    bottomLeft: {
      azimuth: shift,
      altitude: -3 * GRID_UNIT,
    },
    topRight: {
      azimuth: shift + 2 * GRID_UNIT,
      altitude: -GRID_UNIT,
    },
  })
  // add sector top left
  sectors.push({
    bottomLeft: {
      azimuth: -shift - 2 * GRID_UNIT,
      altitude: GRID_UNIT,
    },
    topRight: {
      azimuth: -shift,
      altitude: 3 * GRID_UNIT,
    },
  })
  // add sector bottom left
  sectors.push({
    bottomLeft: {
      azimuth: -shift - 2 * GRID_UNIT,
      altitude: -3 * GRID_UNIT,
    },
    topRight: {
      azimuth: -shift,
      altitude: -GRID_UNIT,
    },
  })
}

const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

type StarsInSector = {
  sectorIdx: number
  stars: COORDINATE[]
}

// expects a sorted array
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

export const randomStarsinSector = (sectorIdx: number, count: number): StarsInSector => {
  const time = new Date().getTime()
  const starsInSector: StarsInSector = {
    sectorIdx,
    stars: [],
  }
  const azimuths: number[] = [
    sectors[sectorIdx].bottomLeft.azimuth,
    sectors[sectorIdx].topRight.azimuth,
  ]
  const altitudes: number[] = [
    sectors[sectorIdx].bottomLeft.altitude,
    sectors[sectorIdx].topRight.altitude,
  ]
  for (let n = 0; n < count; n++) {
    const azimuthMaxIdx = getMaxDistance(azimuths)
    const altitudeMaxIdx = getMaxDistance(altitudes)
    const azimuth = randomBetween(
      azimuths[azimuthMaxIdx] + DELTA_MIN,
      azimuths[azimuthMaxIdx + 1] - DELTA_MIN,
    )
    const altitude = randomBetween(
      altitudes[altitudeMaxIdx] + DELTA_MIN,
      altitudes[altitudeMaxIdx + 1] - DELTA_MIN,
    )
    starsInSector.stars.push({
      azimuth,
      altitude,
    })
    azimuths.splice(azimuthMaxIdx, 0, azimuth)
    altitudes.splice(altitudeMaxIdx, 0, altitude)
  }
  // eslint-disable-next-line no-console
  console.log(new Date().getTime() - time)
  return starsInSector
}
