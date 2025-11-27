/**
 * Unit tests for PostLayout component
 * Tests the display of creation and modification dates from git history
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import PostLayout from '../PostLayout'

// Mock dependencies
jest.mock('@/components/Comments', () => {
  return function Comments() {
    return <div data-testid="comments">Comments</div>
  }
})

jest.mock('@/components/Link', () => {
  return function Link({ children, href }) {
    return <a href={href}>{children}</a>
  }
})

jest.mock('@/components/PageTitle', () => {
  return function PageTitle({ children }) {
    return <h1>{children}</h1>
  }
})

jest.mock('@/components/SectionContainer', () => {
  return function SectionContainer({ children }) {
    return <div>{children}</div>
  }
})

jest.mock('@/components/Tag', () => {
  return function Tag({ text, lang }) {
    return <span data-testid="tag" data-lang={lang}>{text}</span>
  }
})

jest.mock('@/components/ScrollTopAndComment', () => {
  return function ScrollTopAndComment() {
    return <div data-testid="scroll-top">Scroll</div>
  }
})

jest.mock('@/components/TOCSidebar', () => {
  return function TOCSidebar() {
    return <div data-testid="toc-sidebar">TOC</div>
  }
})

jest.mock('@/data/siteMetadata', () => ({
  default: {
    siteRepo: 'https://github.com/test/repo',
    siteUrl: 'https://test-blog.com',
    locale: 'en-US',
    comments: true,
  },
}))

describe('PostLayout', () => {
  const mockContent = {
    filePath: 'data/blog/test-post.mdx',
    path: 'en/blog/test-post',
    slug: 'test-post',
    date: '2023-12-01',
    title: 'Test Post',
    tags: ['javascript', 'testing'],
    toc: [{ value: 'Heading', url: '#heading', depth: 2 }],
    lang: 'en',
    createdAt: '2023-01-15T10:00:00Z',
    modifiedAt: '2023-12-01T15:30:00Z',
  }

  const mockNext = {
    path: 'en/blog/next-post',
    title: 'Next Post',
  }

  const mockPrev = {
    path: 'en/blog/prev-post',
    title: 'Previous Post',
  }

  describe('date display', () => {
    it('should display the main publication date', () => {
      render(
        <PostLayout content={mockContent}>
          <div>Content</div>
        </PostLayout>
      )

      const mainDate = screen.getByText((content, element) => {
        return element?.tagName === 'TIME' && content.includes('December')
      })

      expect(mainDate).toBeInTheDocument()
    })

    it('should display creation date when createdAt is present', () => {
      render(
        <PostLayout content={mockContent}>
          <div>Content</div>
        </PostLayout>
      )

      expect(screen.getByText('최초 작성:')).toBeInTheDocument()
      const createdTime = screen.getByText((content, element) => {
        return element?.tagName === 'TIME' && content.includes('2023')
      })
      expect(createdTime).toBeTruthy()
    })

    it('should display modification date when different from creation date', () => {
      render(
        <PostLayout content={mockContent}>
          <div>Content</div>
        </PostLayout>
      )

      expect(screen.getByText('마지막 수정:')).toBeInTheDocument()
    })

    it('should not display modification date when same as creation date', () => {
      const contentSameDate = {
        ...mockContent,
        createdAt: '2023-01-15T10:00:00Z',
        modifiedAt: '2023-01-15T10:00:00Z',
      }

      render(
        <PostLayout content={contentSameDate}>
          <div>Content</div>
        </PostLayout>
      )

      expect(screen.getByText('최초 작성:')).toBeInTheDocument()
      expect(screen.queryByText('마지막 수정:')).not.toBeInTheDocument()
    })

    it('should not display git dates when createdAt is missing', () => {
      const contentNoGitDates = {
        ...mockContent,
        createdAt: undefined,
        modifiedAt: undefined,
      }

      render(
        <PostLayout content={contentNoGitDates}>
          <div>Content</div>
        </PostLayout>
      )

      expect(screen.queryByText('최초 작성:')).not.toBeInTheDocument()
      expect(screen.queryByText('마지막 수정:')).not.toBeInTheDocument()
    })

    it('should not display git dates when modifiedAt is missing', () => {
      const contentNoModified = {
        ...mockContent,
        createdAt: '2023-01-15T10:00:00Z',
        modifiedAt: undefined,
      }

      render(
        <PostLayout content={contentNoModified}>
          <div>Content</div>
        </PostLayout>
      )

      expect(screen.queryByText('최초 작성:')).not.toBeInTheDocument()
    })

    it('should format creation date in Korean locale', () => {
      render(
        <PostLayout content={mockContent}>
          <div>Content</div>
        </PostLayout>
      )

      // Korean date format: YYYY. M. D.
      const dateElement = screen.getByText((content, element) => {
        return (
          element?.tagName === 'TIME' &&
          element.getAttribute('datetime') === mockContent.createdAt &&
          content.match(/\d{4}\.\s*\d{1,2}\.\s*\d{1,2}\./)
        )
      })

      expect(dateElement).toBeTruthy()
    })

    it('should format modification date in Korean locale', () => {
      render(
        <PostLayout content={mockContent}>
          <div>Content</div>
        </PostLayout>
      )

      const dateElement = screen.getByText((content, element) => {
        return (
          element?.tagName === 'TIME' &&
          element.getAttribute('datetime') === mockContent.modifiedAt &&
          content.match(/\d{4}\.\s*\d{1,2}\.\s*\d{1,2}\./)
        )
      })

      expect(dateElement).toBeTruthy()
    })

    it('should include proper datetime attributes', () => {
      render(
        <PostLayout content={mockContent}>
          <div>Content</div>
        </PostLayout>
      )

      const timeElements = screen.getAllByText((content, element) => {
        return element?.tagName === 'TIME'
      })

      const createdElement = timeElements.find(
        (el) => el.getAttribute('datetime') === mockContent.createdAt
      )
      const modifiedElement = timeElements.find(
        (el) => el.getAttribute('datetime') === mockContent.modifiedAt
      )

      expect(createdElement).toBeTruthy()
      expect(modifiedElement).toBeTruthy()
    })
  })

  describe('layout structure', () => {
    it('should render article content', () => {
      render(
        <PostLayout content={mockContent}>
          <div data-testid="article-content">Article Content</div>
        </PostLayout>
      )

      expect(screen.getByTestId('article-content')).toBeInTheDocument()
    })

    it('should render title', () => {
      render(
        <PostLayout content={mockContent}>
          <div>Content</div>
        </PostLayout>
      )

      expect(screen.getByText('Test Post')).toBeInTheDocument()
    })

    it('should render tags', () => {
      render(
        <PostLayout content={mockContent}>
          <div>Content</div>
        </PostLayout>
      )

      expect(screen.getByText('javascript')).toBeInTheDocument()
      expect(screen.getByText('testing')).toBeInTheDocument()
    })

    it('should render TOC when present', () => {
      render(
        <PostLayout content={mockContent}>
          <div>Content</div>
        </PostLayout>
      )

      expect(screen.getByTestId('toc-sidebar')).toBeInTheDocument()
    })

    it('should not render TOC when not present', () => {
      const contentNoTOC = { ...mockContent, toc: null }

      render(
        <PostLayout content={contentNoTOC}>
          <div>Content</div>
        </PostLayout>
      )

      expect(screen.queryByTestId('toc-sidebar')).not.toBeInTheDocument()
    })

    it('should render comments when enabled', () => {
      render(
        <PostLayout content={mockContent}>
          <div>Content</div>
        </PostLayout>
      )

      expect(screen.getByTestId('comments')).toBeInTheDocument()
    })

    it('should render navigation links', () => {
      render(
        <PostLayout content={mockContent} next={mockNext} prev={mockPrev}>
          <div>Content</div>
        </PostLayout>
      )

      expect(screen.getByText('Previous Article')).toBeInTheDocument()
      expect(screen.getByText('Next Article')).toBeInTheDocument()
    })
  })

  describe('date display styling', () => {
    it('should apply correct CSS classes to date container', () => {
      const { container } = render(
        <PostLayout content={mockContent}>
          <div>Content</div>
        </PostLayout>
      )

      const dateContainer = container.querySelector('.flex.justify-center.gap-4')
      expect(dateContainer).toBeInTheDocument()
    })

    it('should style dates as inline elements', () => {
      render(
        <PostLayout content={mockContent}>
          <div>Content</div>
        </PostLayout>
      )

      const dtElements = screen.getAllByText((content, element) => {
        return element?.tagName === 'DT' && element.className.includes('inline')
      })

      expect(dtElements.length).toBeGreaterThan(0)
    })
  })

  describe('edge cases', () => {
    it('should handle missing tags gracefully', () => {
      const contentNoTags = { ...mockContent, tags: undefined }

      render(
        <PostLayout content={contentNoTags}>
          <div>Content</div>
        </PostLayout>
      )

      expect(screen.queryByText('Tags')).not.toBeInTheDocument()
    })

    it('should handle empty tags array', () => {
      const contentEmptyTags = { ...mockContent, tags: [] }

      render(
        <PostLayout content={contentEmptyTags}>
          <div>Content</div>
        </PostLayout>
      )

      // Should still render Tags heading but no actual tags
      expect(screen.queryByTestId('tag')).not.toBeInTheDocument()
    })

    it('should handle very old creation dates', () => {
      const oldContent = {
        ...mockContent,
        createdAt: '2000-01-01T00:00:00Z',
        modifiedAt: '2023-12-01T15:30:00Z',
      }

      render(
        <PostLayout content={oldContent}>
          <div>Content</div>
        </PostLayout>
      )

      expect(screen.getByText('최초 작성:')).toBeInTheDocument()
      expect(screen.getByText('마지막 수정:')).toBeInTheDocument()
    })

    it('should handle future modification dates gracefully', () => {
      const futureContent = {
        ...mockContent,
        createdAt: '2023-01-01T00:00:00Z',
        modifiedAt: '2099-12-31T23:59:59Z',
      }

      render(
        <PostLayout content={futureContent}>
          <div>Content</div>
        </PostLayout>
      )

      expect(screen.getByText('마지막 수정:')).toBeInTheDocument()
    })

    it('should handle invalid date formats gracefully', () => {
      const invalidDateContent = {
        ...mockContent,
        createdAt: 'invalid-date',
        modifiedAt: 'also-invalid',
      }

      // Should not crash
      expect(() => {
        render(
          <PostLayout content={invalidDateContent}>
            <div>Content</div>
          </PostLayout>
        )
      }).not.toThrow()
    })
  })

  describe('accessibility', () => {
    it('should use semantic time elements', () => {
      render(
        <PostLayout content={mockContent}>
          <div>Content</div>
        </PostLayout>
      )

      const timeElements = screen.getAllByText((content, element) => {
        return element?.tagName === 'TIME'
      })

      expect(timeElements.length).toBeGreaterThan(0)
    })

    it('should include proper datetime attributes for screen readers', () => {
      const { container } = render(
        <PostLayout content={mockContent}>
          <div>Content</div>
        </PostLayout>
      )

      const timeElements = container.querySelectorAll('time[datetime]')
      expect(timeElements.length).toBeGreaterThanOrEqual(2)
    })

    it('should use dl/dt/dd for date metadata', () => {
      const { container } = render(
        <PostLayout content={mockContent}>
          <div>Content</div>
        </PostLayout>
      )

      const dl = container.querySelector('dl')
      const dt = container.querySelector('dt')
      const dd = container.querySelector('dd')

      expect(dl).toBeInTheDocument()
      expect(dt).toBeInTheDocument()
      expect(dd).toBeInTheDocument()
    })
  })

  describe('integration with lang prop', () => {
    it('should pass lang prop to Tag components', () => {
      render(
        <PostLayout content={mockContent}>
          <div>Content</div>
        </PostLayout>
      )

      const tagElements = screen.getAllByTestId('tag')
      tagElements.forEach((tag) => {
        expect(tag).toHaveAttribute('data-lang', 'en')
      })
    })

    it('should work with different language settings', () => {
      const koContent = { ...mockContent, lang: 'ko' }

      render(
        <PostLayout content={koContent}>
          <div>Content</div>
        </PostLayout>
      )

      const tagElements = screen.getAllByTestId('tag')
      tagElements.forEach((tag) => {
        expect(tag).toHaveAttribute('data-lang', 'ko')
      })
    })
  })
})