using System;
using Volo.Abp.Domain.Values;

namespace QQG.{ServiceName}.{Feature};

/// <summary>
/// {Description} - Immutable value object
/// </summary>
public class {ValueObjectName} : ValueObject
{
    /// <summary>
    /// {PropertyDescription}
    /// </summary>
    public string Property1 { get; }

    /// <summary>
    /// {PropertyDescription}
    /// </summary>
    public decimal Property2 { get; }

    /// <summary>
    /// Private constructor for ORM/serialization
    /// </summary>
    private {ValueObjectName}()
    {
        Property1 = string.Empty;
    }

    /// <summary>
    /// Creates a new {ValueObjectName}
    /// </summary>
    public {ValueObjectName}(string property1, decimal property2)
    {
        Property1 = Check.NotNullOrWhiteSpace(property1, nameof(property1));
        Property2 = property2;
    }

    /// <summary>
    /// Returns the properties used for equality comparison
    /// </summary>
    protected override IEnumerable<object> GetAtomicValues()
    {
        yield return Property1;
        yield return Property2;
    }
}
