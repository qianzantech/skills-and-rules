using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace QQG.{ServiceName}.{Feature};

/// <summary>
/// {Description}
/// </summary>
public class {EntityName} : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; protected set; }

    /// <summary>
    /// {PropertyDescription}
    /// </summary>
    public virtual string Name { get; protected set; } = string.Empty;

    // Add other properties with protected set
    // public virtual Guid CategoryId { get; protected set; }  // Reference other aggregates by Id only

    // Collections - always initialize in constructor
    // public virtual ICollection<{ChildEntity}> Items { get; protected set; }

    /// <summary>
    /// Protected constructor for ORM
    /// </summary>
    protected {EntityName}()
    {
        // Items = new List<{ChildEntity}>();
    }

    /// <summary>
    /// Primary constructor - ensures entity validity on creation
    /// </summary>
    /// <param name="id">Entity Id - use IGuidGenerator to create</param>
    /// <param name="tenantId">Tenant Id</param>
    /// <param name="name">Name</param>
    public {EntityName}(
        Guid id,
        Guid? tenantId,
        string name) : base(id)
    {
        TenantId = tenantId;
        SetName(name);
        // Items = new List<{ChildEntity}>();
    }

    /// <summary>
    /// Sets the name with validation
    /// </summary>
    /// <returns>Entity for fluent API</returns>
    public virtual {EntityName} SetName(string name)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: 256);
        return this;
    }

    // Add setter methods for other properties
    // public virtual {EntityName} SetCategoryId(Guid categoryId)
    // {
    //     CategoryId = categoryId;
    //     return this;
    // }
}
