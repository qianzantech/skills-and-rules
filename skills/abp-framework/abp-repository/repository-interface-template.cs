// Template: Repository Interface
// Location: services/{ServiceName}/src/QQG.{ServiceName}.Domain/{Feature}/I{Entity}Repository.cs
// Replace: {ServiceName}, {Feature}, {Entity}

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace QQG.{ServiceName}.{Feature};

/// <summary>
/// Repository interface for {Entity}
/// NOTE: Inherit from IBasicRepository (not IRepository) to avoid exposing IQueryable
/// </summary>
public interface I{Entity}Repository : IBasicRepository<{Entity}, Guid>
{
    /// <summary>
    /// Finds an entity by name
    /// </summary>
    Task<{Entity}?> FindByNameAsync(
        string name,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets a paged list of entities
    /// </summary>
    Task<List<{Entity}>> GetListAsync(
        int skipCount,
        int maxResultCount,
        string? sorting = null,
        string? filter = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the total count
    /// </summary>
    Task<long> GetCountAsync(
        string? filter = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets entity with all related data loaded
    /// </summary>
    Task<{Entity}> GetWithDetailsAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}
