---
name: abp-cache-service
description: Creates ABP Framework cache services following QQG conventions. Use this skill when implementing distributed caching for entities or data that needs to be cached for performance.
---

# ABP Cache Service Creation

Create cache services for efficient data access using ABP's distributed caching system.

## When to Use Cache Services

- Frequently accessed data that rarely changes
- Expensive database queries or calculations
- Data shared across requests/users
- Reducing database load

## Required Components

1. **Cache Item Class** - DTO-like class for cached data
2. **Cache Service Interface** - `I{Entity}CacheService`
3. **Cache Service Implementation** - Uses `IDistributedCache<T>`
4. **Event Handler** - Invalidates cache on entity changes

## File Locations

```
Application/
├── {Feature}/
│   ├── I{Entity}CacheService.cs
│   ├── {Entity}CacheService.cs
│   └── {Entity}CacheItem.cs (if separate from DTO)
```

## Template Files

- `cache-service-interface-template.cs` - Interface definition
- `cache-service-template.cs` - Implementation with ABP patterns
- `cache-item-template.cs` - Cache item class

## ABP Cache Features

### Key Features
- **Auto serialization/deserialization** - JSON by default
- **Auto tenant isolation** - TenantId added to cache key
- **Error tolerance** - Errors hidden by default, falls back to source
- **Batch operations** - `GetManyAsync`, `SetManyAsync`
- **Unit of Work integration** - `considerUow` parameter

### Cache Key Best Practices
- Use `[CacheName("MyCache")]` attribute for custom cache names
- Use `[IgnoreMultiTenancy]` if cache shared across tenants
- Configure `KeyPrefix` for multi-app environments

### Important Methods
```csharp
// Get or add with factory
await _cache.GetOrAddAsync(key, factory, options);

// Batch operations
await _cache.GetManyAsync(keys);
await _cache.SetManyAsync(items);

// Remove
await _cache.RemoveAsync(key);
```

## Cache Invalidation Pattern

Always invalidate cache when entity changes:
1. Create local event handler for entity events
2. Call `InvalidateCacheAsync()` on create/update/delete

## ABP Official Guidelines

1. **Use `IDistributedCache<T>`** - NOT standard `IDistributedCache`
2. **Use `GetOrAddAsync`** - Factory pattern for cache miss
3. **Set appropriate expiration** - `AbsoluteExpiration` or `SlidingExpiration`
4. **Consider `considerUow: true`** - For transactional consistency
5. **Handle batch operations** - Use `GetManyAsync`/`SetManyAsync`

---

## Entity Cache (Built-in Auto-Invalidation)

ABP provides a simpler `IEntityCache<T, TKey>` for caching entities with **automatic invalidation** on update/delete.

### Registration
```csharp
// In module ConfigureServices
// Option 1: Cache entity directly
context.Services.AddEntityCache<Product, Guid>();

// Option 2: Cache as DTO (requires AutoMapper config)
context.Services.AddEntityCache<Product, ProductDto, Guid>();

// With custom expiration
context.Services.AddEntityCache<Product, ProductDto, Guid>(
    new DistributedCacheEntryOptions 
    { 
        SlidingExpiration = TimeSpan.FromMinutes(30) 
    }
);
```

### Usage
```csharp
public class ProductAppService : ApplicationService
{
    private readonly IEntityCache<ProductDto, Guid> _productCache;

    public ProductAppService(IEntityCache<ProductDto, Guid> productCache)
    {
        _productCache = productCache;
    }

    public async Task<ProductDto> GetAsync(Guid id)
    {
        // Auto-fetches from DB on first call, then from cache
        // Auto-invalidates when entity is updated/deleted
        return await _productCache.GetAsync(id);
    }
}
```

### Important Notes
- **Read-only** - Use repository for updates, not entity cache
- **Auto-invalidation** - No manual invalidation needed
- **Default 2 min expiration** - Configure via `DistributedCacheEntryOptions`
- Requires entity to be JSON-serializable (or use DTO)

### Limitations & When NOT to Use Entity Cache

| Limitation | Description | Solution |
|------------|-------------|----------|
| **Single entity only** | Only caches by primary key (GetAsync(id)) | Use custom cache for lists |
| **No child entity tracking** | Child entity changes don't invalidate parent | Use custom cache + event handlers |
| **No includeDetails** | Repository fetch may not include children | Custom cache with explicit includes |
| **No collection caching** | Cannot cache `GetListAsync()` results | Use `IDistributedCache<List<T>>` |
| **No composite keys** | Only supports single key lookups | Use custom cache with string keys |
| **No query caching** | Cannot cache filtered/sorted results | Use custom cache service |

### ⚠️ Critical: Child Entities NOT Included by Default

When `IEntityCache` fetches an entity from the repository, it uses the default repository behavior which **may not include child entities** (navigation properties).

```csharp
// IEntityCache internally calls repository like this:
var entity = await _repository.GetAsync(id);  // No includeDetails!

// Child collections will be EMPTY in cache!
// order.OrderLines = [] (empty!)
```

**Solution**: For entities with children, use **Custom Cache Service** with explicit includes:

```csharp
public class OrderCacheService : IOrderCacheService, ITransientDependency
{
    private readonly IOrderRepository _repository;
    private readonly IDistributedCache<OrderDto, Guid> _cache;

    public async Task<OrderDto> GetWithDetailsAsync(Guid id)
    {
        return await _cache.GetOrAddAsync(
            id,
            async () =>
            {
                // Explicitly include children!
                var order = await _repository.GetAsync(id, includeDetails: true);
                // OR use custom repository method
                // var order = await _repository.GetWithLinesAsync(id);
                
                return ObjectMapper.Map<Order, OrderDto>(order);
            }
        );
    }
}
```

### When to Use Entity Cache vs Custom Cache

```
┌─────────────────────────────────────────────────────────────────┐
│                    Which Cache Pattern?                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Need to cache single entity by ID?                             │
│    ├── YES, entity has NO child collections → IEntityCache ✓   │
│    ├── YES, but has child entities → Custom Cache + Events     │
│    └── NO → Custom Cache Service                                │
│                                                                  │
│  Need to cache lists/collections?                               │
│    └── Always use Custom Cache Service                          │
│                                                                  │
│  Need to cache grouped/filtered data?                           │
│    └── Always use Custom Cache Service                          │
│                                                                  │
│  Child entity changes should invalidate cache?                  │
│    └── Custom Cache + Handle child entity events                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Example: Caching Entity with Children (Custom Cache Required)

```csharp
// Order has OrderLines - IEntityCache won't work properly
// Because OrderLine changes won't invalidate Order cache

public class OrderCacheService : IOrderCacheService, ITransientDependency
{
    private readonly IDistributedCache<OrderWithLinesDto, Guid> _cache;
    
    // Must handle BOTH Order and OrderLine events
}

// Event handler for cache invalidation
public class OrderCacheInvalidationHandler :
    ILocalEventHandler<EntityChangedEventData<Order>>,
    ILocalEventHandler<EntityChangedEventData<OrderLine>>,  // Child!
    ITransientDependency
{
    private readonly IOrderCacheService _cacheService;
    
    public async Task HandleEventAsync(EntityChangedEventData<Order> e)
        => await _cacheService.InvalidateCacheAsync(e.Entity.Id);
    
    public async Task HandleEventAsync(EntityChangedEventData<OrderLine> e)
        => await _cacheService.InvalidateCacheAsync(e.Entity.OrderId);  // Parent ID!
}
```

### Example: Caching Groups/Lists (Custom Cache Required)

```csharp
// IEntityCache cannot cache "all active products" or "products by category"
// Use custom cache with meaningful keys

public class ProductCacheService : IProductCacheService, ITransientDependency
{
    private readonly IDistributedCache<List<ProductDto>> _listCache;
    
    private string GetCategoryKey(Guid categoryId) 
        => $"Products:Category:{categoryId}";
    
    private const string ActiveProductsKey = "Products:Active:All";
    
    public async Task<List<ProductDto>> GetByCategoryAsync(Guid categoryId)
    {
        return await _listCache.GetOrAddAsync(
            GetCategoryKey(categoryId),
            async () => await LoadFromDatabase(categoryId),
            () => new DistributedCacheEntryOptions { ... }
        );
    }
    
    // Must invalidate ALL related cache keys on product change
    public async Task InvalidateCacheAsync(Product product)
    {
        await _listCache.RemoveAsync(GetCategoryKey(product.CategoryId));
        await _listCache.RemoveAsync(ActiveProductsKey);
    }
}
```

---

## Validation Checklist

### Custom Cache Service
- [ ] Cache item class defined (or reusing DTO)
- [ ] Interface with `GetAsync` and `InvalidateCacheAsync` methods
- [ ] Implementation uses `IDistributedCache<T>`
- [ ] Uses `GetOrAddAsync` for cache-aside pattern
- [ ] Expiration options configured
- [ ] Event handler created for cache invalidation
- [ ] Implements `ITransientDependency`

### Entity Cache (Simpler)
- [ ] `AddEntityCache<T, TKey>()` registered in module
- [ ] AutoMapper configured if using DTO
- [ ] Entity is JSON-serializable
- [ ] Use repository for writes (cache is read-only)
