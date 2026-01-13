// Template: Domain Service Implementation
// Location: services/{ServiceName}/src/QQG.{ServiceName}.Domain/{Feature}/{Name}Manager.cs
// Replace: {ServiceName}, {Feature}, {Name}, {Entity}

using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.Domain.Services;
using Volo.Abp.Guids;

namespace QQG.{ServiceName}.{Feature};

/// <summary>
/// Domain service for managing {Entity} operations
/// </summary>
public class {Name}Manager : DomainService, I{Name}Manager
{
    private readonly I{Entity}Repository _repository;
    private readonly IGuidGenerator _guidGenerator;
    private readonly ILogger<{Name}Manager> _logger;

    public {Name}Manager(
        I{Entity}Repository repository,
        IGuidGenerator guidGenerator,
        ILogger<{Name}Manager> logger)
    {
        _repository = repository;
        _guidGenerator = guidGenerator;
        _logger = logger;
    }

    /// <summary>
    /// Creates a new {Entity} with validation
    /// </summary>
    public virtual async Task<{Entity}> CreateAsync(
        Guid? tenantId,
        string name)
    {
        // Validate input
        Check.NotNullOrWhiteSpace(name, nameof(name));

        // Check for duplicates or other business rules
        var existing = await _repository.FindByNameAsync(name);
        if (existing != null)
        {
            throw new BusinessException("{ServiceName}:{Entity}:NameAlreadyExists")
                .WithData("name", name);
        }

        // Create entity
        var entity = new {Entity}(
            id: _guidGenerator.Create(),
            tenantId: tenantId,
            name: name
        );

        _logger.LogInformation("Created {EntityName} with Id {EntityId}", 
            nameof({Entity}), entity.Id);

        return entity;
    }

    /// <summary>
    /// Updates an existing {Entity}
    /// </summary>
    public virtual async Task<{Entity}> UpdateAsync(
        {Entity} entity,
        string name)
    {
        Check.NotNull(entity, nameof(entity));
        Check.NotNullOrWhiteSpace(name, nameof(name));

        // Check for duplicates (excluding current entity)
        var existing = await _repository.FindByNameAsync(name);
        if (existing != null && existing.Id != entity.Id)
        {
            throw new BusinessException("{ServiceName}:{Entity}:NameAlreadyExists")
                .WithData("name", name);
        }

        entity.SetName(name);

        _logger.LogInformation("Updated {EntityName} with Id {EntityId}", 
            nameof({Entity}), entity.Id);

        return entity;
    }

    /// <summary>
    /// Validates business rules
    /// </summary>
    public virtual Task ValidateAsync({Entity} entity)
    {
        Check.NotNull(entity, nameof(entity));
        
        // Add validation logic
        
        return Task.CompletedTask;
    }
}
