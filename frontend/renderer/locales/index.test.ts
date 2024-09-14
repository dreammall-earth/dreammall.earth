import { describe, expect, it } from 'vitest'

import { extractLocale } from '.'

describe('extractLocale', () => {
  describe('on index page', () => {
    it('has no locale in URL', () => {
      const { locale, urlWithoutLocale } = extractLocale('/')
      expect(locale).toBe('de')
      expect(urlWithoutLocale).toBe('/')
    })

    it('has no locale in URL and is on section #about', () => {
      const { locale, urlWithoutLocale } = extractLocale('/#about')
      expect(locale).toBe('de')
      expect(urlWithoutLocale).toBe('/#about')
    })

    it('has a locale in URL', () => {
      const { locale, urlWithoutLocale } = extractLocale('/en/')
      expect(locale).toBe('en')
      expect(urlWithoutLocale).toBe('/')
    })

    it('has a locale in URL and is on #about section', () => {
      const { locale, urlWithoutLocale } = extractLocale('/en/#about')
      expect(locale).toBe('en')
      expect(urlWithoutLocale).toBe('/#about')
    })
  })

  describe('on impressum page', () => {
    it('has no locale in URL', () => {
      const { locale, urlWithoutLocale } = extractLocale('/impressum')
      expect(locale).toBe('de')
      expect(urlWithoutLocale).toBe('/impressum')
    })

    it('has no locale in URL and is on section #about', () => {
      const { locale, urlWithoutLocale } = extractLocale('/impressum#about')
      expect(locale).toBe('de')
      expect(urlWithoutLocale).toBe('/impressum#about')
    })

    it('has a locale in URL', () => {
      const { locale, urlWithoutLocale } = extractLocale('/en/impressum')
      expect(locale).toBe('en')
      expect(urlWithoutLocale).toBe('/impressum')
    })

    it('has a locale in URL and is on #about section', () => {
      const { locale, urlWithoutLocale } = extractLocale('/en/impressum#about')
      expect(locale).toBe('en')
      expect(urlWithoutLocale).toBe('/impressum#about')
    })
  })
})
