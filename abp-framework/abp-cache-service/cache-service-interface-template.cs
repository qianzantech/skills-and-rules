// Template: Cache Service Interface
// Location: services/{ServiceName}/src/QQG.{ServiceName}.Application/{Feature}/I{Entity}CacheService.cs
// Replace: {ServiceName}, {Feature}, {Entity}

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace QQG.{ServiceName}.{Feature};

/// <summary>
/// Cache service interface for {Entity}
/// </summary>
public interface I{Entity}CacheService
{
    /// <summary>
    /// Gets all {Entity} items from cache or database
    /// </summary>
    Task<List<{Entity}Dto>> GetAllAsync();

    /// <summary>
    /// Gets a single {Entity} by Id from cache or database
    /// </summary>
    Task<{Entity}Dto?> GetByIdAsync(Guid id);

    /// <summary>
    /// Invalidates all cache entries for {Entity}
    /// </summary>
    Task InvalidateCacheAsync();

    /// <summary>
    /// Invalidates cache entry for a specific {Entity}
    /// </summary>
    Task InvalidateCacheAsync(Guid id);
}
