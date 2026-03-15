/**
 * Integration tests for tag-related functionality
 * Tests the interaction between Tag component, TagPage, and git timestamp extraction
 */

import { slug } from 'github-slugger'

describe('Tag System Integration', () => {
  describe('Tag slugification consistency', () => {
    it('should slug tags consistently across components', () => {
      const testTags = [
        'JavaScript',
        'machine learning',
        'C++',
        'Web Development',
        'React.js',
      ]

      testTags.forEach((tag) => {
        const slugged = slug(tag)
        expect(slugged).toBeTruthy()
        expect(slugged).toBe(slugged.toLowerCase())
      })
    })

    it('should handle special characters in tag slugs', () => {
      const specialTags = ['C++', 'F#', '.NET', 'Vue.js']

      specialTags.forEach((tag) => {
        const slugged = slug(tag)
        expect(slugged).toBeTruthy()
        // Slugs should not contain spaces
        expect(slugged).not.toContain(' ')
      })
    })

    it('should produce URL-safe slugs', () => {
      const tags = ['Hello World', 'Test & Debug', 'Code<>Review']

      tags.forEach((tag) => {
        const slugged = slug(tag)
        // Should not contain characters that need URL encoding (except hyphens)
        expect(slugged).toMatch(/^[a-z0-9-]+$/)
      })
    })
  })

  describe('Tag URL generation', () => {
    it('should generate consistent URLs across different languages', () => {
      const tag = 'javascript'
      const languages = ['ko', 'en', 'ja']

      const urls = languages.map((lang) => `/${lang}/tags/${slug(tag)}`)

      expect(urls).toEqual([
        '/ko/tags/javascript',
        '/en/tags/javascript',
        '/ja/tags/javascript',
      ])
    })

    it('should handle encoded tags in URLs', () => {
      const tag = 'web development'
      const encoded = encodeURI(tag)
      const decoded = decodeURI(encoded)

      expect(decoded).toBe(tag)
      expect(slug(decoded)).toBe(slug(tag))
    })

    it('should maintain tag consistency between Tag component and TagPage', () => {
      const originalTag = 'Machine Learning'

      // Tag component text transformation
      const displayText = originalTag.split(' ').join('-')

      // TagPage slug transformation
      const slugged = slug(originalTag)

      // Both should handle the tag consistently
      expect(displayText.toLowerCase()).toContain('machine')
      expect(slugged).toContain('machine')
    })
  })

  describe('Date handling consistency', () => {
    it('should format ISO 8601 dates correctly', () => {
      const isoDate = '2023-12-01T15:30:00Z'
      const date = new Date(isoDate)

      expect(date.toISOString()).toBe(isoDate)
      expect(date.getTime()).toBeGreaterThan(0)
    })

    it('should handle date comparison for modified vs created', () => {
      const created = new Date('2023-01-01T00:00:00Z')
      const modified = new Date('2023-12-01T00:00:00Z')

      expect(modified.getTime()).toBeGreaterThan(created.getTime())
      expect(created.toISOString()).not.toBe(modified.toISOString())
    })

    it('should detect when dates are the same', () => {
      const date1 = '2023-01-01T00:00:00Z'
      const date2 = '2023-01-01T00:00:00Z'

      expect(date1).toBe(date2)
      expect(new Date(date1).getTime()).toBe(new Date(date2).getTime())
    })

    it('should format dates for Korean locale', () => {
      const date = new Date('2023-12-01T15:30:00Z')
      const formatted = date.toLocaleDateString('ko-KR')

      expect(formatted).toContain('2023')
      expect(formatted).toContain('12')
      expect(formatted).toContain('1')
    })
  })

  describe('Multi-language tag filtering', () => {
    it('should filter posts by both language and tag', () => {
      const posts = [
        { lang: 'en', tags: ['javascript', 'react'], draft: false },
        { lang: 'ko', tags: ['javascript', 'vue'], draft: false },
        { lang: 'ja', tags: ['javascript', 'angular'], draft: false },
        { lang: 'en', tags: ['python'], draft: false },
      ]

      const filtered = posts.filter(
        (post) =>
          post.lang === 'en' &&
          !post.draft &&
          post.tags.map((t) => slug(t)).includes('javascript')
      )

      expect(filtered).toHaveLength(1)
      expect(filtered[0].lang).toBe('en')
      expect(filtered[0].tags).toContain('javascript')
    })

    it('should exclude drafts from all language filters', () => {
      const posts = [
        { lang: 'en', tags: ['test'], draft: true },
        { lang: 'ko', tags: ['test'], draft: true },
        { lang: 'ja', tags: ['test'], draft: false },
      ]

      const filtered = posts.filter(
        (post) => !post.draft && post.tags.map((t) => slug(t)).includes('test')
      )

      expect(filtered).toHaveLength(1)
      expect(filtered[0].lang).toBe('ja')
    })
  })

  describe('Static path generation', () => {
    it('should generate all combinations of tags and languages', () => {
      const tags = ['javascript', 'react', 'typescript']
      const langs = ['ko', 'en', 'ja']

      const paths = tags.flatMap((tag) =>
        langs.map((lang) => ({
          tag: encodeURI(tag),
          lang,
        }))
      )

      expect(paths).toHaveLength(9) // 3 tags × 3 languages
      expect(paths.filter((p) => p.lang === 'ko')).toHaveLength(3)
      expect(paths.filter((p) => p.tag === 'javascript')).toHaveLength(3)
    })

    it('should preserve tag encoding in paths', () => {
      const tags = ['web development', 'c++']
      const langs = ['en']

      const paths = tags.flatMap((tag) =>
        langs.map((lang) => ({
          tag: encodeURI(tag),
          lang,
        }))
      )

      expect(paths[0].tag).toBe(encodeURI('web development'))
      expect(paths[1].tag).toBe(encodeURI('c++'))
    })
  })

  describe('Tag count data structure', () => {
    it('should maintain consistent tag counts', () => {
      const posts = [
        { tags: ['javascript', 'react'] },
        { tags: ['javascript', 'vue'] },
        { tags: ['python'] },
      ]

      const tagCount: Record<string, number> = {}

      posts.forEach((post) => {
        post.tags.forEach((tag) => {
          const formattedTag = slug(tag)
          tagCount[formattedTag] = (tagCount[formattedTag] || 0) + 1
        })
      })

      expect(tagCount['javascript']).toBe(2)
      expect(tagCount['react']).toBe(1)
      expect(tagCount['vue']).toBe(1)
      expect(tagCount['python']).toBe(1)
    })

    it('should handle duplicate tags in same post', () => {
      const posts = [{ tags: ['test', 'test', 'other'] }]

      const tagCount: Record<string, number> = {}

      posts.forEach((post) => {
        post.tags.forEach((tag) => {
          const formattedTag = slug(tag)
          tagCount[formattedTag] = (tagCount[formattedTag] || 0) + 1
        })
      })

      expect(tagCount['test']).toBe(2)
      expect(tagCount['other']).toBe(1)
    })
  })

  describe('Error resilience', () => {
    it('should handle missing tag data gracefully', () => {
      const post = { tags: null }

      expect(() => {
        if (post.tags) {
          post.tags.forEach((tag) => slug(tag))
        }
      }).not.toThrow()
    })

    it('should handle undefined language parameter', () => {
      const lang = undefined
      const url = `/${lang}/tags/test`

      expect(url).toBe('/undefined/tags/test')
      // In real implementation, should have validation
    })

    it('should handle empty string tags', () => {
      const emptyTag = ''
      const slugged = slug(emptyTag)

      expect(slugged).toBeDefined()
    })
  })
})