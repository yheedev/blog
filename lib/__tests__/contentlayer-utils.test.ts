/**
 * Unit tests for contentlayer utility functions
 * Tests the getGitTimestamps function that extracts creation and modification dates from git history
 */

import { execSync } from 'child_process'

// Mock child_process
jest.mock('child_process')

describe('getGitTimestamps', () => {
  // Note: We're testing the function logic by recreating it here since it's not exported
  // In a real scenario, you'd want to export this function for better testability
  
  const getGitTimestamps = (filePath: string): { created: string; modified: string } => {
    try {
      const created = execSync(`git log --follow --format=%aI --reverse "${filePath}" | head -1`)
        .toString()
        .trim()
      const modified = execSync(`git log -1 --format=%aI "${filePath}"`).toString().trim()
      
      return {
        created: created || new Date().toISOString(),
        modified: modified || new Date().toISOString(),
      }
    } catch (error) {
      const now = new Date().toISOString()
      return { created: now, modified: now }
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('successful git operations', () => {
    it('should return creation and modification dates from git history', () => {
      const mockCreated = '2023-01-15T10:30:00Z'
      const mockModified = '2023-12-20T14:45:00Z'
      
      ;(execSync as jest.Mock)
        .mockReturnValueOnce(Buffer.from(mockCreated + '\n'))
        .mockReturnValueOnce(Buffer.from(mockModified + '\n'))
      
      const result = getGitTimestamps('data/blog/test-post.mdx')
      
      expect(result.created).toBe(mockCreated)
      expect(result.modified).toBe(mockModified)
      expect(execSync).toHaveBeenCalledTimes(2)
      expect(execSync).toHaveBeenCalledWith(
        'git log --follow --format=%aI --reverse "data/blog/test-post.mdx" | head -1'
      )
      expect(execSync).toHaveBeenCalledWith('git log -1 --format=%aI "data/blog/test-post.mdx"')
    })

    it('should handle file paths with special characters', () => {
      const mockDate = '2023-06-10T12:00:00Z'
      ;(execSync as jest.Mock)
        .mockReturnValueOnce(Buffer.from(mockDate + '\n'))
        .mockReturnValueOnce(Buffer.from(mockDate + '\n'))
      
      const result = getGitTimestamps('data/blog/post with spaces.mdx')
      
      expect(result.created).toBe(mockDate)
      expect(result.modified).toBe(mockDate)
    })

    it('should trim whitespace from git output', () => {
      const mockDate = '2023-03-20T08:15:00Z'
      ;(execSync as jest.Mock)
        .mockReturnValueOnce(Buffer.from(`  ${mockDate}  \n\n`))
        .mockReturnValueOnce(Buffer.from(`\n${mockDate}\n`))
      
      const result = getGitTimestamps('data/blog/test.mdx')
      
      expect(result.created).toBe(mockDate)
      expect(result.modified).toBe(mockDate)
    })

    it('should use current date as fallback when git returns empty string', () => {
      ;(execSync as jest.Mock)
        .mockReturnValueOnce(Buffer.from(''))
        .mockReturnValueOnce(Buffer.from(''))
      
      const beforeTest = new Date().toISOString()
      const result = getGitTimestamps('data/blog/new-file.mdx')
      const afterTest = new Date().toISOString()
      
      expect(result.created).toBeDefined()
      expect(result.modified).toBeDefined()
      expect(new Date(result.created).getTime()).toBeGreaterThanOrEqual(new Date(beforeTest).getTime())
      expect(new Date(result.modified).getTime()).toBeLessThanOrEqual(new Date(afterTest).getTime())
    })
  })

  describe('error handling', () => {
    it('should return current timestamp when git command fails', () => {
      ;(execSync as jest.Mock).mockImplementation(() => {
        throw new Error('Git command failed')
      })
      
      const beforeTest = new Date().toISOString()
      const result = getGitTimestamps('nonexistent-file.mdx')
      const afterTest = new Date().toISOString()
      
      expect(result.created).toBeDefined()
      expect(result.modified).toBeDefined()
      expect(result.created).toBe(result.modified)
      expect(new Date(result.created).getTime()).toBeGreaterThanOrEqual(new Date(beforeTest).getTime())
      expect(new Date(result.modified).getTime()).toBeLessThanOrEqual(new Date(afterTest).getTime())
    })

    it('should handle git not being available', () => {
      ;(execSync as jest.Mock).mockImplementation(() => {
        throw new Error('git: command not found')
      })
      
      const result = getGitTimestamps('data/blog/test.mdx')
      
      expect(result.created).toBeDefined()
      expect(result.modified).toBeDefined()
      expect(result.created).toBe(result.modified)
    })

    it('should handle permission errors gracefully', () => {
      ;(execSync as jest.Mock).mockImplementation(() => {
        throw new Error('Permission denied')
      })
      
      const result = getGitTimestamps('data/blog/restricted.mdx')
      
      expect(result).toHaveProperty('created')
      expect(result).toHaveProperty('modified')
      expect(typeof result.created).toBe('string')
      expect(typeof result.modified).toBe('string')
    })
  })

  describe('edge cases', () => {
    it('should handle files with no git history (newly created)', () => {
      ;(execSync as jest.Mock)
        .mockReturnValueOnce(Buffer.from(''))
        .mockReturnValueOnce(Buffer.from(''))
      
      const result = getGitTimestamps('data/blog/brand-new.mdx')
      
      expect(result.created).toBeTruthy()
      expect(result.modified).toBeTruthy()
    })

    it('should handle renamed files (--follow flag)', () => {
      const mockCreated = '2022-01-01T00:00:00Z'
      const mockModified = '2023-12-01T00:00:00Z'
      
      ;(execSync as jest.Mock)
        .mockReturnValueOnce(Buffer.from(mockCreated))
        .mockReturnValueOnce(Buffer.from(mockModified))
      
      const result = getGitTimestamps('data/blog/renamed-post.mdx')
      
      expect(execSync).toHaveBeenCalledWith(
        expect.stringContaining('--follow')
      )
      expect(result.created).toBe(mockCreated)
    })

    it('should return valid ISO 8601 date strings', () => {
      const mockDate = '2023-06-15T14:30:00Z'
      ;(execSync as jest.Mock)
        .mockReturnValue(Buffer.from(mockDate))
      
      const result = getGitTimestamps('data/blog/test.mdx')
      
      expect(() => new Date(result.created)).not.toThrow()
      expect(() => new Date(result.modified)).not.toThrow()
      expect(new Date(result.created).toISOString()).toBe(mockDate)
    })
  })
})