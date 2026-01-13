---
name: abp-entity
description: Creates ABP Framework entities and aggregate roots following QQG conventions. Use this skill when creating new domain entities, aggregate roots, or value objects in the Domain layer.
---

# ABP Entity Creation

Create entities and aggregate roots following ABP Framework best practices and QQG-specific conventions.

## When to Use This Skill

- Creating a new aggregate root for a microservice
- Creating child entities within an aggregate
- Creating value objects
- Adding new properties to existing entities

## Entity Type Decision Tree

```
Is this the main entry point for a business concept?
├─ Yes → Create as Aggregate Root (inherit FullAuditedAggregateRoot<Guid>)
│         └─ Will other aggregates reference this? → Reference by Id only
└─ No → Is this owned by an aggregate?
    ├─ Yes → Create as Entity (inherit FullAuditedEntity<Guid>)
    └─ No → Create as Value Object (no Id, immutable)
```

## File Location

```
Domain/{Feature}/
├── {Entity}.cs                        # Aggregate root
├── {ChildEntity}.cs                   # Child entities
├── {ValueObject}.cs                   # Value objects
├── I{Entity}Repository.cs             # Repository interface
└── {Entity}Manager.cs                 # Domain service (if needed)
```

> See `abp-folder-structure` skill for complete module structure

## Required Steps

1. **Determine entity location**: `services/{ServiceName}/src/{CompanyName}.{ServiceName}.Domain/{Feature}/`
2. **Choose base class** based on requirements
3. **Implement IMultiTenant** for all entities
4. **Create primary constructor** with validation
5. **Create protected parameterless constructor** for ORM
6. **Define properties with protected setters**
7. **Add to DbContext** in EntityFrameworkCore project

## File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Aggregate Root | `{Name}.cs` | `ProcessingEvent.cs` |
| Child Entity | `{Name}.cs` | `ProcessingEventDetail.cs` |
| Value Object | `{Name}.cs` | `GeoLocation.cs` |

## Template Usage

Use the templates in this skill folder:
- `aggregate-root-template.cs` - For new aggregate roots
- `entity-template.cs` - For child entities
- `value-object-template.cs` - For value objects

## QQG-Specific Rules

1. **Always implement `IMultiTenant`** - All entities must support multi-tenancy
2. **Use `Guid` primary keys** - Never use int/long for aggregate root keys
3. **Reference other aggregates by Id** - Never add navigation properties to other aggregates
4. **Keep aggregates small** - Consider performance when loading/saving
5. **Use `protected set`** for properties - Maintain invariants through methods

## Validation

After creating an entity:
- [ ] Inherits from correct base class
- [ ] Implements `IMultiTenant` with `TenantId` property
- [ ] Has primary constructor with validation
- [ ] Has protected parameterless constructor
- [ ] Properties use `protected set` or `private set`
- [ ] Collections initialized in constructor
- [ ] No navigation properties to other aggregates
