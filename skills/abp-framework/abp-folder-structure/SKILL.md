---
name: abp-folder-structure
description: Defines ABP Framework module folder structure and naming conventions. Use this skill as a reference when organizing code in ABP application modules.
---

# ABP Module Folder Structure Guidelines

This document defines the recommended folder structure for ABP application modules.

## Domain.Shared Layer Structure

Enums, constants, and error codes go in Domain.Shared (not Domain) for cross-layer sharing.

```
{CompanyName}.{ServiceName}.Domain.Shared/
├── {Feature1}/                        # Feature-based folders for enums
│   └── {Entity}Status.cs              # Enums related to feature
├── {Feature2}/
│   └── {Entity}Type.cs
├── {ServiceName}Consts.cs             # Module-level constants
├── {ServiceName}ErrorCodes.cs         # Error codes for exceptions
├── Localization/                      # Localization resources
│   └── {ServiceName}/
└── {ServiceName}DomainSharedModule.cs
```

## Domain Layer Structure

```
{CompanyName}.{ServiceName}.Domain/
├── {Feature1}/                        # Feature-based folders
│   ├── {Entity}.cs                    # Aggregate root
│   ├── {ChildEntity}.cs               # Child entities
│   ├── {ValueObject}.cs               # Value objects
│   ├── I{Entity}Repository.cs         # Repository interface
│   └── {Entity}Manager.cs             # Domain service (Manager suffix)
├── {Feature2}/
│   └── ...
└── {ServiceName}DomainModule.cs
```

## Application Layer Structure

```
{CompanyName}.{ServiceName}.Application/
├── BackgroundJobs/                    # Root-level for all background jobs
│   ├── {Name}Job.cs
│   └── {Name}Args.cs
├── BackgroundWorkers/                 # Root-level for all background workers
│   └── {Name}Worker.cs
├── {Feature1}/                        # Feature-based folders
│   ├── {Feature1}AppService.cs        # Application service
│   ├── I{Feature1}CacheService.cs     # Cache service interface
│   ├── {Feature1}CacheService.cs      # Cache service implementation
│   ├── {Feature1}EventHandler.cs      # Local/distributed event handlers
│   └── Dtos/                          # DTOs for this feature
│       ├── {Entity}Dto.cs
│       ├── {Entity}DetailDto.cs
│       ├── Create{Entity}Dto.cs
│       ├── Update{Entity}Dto.cs
│       └── Get{Entity}ListInput.cs
├── {Feature2}/
│   └── ...
├── Integrations/                      # Cross-service integration
│   └── {Service}IntegrationAppService.cs
├── Services/                          # Cross-cutting shared services
│   ├── I{Name}Service.cs
│   └── {Name}Service.cs
├── {ServiceName}ApplicationModule.cs
└── {ServiceName}ApplicationAutoMapperProfile.cs
```

## Application Contracts Layer Structure

```
{CompanyName}.{ServiceName}.Application.Contracts/
├── {Feature1}/
│   ├── I{Feature1}AppService.cs       # AppService interface
│   ├── {Entity}Dto.cs                 # Output DTOs
│   ├── Create{Entity}Dto.cs           # Input DTOs
│   ├── Update{Entity}Dto.cs
│   └── {Event}Eto.cs                  # Distributed event ETOs
├── {Feature2}/
│   └── ...
├── Permissions/
│   ├── {ServiceName}Permissions.cs
│   └── {ServiceName}PermissionDefinitionProvider.cs
└── {ServiceName}ApplicationContractsModule.cs
```

## EntityFrameworkCore Layer Structure

```
{CompanyName}.{ServiceName}.EntityFrameworkCore/
├── {Feature1}/
│   └── Ef{Entity}Repository.cs        # Repository implementation
├── {ServiceName}DbContext.cs
├── {ServiceName}DbContextModelBuilderExtensions.cs
├── {ServiceName}EntityFrameworkCoreModule.cs
└── EntityFrameworkCore/
    └── Migrations/
```

## Key Principles

### 1. Feature-Based Organization
- Group related files by feature/aggregate, not by type
- Each feature folder contains all related files (entities, services, DTOs, handlers)

### 2. Cross-Cutting Concerns
- `BackgroundJobs/` - Root level, all jobs together
- `BackgroundWorkers/` - Root level, all workers together
- `Services/` - Shared services used across features
- `Integrations/` - Cross-service communication

### 3. Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Aggregate Root | `{Name}` | `Order`, `Product` |
| Child Entity | `{Name}` | `OrderLine`, `ProductVariant` |
| Repository Interface | `I{Entity}Repository` | `IOrderRepository` |
| Repository Impl | `Ef{Entity}Repository` | `EfOrderRepository` |
| Domain Service | `{Name}Manager` | `OrderManager` |
| AppService Interface | `I{Feature}AppService` | `IOrderAppService` |
| AppService Impl | `{Feature}AppService` | `OrderAppService` |
| Cache Service | `{Entity}CacheService` | `ProductCacheService` |
| Event Handler | `{Entity/Event}Handler` | `OrderCreatedHandler` |
| Background Job | `{Name}Job` | `SendEmailJob` |
| Background Worker | `{Name}Worker` | `CleanupWorker` |
| DTO (Output) | `{Entity}Dto` | `OrderDto` |
| DTO (Create) | `Create{Entity}Dto` | `CreateOrderDto` |
| DTO (Update) | `Update{Entity}Dto` | `UpdateOrderDto` |
| ETO | `{Event}Eto` | `OrderCreatedEto` |
| Enum | `{Entity}{Property}` | `OrderStatus`, `PaymentType` |
| Constants | `{ServiceName}Consts` | `EmployeeServiceConsts` |
| Error Codes | `{ServiceName}ErrorCodes` | `EmployeeServiceErrorCodes` |

### 4. ABP Official Layer Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│                      HttpApi.Host                            │
├─────────────────────────────────────────────────────────────┤
│   HttpApi          │    Application    │   EntityFrameworkCore│
├───────────────────┼───────────────────┼─────────────────────┤
│        Application.Contracts          │        Domain        │
├───────────────────────────────────────┼─────────────────────┤
│                    Domain.Shared                             │
└─────────────────────────────────────────────────────────────┘
```

## References
- [ABP Module Architecture Best Practices](https://abp.io/docs/latest/framework/architecture/best-practices/module-architecture)
