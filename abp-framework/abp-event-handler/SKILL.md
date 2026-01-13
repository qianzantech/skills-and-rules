---
name: abp-event-handler
description: Creates ABP Framework event handlers for local and distributed events following QQG conventions. Use this skill when implementing event-driven patterns, cache invalidation, or cross-service communication.
---

# ABP Event Handler Creation

Create local and distributed event handlers for event-driven architecture.

## Event Type Decision

| Type | Use Case | Scope |
|------|----------|-------|
| **Local Event** | Cache invalidation, in-process reactions | Same process only |
| **Distributed Event** | Cross-service communication | Across microservices |

## Local Events

For in-process event handling (same microservice).

### Common Use Cases
- Cache invalidation on entity changes
- Audit logging
- Triggering background jobs
- Updating denormalized data

### File Location
```
Application/{Feature}/
├── {Entity}CreatedUpdatedLocalEventHandler.cs
├── {Entity}CacheInvalidationHandler.cs    # Cache-specific handlers
```

> Event handlers stay in feature folders with related AppServices

### Template Files
- `local-event-handler-template.cs` - Local event handler

## Distributed Events

For cross-microservice communication via message broker.

### Common Use Cases
- Notifying other services of changes
- Saga/choreography patterns
- Integration events

### Components
1. **ETO (Event Transfer Object)** - Data contract in Contracts project
2. **Handler** - Consumes events from other services

### File Locations
```
Application.Contracts/{Feature}/
└── {Event}Eto.cs

Application/{Feature}/
└── {Event}Handler.cs
```

### Template Files
- `distributed-event-handler-template.cs` - Distributed handler + ETO

## Guidelines

1. **Use local events for in-process** - Lower overhead than distributed
2. **ETOs in Contracts** - Shared between publisher and consumer
3. **Make handlers idempotent** - Events may be delivered multiple times
4. **Include correlation IDs** - For tracing across services
5. **Keep handlers lightweight** - Queue background jobs for heavy work

## Validation Checklist

### Local Event Handler
- [ ] Implements `ILocalEventHandler<T>`
- [ ] Implements `ITransientDependency`
- [ ] Handles `EntityCreatedEventData<T>` or `EntityUpdatedEventData<T>`

### Distributed Event Handler
- [ ] ETO class has `[EventName("...")]` attribute
- [ ] ETO is in Application.Contracts project
- [ ] Handler implements `IDistributedEventHandler<T>`
- [ ] Handler implements `ITransientDependency`
