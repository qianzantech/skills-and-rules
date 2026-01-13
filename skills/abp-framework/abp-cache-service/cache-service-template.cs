// Template: Cache Service Implementation
// Location: services/{ServiceName}/src/QQG.{ServiceName}.Application/{Feature}/{Entity}CacheService.cs
// Replace: {ServiceName}, {Feature}, {Entity}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Volo.Abp.Caching;
using Volo.Abp.DependencyInjection;

namespace QQG.{ServiceName}.{Feature};

/// <summary>
/// Cache service for {Entity}
/// Uses ABP's IDistributedCache for distributed caching
/// </summary>
public class {Entity}CacheService : I{Entity}CacheService, ITransientDependency
{
    // Cache for list of all entities
    private readonly IDistributedCache<List<{Entity}Dto>> _listCache;
    
    // Cache for individual entities (use TCacheKey for typed keys)
    private readonly IDistributedCache<{Entity}Dto, Guid> _itemCache;
    
    private readonly I{Entity}Repository _repository;
    private readonly ILogger<{Entity}CacheService> _logger;
    
    // Cache key for the full list
    private const string AllItemsCacheKey = "{Entity}:All";

    public {Entity}CacheService(
        IDistributedCache<List<{Entity}Dto>> listCache,
        IDistributedCache<{Entity}Dto, Guid> itemCache,
        I{Entity}Repository repository,
        ILogger<{Entity}CacheService> logger)
    {
        _listCache = listCache;
        _itemCache = itemCache;
        _repository = repository;
        _logger = logger;
    }

    /// <summary>
    /// Gets all {Entity} items from cache, or loads from database if not cached
    /// Uses GetOrAddAsync for cache-aside pattern per ABP best practices
    /// </summary>
    public virtual async Task<List<{Entity}Dto>> GetAllAsync()
    {
        return await _listCache.GetOrAddAsync(
            AllItemsCacheKey,
            async () =>
            {
                _logger.LogDebug("Cache miss for {CacheKey}, loading from database", AllItemsCacheKey);
                
                var entities = await _repository.GetListAsync(
                    skipCount: 0,
                    maxResultCount: int.MaxValue
                );
                
                return entities.Select(e => new {Entity}Dto
                {
                    Id = e.Id,
                    Name = e.Name
                    // Map other properties
                }).ToList();
            },
            () => new DistributedCacheEntryOptions
            {
                // Use sliding expiration for frequently accessed data
                SlidingExpiration = TimeSpan.FromMinutes(30),
                // Or absolute expiration for time-sensitive data
                // AbsoluteExpiration = DateTimeOffset.Now.AddHours(1)
            }
        );
    }

    /// <summary>
    /// Gets a single {Entity} by Id from cache or database
    /// </summary>
    public virtual async Task<{Entity}Dto?> GetByIdAsync(Guid id)
    {
        return await _itemCache.GetOrAddAsync(
            id, // ABP auto-converts Guid to cache key
            async () =>
            {
                _logger.LogDebug("Cache miss for {Entity} {Id}, loading from database", 
                    nameof({Entity}), id);
                
                var entity = await _repository.FindAsync(id);
                if (entity == null) return null;
                
                return new {Entity}Dto
                {
                    Id = entity.Id,
                    Name = entity.Name
                    // Map other properties
                };
            },
            () => new DistributedCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromMinutes(30)
            }
        );
    }

    /// <summary>
    /// Invalidates all cache entries for {Entity}
    /// Call this when entities are created/updated/deleted
    /// </summary>
    public virtual async Task InvalidateCacheAsync()
    {
        _logger.LogDebug("Invalidating all {Entity} cache", nameof({Entity}));
        await _listCache.RemoveAsync(AllItemsCacheKey);
    }

    /// <summary>
    /// Invalidates cache entry for a specific {Entity}
    /// </summary>
    public virtual async Task InvalidateCacheAsync(Guid id)
    {
        _logger.LogDebug("Invalidating cache for {Entity} {Id}", nameof({Entity}), id);
        
        // Remove both the individual item and the list cache
        await _itemCache.RemoveAsync(id);
        await _listCache.RemoveAsync(AllItemsCacheKey);
    }
}
