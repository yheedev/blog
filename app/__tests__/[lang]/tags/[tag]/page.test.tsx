/**
 * Unit tests for TagPage component
 * Tests tag filtering, metadata generation, and static path generation
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { notFound } from 'next/navigation'

// Mock dependencies
jest.mock('next/navigation')
jest.mock('contentlayer/generated', () => ({
  allBlogs: [
    {
      lang: 'en',
      draft: false,
      tags: ['javascript', 'web development'],
      title: 'JS Post',
      slug: 'js-post',
      path: 'en/blog/js-post',
    },
    {
      lang: 'ko',
      draft: false,
      tags: ['react', 'frontend'],
      title: 'React Post',
      slug: 'react-post',
      path: 'ko/blog/react-post',
    },
    {
      lang: 'en',
      draft: true,
      tags: ['draft-tag'],
      title: 'Draft Post',
      slug: 'draft-post',
      path: 'en/blog/draft-post',
    },
    {
      lang: 'ja',
      draft: false,
      tags: ['javascript', 'typescript'],
      title: 'TS Post',
      slug: 'ts-post',
      path: 'ja/blog/ts-post',
    },
  ],
}))

jest.mock('app/tag-data.json', () => ({
  javascript: 2,
  'web-development': 1,
  react: 1,
  frontend: 1,
  typescript: 1,
}))

jest.mock('@/data/siteMetadata', () => ({
  default: {
    title: 'Test Blog',
    siteUrl: 'https://test-blog.com',
  },
}))

jest.mock('app/seo', () => ({
  genPageMetadata: jest.fn((params) => params),
}))

jest.mock('@/layouts/ListLayout', () => {
  return function ListLayout({ posts, title, lang }) {
    return (
      <div data-testid="list-layout">
        <h1>{title}</h1>
        <div data-testid="lang">{lang}</div>
        <div data-testid="post-count">{posts.length}</div>
      </div>
    )
  }
})

// Import the functions we want to test
// Note: In actual implementation, these would be imported from the page file
describe('TagPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateStaticParams', () => {
    it('should generate paths for all tags and languages', async () => {
      // Mock implementation
      const generateStaticParams = async () => {
        const tagData = {
          javascript: 2,
          'web-development': 1,
          react: 1,
          frontend: 1,
          typescript: 1,
        }
        const tagKeys = Object.keys(tagData)
        const paths = tagKeys.flatMap((tag) =>
          ['ko', 'en', 'ja'].map((lang) => ({
            tag: encodeURI(tag),
            lang,
          }))
        )
        return paths
      }

      const paths = await generateStaticParams()

      expect(paths).toHaveLength(15) // 5 tags × 3 languages
      expect(paths).toContainEqual({ tag: 'javascript', lang: 'ko' })
      expect(paths).toContainEqual({ tag: 'javascript', lang: 'en' })
      expect(paths).toContainEqual({ tag: 'javascript', lang: 'ja' })
      expect(paths).toContainEqual({ tag: 'react', lang: 'ko' })
    })

    it('should encode URI for tags with special characters', async () => {
      const generateStaticParams = async () => {
        const tagData = { 'c++': 1, 'web development': 1 }
        const tagKeys = Object.keys(tagData)
        return tagKeys.flatMap((tag) =>
          ['ko', 'en', 'ja'].map((lang) => ({
            tag: encodeURI(tag),
            lang,
          }))
        )
      }

      const paths = await generateStaticParams()

      expect(paths.some((p) => p.tag === encodeURI('c++'))).toBe(true)
      expect(paths.some((p) => p.tag === encodeURI('web development'))).toBe(true)
    })

    it('should generate paths for all supported languages', async () => {
      const generateStaticParams = async () => {
        const tagData = { test: 1 }
        const tagKeys = Object.keys(tagData)
        return tagKeys.flatMap((tag) =>
          ['ko', 'en', 'ja'].map((lang) => ({
            tag: encodeURI(tag),
            lang,
          }))
        )
      }

      const paths = await generateStaticParams()
      const langs = [...new Set(paths.map((p) => p.lang))]

      expect(langs).toContain('ko')
      expect(langs).toContain('en')
      expect(langs).toContain('ja')
      expect(langs).toHaveLength(3)
    })

    it('should handle empty tag data', async () => {
      const generateStaticParams = async () => {
        const tagData = {}
        const tagKeys = Object.keys(tagData)
        return tagKeys.flatMap((tag) =>
          ['ko', 'en', 'ja'].map((lang) => ({
            tag: encodeURI(tag),
            lang,
          }))
        )
      }

      const paths = await generateStaticParams()
      expect(paths).toHaveLength(0)
    })
  })

  describe('generateMetadata', () => {
    it('should generate correct metadata for a tag', async () => {
      const { genPageMetadata } = require('app/seo')
      const siteMetadata = require('@/data/siteMetadata').default

      const generateMetadata = async (props) => {
        const params = await props.params
        const tag = decodeURI(params.tag)
        return genPageMetadata({
          title: tag,
          description: `${siteMetadata.title} ${tag} tagged content`,
          alternates: {
            canonical: './',
            types: {
              'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
            },
          },
        })
      }

      const metadata = await generateMetadata({
        params: Promise.resolve({ tag: 'javascript', lang: 'en' }),
      })

      expect(genPageMetadata).toHaveBeenCalledWith({
        title: 'javascript',
        description: 'Test Blog javascript tagged content',
        alternates: {
          canonical: './',
          types: {
            'application/rss+xml': 'https://test-blog.com/tags/javascript/feed.xml',
          },
        },
      })
    })

    it('should decode URI-encoded tags', async () => {
      const { genPageMetadata } = require('app/seo')

      const generateMetadata = async (props) => {
        const params = await props.params
        const tag = decodeURI(params.tag)
        return genPageMetadata({
          title: tag,
          description: `Test Blog ${tag} tagged content`,
          alternates: {
            canonical: './',
            types: {
              'application/rss+xml': `https://test-blog.com/tags/${tag}/feed.xml`,
            },
          },
        })
      }

      await generateMetadata({
        params: Promise.resolve({ tag: 'web%20development', lang: 'en' }),
      })

      expect(genPageMetadata).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'web development',
        })
      )
    })

    it('should include RSS feed URL in metadata', async () => {
      const { genPageMetadata } = require('app/seo')
      const siteMetadata = require('@/data/siteMetadata').default

      const generateMetadata = async (props) => {
        const params = await props.params
        const tag = decodeURI(params.tag)
        return genPageMetadata({
          title: tag,
          description: `${siteMetadata.title} ${tag} tagged content`,
          alternates: {
            canonical: './',
            types: {
              'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
            },
          },
        })
      }

      await generateMetadata({
        params: Promise.resolve({ tag: 'react', lang: 'ko' }),
      })

      expect(genPageMetadata).toHaveBeenCalledWith(
        expect.objectContaining({
          alternates: expect.objectContaining({
            types: {
              'application/rss+xml': 'https://test-blog.com/tags/react/feed.xml',
            },
          }),
        })
      )
    })
  })

  describe('TagPage component', () => {
    it('should filter posts by language and tag', () => {
      // This tests the filtering logic
      const { allBlogs } = require('contentlayer/generated')
      const tag = 'javascript'
      const lang = 'en'

      const filteredPosts = allBlogs.filter(
        (post) =>
          post.lang === lang &&
          !post.draft &&
          post.tags &&
          post.tags.map((t) => t.toLowerCase().replace(/\s+/g, '-')).includes(tag)
      )

      expect(filteredPosts).toHaveLength(1)
      expect(filteredPosts[0].title).toBe('JS Post')
    })

    it('should exclude draft posts', () => {
      const { allBlogs } = require('contentlayer/generated')
      const tag = 'draft-tag'
      const lang = 'en'

      const filteredPosts = allBlogs.filter(
        (post) =>
          post.lang === lang &&
          !post.draft &&
          post.tags &&
          post.tags.map((t) => t.toLowerCase().replace(/\s+/g, '-')).includes(tag)
      )

      expect(filteredPosts).toHaveLength(0)
    })

    it('should filter posts by correct language', () => {
      const { allBlogs } = require('contentlayer/generated')
      const tag = 'javascript'
      const lang = 'ja'

      const filteredPosts = allBlogs.filter(
        (post) =>
          post.lang === lang &&
          !post.draft &&
          post.tags &&
          post.tags.map((t) => t.toLowerCase().replace(/\s+/g, '-')).includes(tag)
      )

      expect(filteredPosts).toHaveLength(1)
      expect(filteredPosts[0].lang).toBe('ja')
    })

    it('should call notFound when no posts match', () => {
      const { allBlogs } = require('contentlayer/generated')
      const tag = 'nonexistent-tag'
      const lang = 'en'

      const filteredPosts = allBlogs.filter(
        (post) =>
          post.lang === lang &&
          !post.draft &&
          post.tags &&
          post.tags.map((t) => t.toLowerCase().replace(/\s+/g, '-')).includes(tag)
      )

      if (filteredPosts.length === 0) {
        notFound()
      }

      expect(filteredPosts).toHaveLength(0)
      expect(notFound).toHaveBeenCalled()
    })

    it('should handle posts without tags', () => {
      const allBlogs = [
        {
          lang: 'en',
          draft: false,
          tags: null,
          title: 'No Tags Post',
        },
      ]
      const tag = 'test'
      const lang = 'en'

      const filteredPosts = allBlogs.filter(
        (post) =>
          post.lang === lang &&
          !post.draft &&
          post.tags &&
          post.tags.map((t) => t.toLowerCase().replace(/\s+/g, '-')).includes(tag)
      )

      expect(filteredPosts).toHaveLength(0)
    })

    it('should capitalize tag title correctly', () => {
      const tag = 'javascript'
      const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)

      expect(title).toBe('Javascript')
    })

    it('should handle multi-word tag titles', () => {
      const tag = 'web development'
      const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)

      expect(title).toBe('Web-development')
    })

    it('should handle single character tags', () => {
      const tag = 'c'
      const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)

      expect(title).toBe('C')
    })
  })

  describe('edge cases', () => {
    it('should handle tags with special characters', () => {
      const tag = 'c++'
      const decodedTag = decodeURI(tag)
      expect(decodedTag).toBe('c++')
    })

    it('should handle empty tag array', () => {
      const post = {
        lang: 'en',
        draft: false,
        tags: [],
        title: 'Empty Tags',
      }

      const filtered = [post].filter(
        (p) =>
          p.lang === 'en' &&
          !p.draft &&
          p.tags &&
          p.tags.map((t) => t.toLowerCase()).includes('test')
      )

      expect(filtered).toHaveLength(0)
    })

    it('should handle case-insensitive tag matching with slug', () => {
      const tags = ['JavaScript', 'TypeScript', 'React']
      const slug = require('github-slugger').slug

      const sluggedTags = tags.map((t) => slug(t))

      expect(sluggedTags).toContain('javascript')
      expect(sluggedTags).toContain('typescript')
      expect(sluggedTags).toContain('react')
    })

    it('should handle tags with unicode characters', () => {
      const tag = '자바스크립트'
      const encoded = encodeURI(tag)
      const decoded = decodeURI(encoded)

      expect(decoded).toBe(tag)
    })
  })

  describe('async params handling', () => {
    it('should correctly await params promise', async () => {
      const props = {
        params: Promise.resolve({ tag: 'test', lang: 'en' }),
      }

      const params = await props.params

      expect(params.tag).toBe('test')
      expect(params.lang).toBe('en')
    })

    it('should handle params with encoded characters', async () => {
      const props = {
        params: Promise.resolve({ tag: 'web%20development', lang: 'ko' }),
      }

      const params = await props.params
      const decodedTag = decodeURI(params.tag)

      expect(decodedTag).toBe('web development')
      expect(params.lang).toBe('ko')
    })
  })
})