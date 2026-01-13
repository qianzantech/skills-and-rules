// Template: Application Service Implementation
// Location: services/{ServiceName}/src/QQG.{ServiceName}.Application/{Feature}/{Feature}AppService.cs
// Replace: {ServiceName}, {Feature}, {Entity}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace QQG.{ServiceName}.{Feature};

/// <summary>
/// Application service for {Entity} operations
/// </summary>
[Authorize]
public class {Feature}AppService : ApplicationService, I{Feature}AppService
{
    private readonly I{Entity}Repository _repository;
    // Optional: inject domain manager for complex operations
    // private readonly I{Entity}Manager _manager;

    public {Feature}AppService(
        I{Entity}Repository repository)
    {
        _repository = repository;
    }

    /// <summary>
    /// Gets a single {Entity} by Id
    /// </summary>
    public virtual async Task<{Entity}Dto> GetAsync(Guid id)
    {
        var entity = await _repository.GetAsync(id);
        return ObjectMapper.Map<{Entity}, {Entity}Dto>(entity);
    }

    /// <summary>
    /// Gets a paged list of {Entity}
    /// </summary>
    public virtual async Task<PagedResultDto<{Entity}Dto>> GetListAsync(Get{Entity}ListInput input)
    {
        var totalCount = await _repository.GetCountAsync(input.Filter);
        var items = await _repository.GetListAsync(
            skipCount: input.SkipCount,
            maxResultCount: input.MaxResultCount,
            sorting: input.Sorting,
            filter: input.Filter
        );

        return new PagedResultDto<{Entity}Dto>(
            totalCount,
            ObjectMapper.Map<List<{Entity}>, List<{Entity}Dto>>(items)
        );
    }

    /// <summary>
    /// Creates a new {Entity}
    /// </summary>
    public virtual async Task<{Entity}Dto> CreateAsync(Create{Entity}Dto input)
    {
        var entity = new {Entity}(
            id: GuidGenerator.Create(),
            tenantId: CurrentTenant.Id,
            name: input.Name
            // Map other properties
        );

        await _repository.InsertAsync(entity, autoSave: true);

        return ObjectMapper.Map<{Entity}, {Entity}Dto>(entity);
    }

    /// <summary>
    /// Updates an existing {Entity}
    /// </summary>
    public virtual async Task<{Entity}Dto> UpdateAsync(Guid id, Update{Entity}Dto input)
    {
        var entity = await _repository.GetAsync(id);

        entity.SetName(input.Name);
        // Update other properties

        await _repository.UpdateAsync(entity, autoSave: true);

        return ObjectMapper.Map<{Entity}, {Entity}Dto>(entity);
    }

    /// <summary>
    /// Deletes an {Entity}
    /// </summary>
    public virtual async Task DeleteAsync(Guid id)
    {
        await _repository.DeleteAsync(id);
    }
}
