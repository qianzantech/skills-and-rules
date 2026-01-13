---
name: abp-application-service
description: Creates ABP Framework application services following QQG conventions. Use this skill when implementing CRUD operations, API endpoints, or coordinating domain operations from the Application layer.
---

# ABP Application Service Creation

Create application services for API endpoints following ABP Framework patterns and QQG conventions.

## When to Use This Skill

- Creating CRUD operations for an aggregate root
- Implementing API endpoints
- Coordinating domain services and repositories
- Mapping between DTOs and entities

## Required Steps

1. **Create interface** in Application.Contracts: `I{Feature}AppService.cs`
2. **Create DTOs** in Application.Contracts: `{Entity}Dto.cs`, `Create{Entity}Dto.cs`, etc.
3. **Create implementation** in Application: `{Feature}AppService.cs`
4. **Add AutoMapper mappings** in `{ServiceName}ApplicationAutoMapperProfile.cs`

## File Locations

```
Application.Contracts/{Feature}/
├── I{Feature}AppService.cs            # Interface
├── {Entity}Dto.cs                     # Output DTOs
├── Create{Entity}Dto.cs               # Input DTOs
└── Update{Entity}Dto.cs

Application/{Feature}/
├── {Feature}AppService.cs             # Implementation
├── I{Entity}CacheService.cs           # Optional cache service
├── {Entity}CacheService.cs
└── Dtos/                              # Feature-specific DTOs (if not in Contracts)
```

> See `abp-folder-structure` skill for complete module structure

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Interface | `I{Feature}AppService` | `IProcessingEventAppService` |
| Implementation | `{Feature}AppService` | `ProcessingEventAppService` |
| Basic DTO | `{Entity}Dto` | `ProcessingEventDto` |
| Create DTO | `Create{Entity}Dto` | `CreateProcessingEventDto` |
| Update DTO | `Update{Entity}Dto` | `UpdateProcessingEventDto` |
| List Input | `Get{Entity}ListInput` | `GetProcessingEventListInput` |

## Template Files

- `appservice-interface-template.cs` - Interface in Contracts
- `appservice-template.cs` - Implementation
- `dto-templates.cs` - DTO examples

## Guidelines

1. **One AppService per aggregate root**
2. **Never return entities** - Always use DTOs
3. **Use custom repositories** - Not generic `IRepository<T>`
4. **Make all public methods virtual** - For extensibility
5. **Make private methods protected virtual** - Allow override
6. **Inherit from ApplicationService** base class
7. **Use ObjectMapper** for entity-DTO mapping
8. **Call repository Update** after entity changes - Not all DBs auto-track

## Cross-Service Communication

- **Do NOT** call other AppServices in **same** module - Use domain layer
- **May** call AppServices from **other** modules via contracts only
- **Use** domain services for complex business logic

## Validation Checklist

- [ ] Interface defined in Application.Contracts
- [ ] DTOs created with proper validation attributes
- [ ] Implementation inherits from `ApplicationService`
- [ ] Custom repository injected (not generic)
- [ ] AutoMapper profile updated
- [ ] All public methods are `virtual`
