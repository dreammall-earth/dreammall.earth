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

    it('has 12th star in sector 11', () => {
      expect(stars[11].sectorIdx).toBe(11)
    })

    it('has 13th star in sector 0', () => {
      expect(stars[12].sectorIdx).toBe(0)
    })

    it('has 14th star in sector 1', () => {
      expect(stars[13].sectorIdx).toBe(1)
    })
  })

  describe('distribute 16 stars', () => {
    const stars = distributeStarsToSectorsRecursive(16)

    it('has 16 stars', () => {
      expect(stars).toHaveLength(16)
    })

    it('has last star in sector 3', () => {
      expect(stars[15].sectorIdx).toBe(3)
    })
  })

  describe('distribute 17 stars', () => {
    const stars = distributeStarsToSectorsRecursive(17)

    it('has 17 stars', () => {
      expect(stars).toHaveLength(17)
    })

    it('has last star in sector 12', () => {
      expect(stars[16].sectorIdx).toBe(12)
    })
  })

  describe('distribute 48 stars', () => {
    const stars = distributeStarsToSectorsRecursive(48)

    it('has 48 stars', () => {
      expect(stars).toHaveLength(48)
    })

    it('has star at index 39 in sector 11', () => {
      expect(stars[39].sectorIdx).toBe(11)
    })

    it('has star at index 40 in sector 0', () => {
      expect(stars[40].sectorIdx).toBe(0)
    })

    it('has the last 4 stars in sector 0, 1, 2, 3', () => {
      expect(stars[44].sectorIdx).toBe(0)
      expect(stars[45].sectorIdx).toBe(1)
      expect(stars[46].sectorIdx).toBe(2)
      expect(stars[47].sectorIdx).toBe(3)
    })
  })

  describe('distribute 116 stars', () => {
    const stars = distributeStarsToSectorsRecursive(116)

    it('has 116 stars', () => {
      expect(stars).toHaveLength(116)
    })

    it('has star at index 48 in sector 28', () => {
      expect(stars[48].sectorIdx).toBe(28)
    })

    it('has star at index 71 in sector 51', () => {
      expect(stars[71].sectorIdx).toBe(51)
    })

    it('has star at index 72 in sector 12', () => {
      expect(stars[72].sectorIdx).toBe(12)
    })

    it('has star at index 88 in sector 4', () => {
      expect(stars[88].sectorIdx).toBe(4)
    })

    it('has star at index 96 in sector 4', () => {
      expect(stars[96].sectorIdx).toBe(4)
    })

    it('has the last 4 stars in sector 0, 1, 2, 3', () => {
      expect(stars[112].sectorIdx).toBe(0)
      expect(stars[113].sectorIdx).toBe(1)
      expect(stars[114].sectorIdx).toBe(2)
      expect(stars[115].sectorIdx).toBe(3)
    })
  })

  describe('distribute 256 stars', () => {
    const stars = distributeStarsToSectorsRecursive(256)

    it('has 256 stars', () => {
      expect(stars).toHaveLength(256)
    })

    it('has the last 4 stars in sector 0, 1, 2, 3', () => {
      expect(stars[252].sectorIdx).toBe(0)
      expect(stars[253].sectorIdx).toBe(1)
      expect(stars[254].sectorIdx).toBe(2)
      expect(stars[255].sectorIdx).toBe(3)
    })
  })

  describe('distribute 496 stars', () => {
    const stars = distributeStarsToSectorsRecursive(496)

    it('has 496 stars', () => {
      expect(stars).toHaveLength(496)
    })
  })

  describe('distribute 896 stars', () => {
    const stars = distributeStarsToSectorsRecursive(896)

    it('has 896 stars', () => {
      expect(stars).toHaveLength(896)
    })
  })
})
