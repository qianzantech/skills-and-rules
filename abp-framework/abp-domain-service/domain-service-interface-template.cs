// Template: Domain Service Interface
// Location: services/{ServiceName}/src/QQG.{ServiceName}.Domain/{Feature}/I{Name}Manager.cs
// Replace: {ServiceName}, {Feature}, {Name}, {Entity}

using System;
using System.Threading.Tasks;

namespace QQG.{ServiceName}.{Feature};

/// <summary>
/// Domain service for managing {Entity} operations
/// </summary>
public interface I{Name}Manager
{
    /// <summary>
    /// Creates a new {Entity} with validation
    /// </summary>
    Task<{Entity}> CreateAsync(
        Guid? tenantId,
        string name,
        // Add other parameters
        );

    /// <summary>
    /// Updates an existing {Entity}
    /// </summary>
    Task<{Entity}> UpdateAsync(
        {Entity} entity,
        string name
        // Add other parameters
        );

    /// <summary>
    /// Validates business rules before operation
    /// </summary>
    Task ValidateAsync({Entity} entity);
}
