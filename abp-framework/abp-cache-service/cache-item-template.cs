// Template: Cache Item Class
// Location: services/{ServiceName}/src/QQG.{ServiceName}.Application/{Feature}/{Entity}CacheItem.cs
// Replace: {ServiceName}, {Feature}, {Entity}
// NOTE: You can also reuse existing DTOs instead of creating separate cache items

using System;
using Volo.Abp.Caching;

namespace QQG.{ServiceName}.{Feature};

// ============================================
// Option 1: Basic Cache Item (reuse DTO pattern)
// ============================================

/// <summary>
/// Cache item for {Entity} data
/// Uses CacheName attribute to customize cache key prefix
/// </summary>
[CacheName("{Entity}")]
[Serializable]
public class {Entity}CacheItem
{
    public Guid Id { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    // Add other frequently accessed properties
    // Keep it lightweight - only include what's needed for cache
}

// ============================================
// Option 2: Shared Cache Item (multi-tenant disabled)
// ============================================

/// <summary>
/// Cache item shared across all tenants
/// Use IgnoreMultiTenancy when data is the same for all tenants
/// </summary>
[CacheName("Shared{Entity}")]
[IgnoreMultiTenancy]
[Serializable]
public class Shared{Entity}CacheItem
{
    public Guid Id { get; set; }
    
    public string Name { get; set; } = string.Empty;
}

// ============================================
// Usage Notes
// ============================================
/*
ABP Cache Key Generation:
- Default format: {CacheName}:{TenantId}:{Key}
- With [IgnoreMultiTenancy]: {CacheName}:{Key}
- CacheName defaults to full class name without "CacheItem" suffix

Example:
- MyProject.BookCacheItem with key "123" and tenant "abc"
- Cache key: "MyProject.Book:abc:123"

With [CacheName("Books")]:
- Cache key: "Books:abc:123"

Configuration:
Configure<AbpDistributedCacheOptions>(options =>
{
    options.KeyPrefix = "MyApp:";
    options.GlobalCacheEntryOptions = new DistributedCacheEntryOptions
    {
        SlidingExpiration = TimeSpan.FromMinutes(20)
    };
});
*/
