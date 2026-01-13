---
description: Vitest unit testing best practices. Apply when writing unit tests with Vitest.
globs: "**/*.test.ts, **/*.spec.ts, vitest.config.ts"
---

# Vitest Unit Testing

## Best Practices

1. **Critical Functionality First** - Prioritize testing business logic
2. **Mock Dependencies** - Always mock external dependencies
3. **Test Data Scenarios** - Test valid, invalid inputs, and edge cases
4. **Descriptive Naming** - Use clear test names
5. **Test Organization** - Group related tests in describe blocks
6. **Focused Tests** - Limit to 3-5 focused tests per file

## Test Pattern

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock dependencies before imports
vi.mock('../api/userService', () => ({
  fetchUser: vi.fn()
}))

import { fetchUser } from '../api/userService'
import { getUserDisplayName } from '../utils/userUtils'

describe('getUserDisplayName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return full name when both names exist', () => {
    // Arrange
    const user = { firstName: 'John', lastName: 'Doe' }
    
    // Act
    const result = getUserDisplayName(user)
    
    // Assert
    expect(result).toBe('John Doe')
  })

  it('should throw error for null input', () => {
    expect(() => getUserDisplayName(null)).toThrow('User is required')
  })

  it('should handle undefined properties gracefully', () => {
    const user = {}
    const result = getUserDisplayName(user)
    expect(result).toBe('Unknown User')
  })
})
```

## Async Testing

```typescript
it('should fetch user data successfully', async () => {
  const mockUser = { id: '1', name: 'John' }
  ;(fetchUser as any).mockResolvedValue(mockUser)
  
  const result = await getUserData('1')
  
  expect(fetchUser).toHaveBeenCalledWith('1')
  expect(result).toEqual(mockUser)
})

it('should handle API errors gracefully', async () => {
  ;(fetchUser as any).mockRejectedValue(new Error('Network error'))
  
  await expect(getUserData('1')).rejects.toThrow('Failed to fetch user')
})
```

## Checklist

- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] Each test has a single assertion focus
- [ ] Dependencies are properly mocked
- [ ] Test names clearly describe behavior
- [ ] Edge cases and error scenarios covered
