---
description: Playwright E2E testing best practices. Apply when writing end-to-end tests with Playwright.
globs: "**/*.spec.ts, **/e2e/**/*.ts, playwright.config.ts"
---

# Playwright E2E Testing

## Best Practices

1. **Descriptive Names** - Use test names that explain behavior
2. **Proper Setup** - Include setup in test.beforeEach blocks
3. **Selector Usage** - Use data-testid over CSS/XPath selectors
4. **Waiting Strategy** - Leverage Playwright's auto-waiting
5. **Mock Dependencies** - Mock external dependencies with page.route
6. **Validation Coverage** - Validate both success and error scenarios
7. **Test Focus** - Limit test files to 3-5 focused tests

## Test Pattern

```typescript
import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('/api/login', (route) => {
      const body = route.request().postDataJSON()
      if (body.username === 'valid' && body.password === 'valid') {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ token: 'abc123' })
        })
      } else {
        route.fulfill({
          status: 401,
          body: JSON.stringify({ error: 'Invalid credentials' })
        })
      }
    })
    
    await page.goto('/login')
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.locator('[data-testid="username"]').fill('valid')
    await page.locator('[data-testid="password"]').fill('valid')
    await page.locator('[data-testid="submit"]').click()
    
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('[data-testid="welcome"]')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.locator('[data-testid="username"]').fill('invalid')
    await page.locator('[data-testid="password"]').fill('wrong')
    await page.locator('[data-testid="submit"]').click()
    
    await expect(page.locator('[data-testid="error"]')).toHaveText('Invalid credentials')
  })
})
```

## Selectors

```typescript
// Preferred: data-testid
page.locator('[data-testid="submit-button"]')

// Semantic selectors
page.getByRole('button', { name: 'Submit' })
page.getByLabel('Email')
page.getByText('Welcome')

// Avoid: CSS selectors
page.locator('.btn-primary')  // fragile
```

## Checklist

- [ ] Use data-testid selectors
- [ ] Mock API responses for isolation
- [ ] Test both success and error paths
- [ ] Use proper waiting (auto-wait preferred)
- [ ] Keep tests independent
