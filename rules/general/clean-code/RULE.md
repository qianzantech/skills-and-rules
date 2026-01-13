---
description: Clean code principles for writing maintainable and human-readable code. Apply during code writing and review.
globs: "**/*"
---

# Clean Code Guidelines

## Constants Over Magic Numbers

```typescript
// Bad
if (retryCount > 3) { }
const timeout = 86400000

// Good
const MAX_RETRY_COUNT = 3
const ONE_DAY_MS = 24 * 60 * 60 * 1000

if (retryCount > MAX_RETRY_COUNT) { }
const timeout = ONE_DAY_MS
```

## Meaningful Names

```typescript
// Bad
const d = new Date()
const u = users.filter(x => x.a)

// Good
const createdDate = new Date()
const activeUsers = users.filter(user => user.isActive)
```

## Single Responsibility

- Each function should do exactly one thing
- Functions should be small and focused
- If a function needs a comment to explain what it does, split it

## DRY (Don't Repeat Yourself)

- Extract repeated code into reusable functions
- Share common logic through proper abstraction
- Maintain single sources of truth

## Smart Comments

- Don't comment what code does - make code self-documenting
- Comment **why** something is done a certain way
- Document APIs and non-obvious side effects

## Encapsulation

- Hide implementation details
- Expose clear interfaces
- Move nested conditionals into well-named functions

## Checklist

- [ ] No magic numbers - use named constants
- [ ] All names are meaningful and descriptive
- [ ] Comments explain "why" not "what"
- [ ] Each function has single responsibility
- [ ] No repeated code - DRY principle followed
