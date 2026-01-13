// Template: DTOs for Application Service
// Location: services/{ServiceName}/src/QQG.{ServiceName}.Application.Contracts/{Feature}/Dtos/
// Replace: {ServiceName}, {Feature}, {Entity}

using System;
using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace QQG.{ServiceName}.{Feature}.Dtos;

// ============================================
// Output DTO - Basic
// File: {Entity}Dto.cs
// ============================================
[Serializable]
public class {Entity}Dto : ExtensibleFullAuditedEntityDto<Guid>
{
    public string Name { get; set; } = string.Empty;
    
    // Add other properties
    // Reference other aggregates by Id
    // public Guid CategoryId { get; set; }
}

// ============================================
// Output DTO - With Details
// File: {Entity}WithDetailsDto.cs
// ============================================
[Serializable]
public class {Entity}WithDetailsDto : ExtensibleFullAuditedEntityDto<Guid>
{
    public string Name { get; set; } = string.Empty;
    
    // Include related DTOs for detailed view
    // public CategoryDto Category { get; set; }
}

// ============================================
// Input DTO - Create
// File: Create{Entity}Dto.cs
// ============================================
[Serializable]
public class Create{Entity}Dto
{
    [Required]
    [StringLength(256)]
    public string Name { get; set; } = string.Empty;
    
    // Add other required properties with validation
}

// ============================================
// Input DTO - Update
// File: Update{Entity}Dto.cs
// ============================================
[Serializable]
public class Update{Entity}Dto
{
    [Required]
    [StringLength(256)]
    public string Name { get; set; } = string.Empty;
    
    // Add updatable properties
}

// ============================================
// Input DTO - List Query
// File: Get{Entity}ListInput.cs
// ============================================
[Serializable]
public class Get{Entity}ListInput : PagedAndSortedResultRequestDto
{
    public string? Filter { get; set; }
    
    // Add other filter properties
    // public Guid? CategoryId { get; set; }
    // public DateTime? StartDate { get; set; }
}
