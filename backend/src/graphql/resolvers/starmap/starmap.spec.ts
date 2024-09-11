import { getMaxDistance, distributeStarsToSectorsRecursive, getSectors } from './starmap'

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

describe('distributeStarsToSectorsRecursive', () => {
  describe('distribute 3 stars', () => {
    const stars = distributeStarsToSectorsRecursive(3)

    it('has 3 stars', () => {
      expect(stars).toHaveLength(3)
    })

    it('has 1 star in sector 0', () => {
      expect(stars[0].sectorIdx).toBe(0)
    })

    it('has 1 star in sector 1', () => {
      expect(stars[1].sectorIdx).toBe(1)
    })

    it('has 1 star in sector 2', () => {
      expect(stars[2].sectorIdx).toBe(2)
    })
  })

  describe('distribute 14 stars', () => {
    const stars = distributeStarsToSectorsRecursive(14)

    it('has 14 stars', () => {
      expect(stars).toHaveLength(14)
    })

    it('has 1 star in sector 11', () => {
      expect(stars[11].sectorIdx).toBe(11)
    })

    it('has 2 stars in sector 0', () => {
      expect(stars[0].sectorIdx).toBe(1)
      expect(stars[12].sectorIdx).toBe(1)
    })

    it('has 2 stars in sector 1', () => {
      expect(stars[1].sectorIdx).toBe(2)
    })

    it('has 1 stars in sector 2', () => {
      expect(stars[2].sectorIdx).toBe(1)
    })
  })
})
