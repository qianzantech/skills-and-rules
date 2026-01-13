---
description: TypeScript coding standards and best practices for modern development. Apply when writing TypeScript code in any project.
globs: "**/*.ts, **/*.tsx, **/*.d.ts"
---

# TypeScript Best Practices

## Type System

- Prefer `interface` over `type` for object definitions
- Use `type` for unions, intersections, and mapped types
- **Avoid `any`** - prefer `unknown` for unknown types
- Enable strict mode in `tsconfig.json`
- Leverage built-in utility types (`Partial`, `Required`, `Pick`, `Omit`, `Record`)

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Interface/Type | PascalCase | `UserProfile`, `ApiResponse` |
| Variable/Function | camelCase | `getUserData`, `isLoading` |
| Constant | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| Enum values | PascalCase | `UserRole.Admin` |

## Functions

```typescript
// Explicit return type for public functions
export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Arrow function with proper typing
const formatDate = (date: Date, locale: string = 'en-US'): string => {
  return new Intl.DateTimeFormat(locale).format(date);
};
```

## Best Practices

- Use `readonly` for immutable properties
- Leverage discriminated unions for type safety
- Use type guards for runtime type checking
- Implement proper null checking with `?.` and `??`
- Avoid type assertions (`as`) unless necessary

## Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true
  }
}
```
