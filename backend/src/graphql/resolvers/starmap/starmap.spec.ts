import { getMaxDistance, randomStarsinSector } from './starmap'

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

describe('randomStarsinSector', () => {
  describe('24 stars in sector 0', () => {
    it('returns an array with 24 stars', () => {
      const starsInSector = randomStarsinSector(0, 24)
      expect(starsInSector).toMatchObject({
        sectorIdx: 0,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        stars: expect.any(Array),
      })
      expect(starsInSector.stars).toHaveLength(24)
    })
  })
})
