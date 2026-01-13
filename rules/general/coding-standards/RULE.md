---
description: General coding standards and guidelines. Apply to all code reviews and development tasks.
globs: "**/*"
---

# Coding Standards

## Core Principles

- **Verify information** before presenting it
- **Preserve existing code** - don't remove unrelated code
- **Use explicit variable names** - prefer descriptive over short
- **Follow existing coding style** - maintain consistency
- **Consider security** - always think about security implications
- **Handle edge cases** - consider and handle potential edge cases

## AI Agent Behavior Rules

### Do's
- Make changes file by file
- Provide all edits in a single chunk per file
- Use explicit, descriptive variable names
- Follow consistent coding style
- Include appropriate unit tests
- Implement robust error handling

### Don'ts
- No apologies in code or comments
- No whitespace-only changes unless requested
- No unnecessary confirmations of provided information
- No inventions beyond what's explicitly requested
- No summaries unless asked
- No implementation discussions unless requested

## Performance

```typescript
// Use early returns
function processItem(item: Item | null): Result {
  if (!item) return null
  if (!item.isValid) return null
  return process(item)
}

// Use appropriate data structures
const userMap = new Map<string, User>()  // O(1) lookup
const uniqueIds = new Set<string>()       // O(1) membership
```

## Documentation

- Don't comment **what** - make code self-documenting
- Comment **why** something is done a certain way
- Document APIs and non-obvious side effects

## Version Control

- Write clear, descriptive commit messages
- Make small, focused commits
- Use meaningful branch names

## Checklist

- [ ] No magic numbers or strings
- [ ] Meaningful variable and function names
- [ ] Functions have single responsibility
- [ ] No code duplication
- [ ] Proper error handling
- [ ] Edge cases considered
- [ ] Tests included for new functionality
