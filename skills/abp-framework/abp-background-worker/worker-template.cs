// Template: Background Worker
// Location: services/{ServiceName}/src/QQG.{ServiceName}.Application/BackgroundWorkers/{Name}Worker.cs
// Replace: {ServiceName}, {Name}, {Entity}

using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Threading;
using Volo.Abp.Uow;

namespace QQG.{ServiceName}.BackgroundWorkers;

/// <summary>
/// Background worker for {description}
/// Runs periodically to process pending work
/// </summary>
[UnitOfWork]
public class {Name}Worker : AsyncPeriodicBackgroundWorkerBase
{
    private readonly ILogger<{Name}Worker> _logger;

    public {Name}Worker(
        AbpAsyncTimer timer,
        IServiceScopeFactory serviceScopeFactory,
        ILogger<{Name}Worker> logger) : base(timer, serviceScopeFactory)
    {
        _logger = logger;
        
        // Configure timer period (milliseconds)
        Timer.Period = 60000; // 1 minute - adjust as needed
    }

    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        _logger.LogDebug("{WorkerName} starting work cycle", nameof({Name}Worker));

        try
        {
            // Resolve scoped services from context (NOT constructor injection)
            var repository = workerContext.ServiceProvider
                .GetRequiredService<I{Entity}Repository>();

            // Get pending items to process
            var pendingItems = await repository.GetListAsync(
                skipCount: 0,
                maxResultCount: 100,
                filter: "pending"
            );

            foreach (var item in pendingItems)
            {
                try
                {
                    // Process each item
                    // await ProcessItemAsync(item);
                    
                    _logger.LogDebug("Processed item {ItemId}", item.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing item {ItemId}", item.Id);
                    // Continue with next item, don't break the loop
                }
            }

            _logger.LogDebug("{WorkerName} completed. Processed {Count} items",
                nameof({Name}Worker), pendingItems.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "{WorkerName} encountered an error", nameof({Name}Worker));
        }
    }
}
