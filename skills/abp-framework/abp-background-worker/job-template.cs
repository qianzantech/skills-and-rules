// Template: Background Job with Args
// Location: services/{ServiceName}/src/QQG.{ServiceName}.Application/BackgroundJobs/
// Files: {Name}Args.cs, {Name}Job.cs
// Replace: {ServiceName}, {Name}, {Entity}

using System;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.DependencyInjection;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;

namespace QQG.{ServiceName}.BackgroundJobs;

// ============================================
// Job Arguments
// File: {Name}Args.cs
// ============================================

/// <summary>
/// Arguments for {Name} background job
/// </summary>
[Serializable]
public class {Name}Args
{
    /// <summary>
    /// Tenant Id for multi-tenant operations
    /// </summary>
    public Guid? TenantId { get; set; }

    /// <summary>
    /// Entity Id to process
    /// </summary>
    public Guid EntityId { get; set; }

    // Add other properties as needed
    // public string AdditionalData { get; set; }
}

// ============================================
// Job Implementation
// File: {Name}Job.cs
// ============================================

/// <summary>
/// Background job for {description}
/// NOTE: Use AsyncBackgroundJob for async operations per ABP best practices
/// </summary>
public class {Name}Job : AsyncBackgroundJob<{Name}Args>, ITransientDependency
{
    private readonly ILogger<{Name}Job> _logger;
    private readonly I{Entity}Repository _repository;
    private readonly ICurrentTenant _currentTenant;

    public {Name}Job(
        ILogger<{Name}Job> logger,
        I{Entity}Repository repository,
        ICurrentTenant currentTenant)
    {
        _logger = logger;
        _repository = repository;
        _currentTenant = currentTenant;
    }

    [UnitOfWork]
    public override void Execute({Name}Args args)
    {
        _logger.LogInformation("Executing {JobName} for entity {EntityId}",
            nameof({Name}Job), args.EntityId);

        try
        {
            // Switch to correct tenant context
            using (_currentTenant.Change(args.TenantId))
            {
                // Get and process the entity
                var entity = _repository.GetAsync(args.EntityId).GetAwaiter().GetResult();

                // Do the work...
                // ProcessEntity(entity);

                _logger.LogInformation("Completed {JobName} for entity {EntityId}",
                    nameof({Name}Job), args.EntityId);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in {JobName} for entity {EntityId}",
                nameof({Name}Job), args.EntityId);
            throw; // Re-throw to allow retry
        }
    }
}

// ============================================
// How to Queue the Job
// ============================================
/*
public class SomeAppService : ApplicationService
{
    private readonly IBackgroundJobManager _backgroundJobManager;

    public SomeAppService(IBackgroundJobManager backgroundJobManager)
    {
        _backgroundJobManager = backgroundJobManager;
    }

    public async Task TriggerJobAsync(Guid entityId)
    {
        await _backgroundJobManager.EnqueueAsync(
            new {Name}Args
            {
                TenantId = CurrentTenant.Id,
                EntityId = entityId
            }
        );
    }
}
*/
