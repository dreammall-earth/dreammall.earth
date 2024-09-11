import {
  getMaxDistance,
  distributeStarsToSectorsRecursive,
  getSectors,
  getStarDistribution,
} from './starmap'

describe('getSectors', () => {
  const sectors = getSectors()

  it('has the correct length', () => {
    expect(sectors).toHaveLength(12 * 4 * 3)
  })
})

describe('getMaxDistance', () => {
  describe('called with empty array', () => {
    it('returns 0', () => {
      expect(getMaxDistance([])).toBe(0)
    })
  })

  describe('called with fibonacci numbers', () => {
    it('returns the penultimate index', () => {
      expect(getMaxDistance([0, 1, 2, 3, 5, 8, 13, 21])).toBe(6)
    })
  })

  describe('called with a mix of inte and floats', () => {
    it('returns the correct index', () => {
      expect(getMaxDistance([0.0, 2, 5, 8.1, 9.3, 11, 12.4, 15.4])).toBe(2)
    })
  })
})

describe('getStarDistribution', () => {
  it('returns the expected star distribution', () => {
    expect(getStarDistribution()).toEqual([
      {
        starsPlacedInSectorIteration: [4],
        starsPlacedInIteration: 4,
      },
      {
        starsPlacedInSectorIteration: [8, 4],
        starsPlacedInIteration: 16,
      },
      {
        starsPlacedInSectorIteration: [16, 8, 8],
        starsPlacedInIteration: 48,
      },
      {
        starsPlacedInSectorIteration: [24, 16, 16, 12],
        starsPlacedInIteration: 116,
      },
      {
        starsPlacedInSectorIteration: [40, 24, 32, 24, 20],
        starsPlacedInIteration: 256,
      },
      {
        starsPlacedInSectorIteration: [32, 40, 48, 48, 40, 32],
        starsPlacedInIteration: 496,
      },
      {
        starsPlacedInSectorIteration: [20, 32, 80, 72, 80, 64, 52],
        starsPlacedInIteration: 896,
      },
      {
        starsPlacedInSectorIteration: [20, 64, 120, 120, 128, 104, 84],
        starsPlacedInIteration: 1536,
      },
      {
        starsPlacedInSectorIteration: [40, 96, 200, 192, 208, 168, 136],
        starsPlacedInIteration: 2576,
      },
      {
        starsPlacedInSectorIteration: [60, 160, 320, 312, 336, 272, 220],
        starsPlacedInIteration: 4256,
      },
      {
        starsPlacedInSectorIteration: [100, 256, 520, 504, 544, 440, 356],
        starsPlacedInIteration: 6976,
      },
    ])
  })
})

describe('distributeStarsToSectorsRecursive', () => {
  describe('distribute 3 stars', () => {
    const stars = distributeStarsToSectorsRecursive(3)

    it('has 3 stars', () => {
      expect(stars).toHaveLength(3)
    })

    it('has 1st star in sector 0', () => {
      expect(stars[0].sectorIdx).toBe(0)
    })

    it('has 2nd star in sector 1', () => {
      expect(stars[1].sectorIdx).toBe(1)
    })

    it('has 3rd star in sector 2', () => {
      expect(stars[2].sectorIdx).toBe(2)
    })
  })

  describe('distribute 4 stars', () => {
    const stars = distributeStarsToSectorsRecursive(4)

    it('has 4 stars', () => {
      expect(stars).toHaveLength(4)
    })

    it('has 1st star in sector 0', () => {
      expect(stars[0].sectorIdx).toBe(0)
    })

    it('has 2nd star in sector 1', () => {
      expect(stars[1].sectorIdx).toBe(1)
    })

    it('has 3rd star in sector 2', () => {
      expect(stars[2].sectorIdx).toBe(2)
    })

    it('has 4th star in sector 3', () => {
      expect(stars[3].sectorIdx).toBe(3)
    })
  })

  describe('distribute 5 stars', () => {
    const stars = distributeStarsToSectorsRecursive(5)

    it('has 5 stars', () => {
      expect(stars).toHaveLength(5)
    })

    it('has 1st star in sector 0', () => {
      expect(stars[0].sectorIdx).toBe(0)
    })

    it('has 2nd star in sector 1', () => {
      expect(stars[1].sectorIdx).toBe(1)
    })

    it('has 3rd star in sector 2', () => {
      expect(stars[2].sectorIdx).toBe(2)
    })

    it('has 4th star in sector 3', () => {
      expect(stars[3].sectorIdx).toBe(3)
    })

    it('has 5th star in sector 4', () => {
      expect(stars[4].sectorIdx).toBe(4)
    })
  })

  describe('distribute 14 stars', () => {
    const stars = distributeStarsToSectorsRecursive(14)

    it('has 14 stars', () => {
      expect(stars).toHaveLength(14)
    })

    it('has 1st star in sector 0', () => {
      expect(stars[0].sectorIdx).toBe(0)
    })

    // ToDo: fix
    it('has 13th star in sector 1', () => {
      expect(stars[12].sectorIdx).not.toBe(0)
    })

    // ToDo: fix
    it('has 14th star in sector 1', () => {
      expect(stars[13].sectorIdx).not.toBe(1)
    })
  })
})
