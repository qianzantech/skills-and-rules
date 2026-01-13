// Template: Distributed Event Handler + ETO
// Location: See file sections below
// Replace: {ServiceName}, {Feature}, {Event}, {Entity}

using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus;
using Volo.Abp.EventBus.Distributed;
using Volo.Abp.MultiTenancy;

// ============================================
// Event Transfer Object (ETO)
// File: services/{ServiceName}/src/QQG.{ServiceName}.Application.Contracts/{Feature}/{Event}Eto.cs
// ============================================

namespace QQG.{ServiceName}.{Feature};

/// <summary>
/// Event transfer object for {Event}
/// Published when {description}
/// </summary>
[EventName("QQG.{ServiceName}.{Event}")]
[Serializable]
public class {Event}Eto
{
    /// <summary>
    /// Tenant Id for multi-tenant operations
    /// </summary>
    public Guid? TenantId { get; set; }

    /// <summary>
    /// Entity Id that triggered the event
    /// </summary>
    public Guid EntityId { get; set; }

    /// <summary>
    /// Name or identifier for logging
    /// </summary>
    public string EntityName { get; set; } = string.Empty;

    /// <summary>
    /// When the event occurred
    /// </summary>
    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;

    // Add other properties as needed
}

// ============================================
// Distributed Event Handler
// File: services/{ServiceName}/src/QQG.{ServiceName}.Application/{Feature}/{Event}Handler.cs
// ============================================

namespace QQG.{ServiceName}.{Feature};

/// <summary>
/// Handles distributed {Event} events
/// </summary>
public class {Event}Handler : IDistributedEventHandler<{Event}Eto>, ITransientDependency
{
    private readonly ILogger<{Event}Handler> _logger;
    private readonly I{Entity}Repository _repository;
    private readonly ICurrentTenant _currentTenant;

    public {Event}Handler(
        ILogger<{Event}Handler> logger,
        I{Entity}Repository repository,
        ICurrentTenant currentTenant)
    {
        _logger = logger;
        _repository = repository;
        _currentTenant = currentTenant;
    }

    /// <summary>
    /// Handles the distributed event
    /// </summary>
    public virtual async Task HandleEventAsync({Event}Eto eventData)
    {
        _logger.LogInformation("Handling {Event} for entity {EntityId}",
            nameof({Event}Eto), eventData.EntityId);

        try
        {
            // Switch to correct tenant context
            using (_currentTenant.Change(eventData.TenantId))
            {
                // Process the event
                // var entity = await _repository.GetAsync(eventData.EntityId);
                // Do something with the entity...

                _logger.LogInformation("Completed handling {Event} for entity {EntityId}",
                    nameof({Event}Eto), eventData.EntityId);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling {Event} for entity {EntityId}",
                nameof({Event}Eto), eventData.EntityId);
            throw; // Re-throw to allow retry
        }
    }
}

// ============================================
// How to Publish a Distributed Event
// ============================================
/*
public class SomeAppService : ApplicationService
{
    private readonly IDistributedEventBus _distributedEventBus;

    public SomeAppService(IDistributedEventBus distributedEventBus)
    {
        _distributedEventBus = distributedEventBus;
    }

    public async Task PublishEventAsync({Entity} entity)
    {
        await _distributedEventBus.PublishAsync(
            new {Event}Eto
            {
                TenantId = CurrentTenant.Id,
                EntityId = entity.Id,
                EntityName = entity.Name,
                OccurredAt = DateTime.UtcNow
            }
        );
    }
}
*/
