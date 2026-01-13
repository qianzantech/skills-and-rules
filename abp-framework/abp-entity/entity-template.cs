using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace QQG.{ServiceName}.{Feature};

/// <summary>
/// {Description} - Child entity of {ParentAggregate}
/// </summary>
public class {EntityName} : FullAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; protected set; }

    /// <summary>
    /// Parent aggregate root Id
    /// </summary>
    public virtual Guid {ParentName}Id { get; protected set; }

    /// <summary>
    /// {PropertyDescription}
    /// </summary>
    public virtual string Name { get; protected set; } = string.Empty;

    // Add other properties with protected set

    /// <summary>
    /// Protected constructor for ORM
    /// </summary>
    protected {EntityName}()
    {
    }

    /// <summary>
    /// Primary constructor
    /// </summary>
    public {EntityName}(
        Guid id,
        Guid? tenantId,
        Guid {parentName}Id,
        string name) : base(id)
    {
        TenantId = tenantId;
        {ParentName}Id = {parentName}Id;
        SetName(name);
    }

    /// <summary>
    /// Sets the name with validation
    /// </summary>
    public virtual {EntityName} SetName(string name)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: 256);
        return this;
    }
}
