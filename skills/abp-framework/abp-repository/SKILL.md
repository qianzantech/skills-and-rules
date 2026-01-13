---
name: abp-repository
description: Creates ABP Framework repository interfaces and EF Core implementations following QQG conventions. Use this skill when creating custom repositories for entities.
---

# ABP Repository Creation

Create custom repository interfaces and EF Core implementations for entities.

## When to Use Custom Repositories

- Need custom query methods beyond basic CRUD
- Complex queries with filtering, sorting, pagination
- Performance-critical operations
- Queries involving multiple entities

## Required Steps

1. **Create interface** in Domain: `I{Entity}Repository.cs`
2. **Create implementation** in EntityFrameworkCore: `Ef{Entity}Repository.cs`
3. **Add DbSet** in DbContext if not already present
4. **Configure entity** in DbContext's `OnModelCreating`

## File Locations

```bash
Domain/{Feature}/
├── I{Entity}Repository.cs             # Interface (in Domain layer)

EntityFrameworkCore/{Feature}/
├── Ef{Entity}Repository.cs            # Implementation (in EF layer)
```

> See `abp-folder-structure` skill for complete module structure

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Interface | `I{Entity}Repository` | `IProcessingEventRepository` |
| Implementation | `Ef{Entity}Repository` | `EfProcessingEventRepository` |

## Template Files

- `repository-interface-template.cs` - Interface definition
- `repository-template.cs` - EF Core implementation

## Common Query Methods

```csharp
// Get by unique field (includeDetails=true for single entity)
Task<{Entity}?> FindByNameAsync(
    string name,
    bool includeDetails = true,
    CancellationToken cancellationToken = default);

// Get list with filters (includeDetails=false for lists)
Task<List<{Entity}>> GetListAsync(
    int skipCount,
    int maxResultCount,
    string? sorting = null,
    string? filter = null,
    bool includeDetails = false,
    CancellationToken cancellationToken = default);

// Get count
Task<long> GetCountAsync(
    string? filter = null,
    CancellationToken cancellationToken = default);

// Get with includes
Task<{Entity}> GetWithDetailsAsync(
    Guid id,
    CancellationToken cancellationToken = default);
```

## ABP Best Practices

- **Inherit from `IBasicRepository`** - NOT `IRepository` (avoids exposing IQueryable)
- **Add `includeDetails` param** - Default `true` for single, `false` for lists
- **Add `CancellationToken`** - Always optional on all methods
- **Do NOT use IQueryable** - Keep queries inside repository

## Guidelines

1. **Interface in Domain** - Implementation in EntityFrameworkCore
2. **Use async methods** - All repository methods should be async
3. **Support cancellation** - Add CancellationToken parameters
4. **Return nullable** for Find methods - Return non-nullable for Get methods (throws if not found)
5. **Inherit from IBasicRepository** - NOT IRepository (avoid IQueryable exposure)

## Validation Checklist

- [ ] Interface inherits from `IBasicRepository<{Entity}, Guid>`
- [ ] Implementation inherits from `EfCoreRepository<{DbContext}, {Entity}, Guid>`
- [ ] All methods are async with CancellationToken
- [ ] DbSet added to DbContext
- [ ] Entity configured in OnModelCreating
