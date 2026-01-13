// Template: Local Event Handler (Cache Invalidation)
// Location: services/{ServiceName}/src/QQG.{ServiceName}.Application/{Feature}/{Entity}CreatedUpdatedLocalEventHandler.cs
// Replace: {ServiceName}, {Feature}, {Entity}

using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities.Events;
using Volo.Abp.EventBus;

namespace QQG.{ServiceName}.{Feature};

/// <summary>
/// Handles local entity events for {Entity}
/// Used for cache invalidation when entities are created or updated
/// </summary>
public class {Entity}CreatedUpdatedLocalEventHandler :
    ILocalEventHandler<EntityCreatedEventData<{Entity}>>,
    ILocalEventHandler<EntityUpdatedEventData<{Entity}>>,
    ILocalEventHandler<EntityDeletedEventData<{Entity}>>,
    ITransientDependency
{
    private readonly I{Entity}CacheService _cacheService;
    private readonly ILogger<{Entity}CreatedUpdatedLocalEventHandler> _logger;

    public {Entity}CreatedUpdatedLocalEventHandler(
        I{Entity}CacheService cacheService,
        ILogger<{Entity}CreatedUpdatedLocalEventHandler> logger)
    {
        _cacheService = cacheService;
        _logger = logger;
    }

    /// <summary>
    /// Handles entity created event
    /// </summary>
    public virtual async Task HandleEventAsync(EntityCreatedEventData<{Entity}> eventData)
    {
        _logger.LogDebug("{Entity} created with Id {EntityId}, invalidating cache",
            nameof({Entity}), eventData.Entity.Id);
            
        await _cacheService.InvalidateCacheAsync();
    }

    /// <summary>
    /// Handles entity updated event
    /// </summary>
    public virtual async Task HandleEventAsync(EntityUpdatedEventData<{Entity}> eventData)
    {
        _logger.LogDebug("{Entity} updated with Id {EntityId}, invalidating cache",
            nameof({Entity}), eventData.Entity.Id);
            
        await _cacheService.InvalidateCacheAsync();
    }

    /// <summary>
    /// Handles entity deleted event
    /// </summary>
    public virtual async Task HandleEventAsync(EntityDeletedEventData<{Entity}> eventData)
    {
        _logger.LogDebug("{Entity} deleted with Id {EntityId}, invalidating cache",
            nameof({Entity}), eventData.Entity.Id);
            
        await _cacheService.InvalidateCacheAsync();
    }
}
