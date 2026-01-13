---
name: abp-domain-service
description: Creates ABP Framework domain services and managers following QQG conventions. Use this skill when implementing business logic that spans multiple entities or requires complex domain operations.
---

# ABP Domain Service Creation

Create domain services (managers) for complex business logic following ABP Framework patterns.

## When to Use Domain Services

Use a domain service when:
- Business logic spans **multiple aggregate roots**
- Logic requires **external service calls** (other microservices, APIs)
- **Complex calculations** that don't belong to a single entity
- Operations that need **repository access** beyond a single aggregate

## Do NOT Use Domain Services When

- Logic belongs to a single entity → Put it in the entity itself
- Simple CRUD operations → Use application services directly
- Cross-cutting concerns → Use interceptors or middleware

## Required Steps

1. **Create implementation** in Domain project: `{Name}Manager.cs`
2. **Inherit from `DomainService`** base class
3. **Inject dependencies** (repositories, other domain services)
4. *(Optional)* Create interface only if needed for testing/mocking

> **Note**: ABP recommends NOT creating interfaces for domain services unless needed for testing.

## File Location

```
services/{ServiceName}/src/QQG.{ServiceName}.Domain/{Feature}/
├── I{Name}Manager.cs
└── {Name}Manager.cs
```

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Interface | `I{Name}Manager` | `IProcessingEventManager` |
| Implementation | `{Name}Manager` | `ProcessingEventManager` |

## Template Files

- `domain-service-interface-template.cs` - Interface definition
- `domain-service-template.cs` - Implementation

## Guidelines

1. **Keep domain services focused** - One responsibility per service
2. **Do NOT define GET methods** - Use repository directly in AppService for reads
3. **Define methods that mutate data** - Change entity state only
4. **Use self-explanatory names** - Like `AssignToAsync`, not `UpdateAsync`
5. **Accept valid domain objects** - Pass entities, not DTOs
6. **Use Check class** for validation - `Check.NotNull()`, `Check.NotNullOrWhiteSpace()`
7. **Throw BusinessException** - With domain error codes for localization
8. **Make methods virtual** for extensibility
9. **Do NOT return DTOs** - Return domain objects only

## Validation Checklist

- [ ] Interface defined with clear method signatures
- [ ] Implementation inherits from `DomainService`
- [ ] Implements `ITransientDependency`
- [ ] All methods are `virtual`
- [ ] Proper exception handling
- [ ] Logging added for key operations
