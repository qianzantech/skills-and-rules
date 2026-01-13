// Template: Application Service Interface
// Location: services/{ServiceName}/src/QQG.{ServiceName}.Application.Contracts/{Feature}/I{Feature}AppService.cs
// Replace: {ServiceName}, {Feature}, {Entity}

using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace QQG.{ServiceName}.{Feature};

/// <summary>
/// Application service for {Entity} operations
/// </summary>
public interface I{Feature}AppService : IApplicationService
{
    /// <summary>
    /// Gets a single {Entity} by Id
    /// </summary>
    Task<{Entity}Dto> GetAsync(Guid id);

    /// <summary>
    /// Gets a paged list of {Entity}
    /// </summary>
    Task<PagedResultDto<{Entity}Dto>> GetListAsync(Get{Entity}ListInput input);

    /// <summary>
    /// Creates a new {Entity}
    /// </summary>
    Task<{Entity}Dto> CreateAsync(Create{Entity}Dto input);

    /// <summary>
    /// Updates an existing {Entity}
    /// </summary>
    Task<{Entity}Dto> UpdateAsync(Guid id, Update{Entity}Dto input);

    /// <summary>
    /// Deletes an {Entity}
    /// </summary>
    Task DeleteAsync(Guid id);
}
