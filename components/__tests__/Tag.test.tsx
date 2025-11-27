/**
 * Unit tests for Tag component
 * Tests the tag link generation with proper language routing
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import Tag from '../Tag'

describe('Tag Component', () => {
  describe('rendering', () => {
    it('should render a tag with correct text', () => {
      render(<Tag text="javascript" lang="en" />)
      
      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()
      expect(link).toHaveTextContent('javascript')
    })

    it('should apply correct CSS classes', () => {
      render(<Tag text="react" lang="en" />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveClass('text-primary-500')
      expect(link).toHaveClass('hover:text-primary-600')
      expect(link).toHaveClass('dark:hover:text-primary-400')
      expect(link).toHaveClass('mr-3')
      expect(link).toHaveClass('text-sm')
      expect(link).toHaveClass('font-medium')
      expect(link).toHaveClass('uppercase')
    })
  })

  describe('link href generation', () => {
    it('should generate correct href with language prefix', () => {
      render(<Tag text="typescript" lang="en" />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/en/tags/typescript')
    })

    it('should generate href for Korean language', () => {
      render(<Tag text="react" lang="ko" />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/ko/tags/react')
    })

    it('should generate href for Japanese language', () => {
      render(<Tag text="nextjs" lang="ja" />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/ja/tags/nextjs')
    })
  })

  describe('text transformation', () => {
    it('should convert spaces to dashes in display text', () => {
      render(<Tag text="machine learning" lang="en" />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveTextContent('machine-learning')
    })

    it('should handle single word tags without transformation', () => {
      render(<Tag text="javascript" lang="en" />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveTextContent('javascript')
    })
  })

  describe('edge cases', () => {
    it('should handle unicode characters in tags', () => {
      render(<Tag text="데이터베이스" lang="ko" />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveTextContent('데이터베이스')
    })

    it('should handle emoji in tags', () => {
      render(<Tag text="react 🚀" lang="en" />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveTextContent('react-🚀')
    })
  })
})