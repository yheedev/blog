# Testing Guide

## Quick Start

```bash
npm install           # Install dependencies
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## Test Structure

- `lib/__tests__/` - Utility function tests
- `components/__tests__/` - Component tests
- `layouts/__tests__/` - Layout tests
- `app/__tests__/` - Page and integration tests

## Modified Files Coverage

✅ `app/[lang]/tags/[tag]/page.tsx` (NEW)
✅ `components/Tag.tsx` (MODIFIED)
✅ `contentlayer.config.ts` (MODIFIED)
✅ `layouts/PostLayout.tsx` (MODIFIED)

## Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |

## Writing Tests

```typescript
import { render, screen } from '@testing-library/react'

it('should render component', () => {
  render(<Component />)
  expect(screen.getByText('text')).toBeInTheDocument()
})
```

## Coverage Goals

- Statements: >80%
- Branches: >75%
- Functions: >80%
- Lines: >80%

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Next.js Testing](https://nextjs.org/docs/testing)

See TEST_SUITE_SUMMARY.md for detailed documentation.