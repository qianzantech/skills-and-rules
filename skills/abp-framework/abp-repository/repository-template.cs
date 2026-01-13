// Template: EF Core Repository Implementation
// Location: services/{ServiceName}/src/QQG.{ServiceName}.EntityFrameworkCore/Repositories/Ef{Entity}Repository.cs
// Replace: {ServiceName}, {Feature}, {Entity}, {DbContext}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace QQG.{ServiceName}.EntityFrameworkCore.Repositories;

/// <summary>
/// EF Core repository implementation for {Entity}
/// </summary>
public class Ef{Entity}Repository 
    : EfCoreRepository<{ServiceName}DbContext, {Entity}, Guid>, 
      I{Entity}Repository
{
    public Ef{Entity}Repository(
        IDbContextProvider<{ServiceName}DbContext> dbContextProvider)
        : base(dbContextProvider)
    {
    }

    /// <summary>
    /// Finds an entity by name
    /// NOTE: Use GetCancellationToken helper per ABP best practices
    /// </summary>
    public virtual async Task<{Entity}?> FindByNameAsync(
        string name,
        bool includeDetails = true,
        CancellationToken cancellationToken = default)
    {
        var dbSet = await GetDbSetAsync();
        return await dbSet
            .IncludeDetails(includeDetails)
            .FirstOrDefaultAsync(x => x.Name == name, GetCancellationToken(cancellationToken));
    }

    /// <summary>
    /// Gets a paged list of entities
    /// </summary>
    public virtual async Task<List<{Entity}>> GetListAsync(
        int skipCount,
        int maxResultCount,
        string? sorting = null,
        string? filter = null,
        CancellationToken cancellationToken = default)
    {
        var dbSet = await GetDbSetAsync();
        
        return await dbSet
            .WhereIf(!string.IsNullOrWhiteSpace(filter),
                x => x.Name.Contains(filter!))
            .OrderBy(sorting.IsNullOrWhiteSpace() ? nameof({Entity}.Name) : sorting)
            .Skip(skipCount)
            .Take(maxResultCount)
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Gets the total count
    /// </summary>
    public virtual async Task<long> GetCountAsync(
        string? filter = null,
        CancellationToken cancellationToken = default)
    {
        var dbSet = await GetDbSetAsync();
        
        return await dbSet
            .WhereIf(!string.IsNullOrWhiteSpace(filter),
                x => x.Name.Contains(filter!))
            .LongCountAsync(cancellationToken);
    }

    /// <summary>
    /// Gets entity with all related data loaded
    /// </summary>
    public virtual async Task<{Entity}> GetWithDetailsAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var dbSet = await GetDbSetAsync();
        
        return await dbSet
            // .Include(x => x.RelatedEntity)
            .FirstAsync(x => x.Id == id, cancellationToken);
    }
}
