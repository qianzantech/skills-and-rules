---
name: abp-background-worker
description: Creates ABP Framework background workers and background jobs following QQG conventions. Use this skill when implementing periodic tasks, queued jobs, or async processing.
---

# ABP Background Worker & Job Creation

Create background workers (periodic tasks) and background jobs (queued one-time tasks).

## Worker vs Job Decision

| Type | Use Case | Execution |
|------|----------|-----------|
| **Background Worker** | Polling, cleanup, recovery | Runs periodically on timer |
| **Background Job** | Emails, logging, async tasks | Queued, executed once |

## Background Workers

Periodic tasks that run in the background on a timer.

### When to Use
- Periodic cleanup tasks
- Scheduled data sync
- Health checks
- Cache refresh

### File Location
```
Application/
├── BackgroundWorkers/                 # Root-level folder for ALL workers
│   ├── {Name}Worker.cs
│   └── {Name}Configuration.cs         # Optional worker config
```

> **Note**: Workers go in a root-level `BackgroundWorkers/` folder, NOT in feature folders

### Template Files
- `worker-template.cs` - Worker implementation
- `worker-configuration-template.cs` - Configuration class

### Registration
Register in HttpApi.Host module's `OnApplicationInitializationAsync`:
```csharp
await context.AddBackgroundWorkerAsync<{Name}Worker>();
```

## Background Jobs

One-time tasks that are queued and executed asynchronously.

### When to Use Jobs
- Sending emails/notifications
- Recording audit logs asynchronously
- Tasks that can be retried on failure
- Long-running operations

### File Location
```
Application/
├── BackgroundJobs/                    # Root-level folder for ALL jobs
│   ├── {Name}Job.cs
│   └── {Name}Args.cs
```

> **Note**: Jobs go in a root-level `BackgroundJobs/` folder, NOT in feature folders
> See `abp-folder-structure` skill for complete module structure

### Template Files
- `job-template.cs` - Job implementation with Args class

### Queuing a Job
```csharp
await _backgroundJobManager.EnqueueAsync(new {Name}Args { ... });
```

## ABP Official Guidelines

### Background Workers
1. **Resolve dependencies from `workerContext.ServiceProvider`** - NOT constructor injection
2. **Worker uses `IServiceScope`** - Disposed when work finishes
3. **Exceptions are auto-caught and logged** by `AsyncPeriodicBackgroundWorkerBase`
4. **Register in `OnApplicationInitializationAsync`** - Use `context.AddBackgroundWorkerAsync<T>()`
5. **Consider clustered deployment** - Use distributed lock if needed

### Background Jobs
1. **Use `AsyncBackgroundJob<TArgs>`** - For async operations
2. **Jobs auto-retry on exception** - Hide exception only if no retry needed
3. **Use `ICancellationTokenProvider`** - For cancellable jobs
4. **Use `[BackgroundJobName]` attribute** - For custom job naming
5. **Include TenantId in args** - For multi-tenant operations

## Validation Checklist

### Worker
- [ ] Inherits from `AsyncPeriodicBackgroundWorkerBase`
- [ ] Has `[UnitOfWork]` attribute
- [ ] Resolves scoped services from `workerContext.ServiceProvider`
- [ ] Registered in HttpApi.Host module

### Job
- [ ] Inherits from `AsyncBackgroundJob<{Name}Args>` (for async operations)
- [ ] Implements `ITransientDependency`
- [ ] Args class has `[Serializable]` attribute
- [ ] Args includes `TenantId` for multi-tenancy
- [ ] Uses `ICancellationTokenProvider` if cancellable
