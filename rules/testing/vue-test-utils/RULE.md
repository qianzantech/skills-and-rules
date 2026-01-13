---
description: Vue Test Utils component testing best practices. Apply when testing Vue components.
globs: "**/*.test.ts, **/*.spec.ts, **/components/**/*.test.ts"
---

# Vue Component Testing

## Setup

```typescript
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { vi } from 'vitest'
import UserCard from './UserCard.vue'

describe('UserCard', () => {
  const createWrapper = (props = {}, options = {}) => {
    return mount(UserCard, {
      props: {
        user: { id: '1', name: 'John Doe' },
        ...props
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        ...options.global
      }
    })
  }
```

## Testing Patterns

### Props and Rendering

```typescript
it('displays user name', () => {
  const wrapper = createWrapper()
  expect(wrapper.text()).toContain('John Doe')
})

it('shows loading state when isLoading is true', () => {
  const wrapper = createWrapper({ isLoading: true })
  expect(wrapper.find('[data-testid="loading"]').exists()).toBe(true)
})
```

### Events

```typescript
it('emits select event when clicked', async () => {
  const wrapper = createWrapper()
  await wrapper.find('[data-testid="user-card"]').trigger('click')
  
  expect(wrapper.emitted('select')).toHaveLength(1)
  expect(wrapper.emitted('select')[0]).toEqual([{ id: '1', name: 'John Doe' }])
})
```

### Store Interaction

```typescript
it('calls store action on submit', async () => {
  const wrapper = createWrapper()
  const store = useUserStore()
  
  await wrapper.find('form').trigger('submit')
  
  expect(store.updateUser).toHaveBeenCalled()
})
```

### Async Operations

```typescript
it('displays data after async load', async () => {
  const wrapper = createWrapper()
  
  // Wait for async operations
  await flushPromises()
  
  expect(wrapper.find('[data-testid="data"]').exists()).toBe(true)
})
```

## Checklist

- [ ] Test component rendering
- [ ] Test props handling
- [ ] Test event emission
- [ ] Test store interactions
- [ ] Test async operations
- [ ] Mock external dependencies
