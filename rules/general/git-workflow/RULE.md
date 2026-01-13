---
description: Git workflow, branching strategy, and commit conventions. Apply when working with version control.
globs: ".git/**, .gitignore, CHANGELOG.md"
---

# Git Workflow & Conventions

## Branch Strategy (Gitflow)

| Branch | Purpose | Rules |
|--------|---------|-------|
| `main` | Production-ready code | Never commit directly |
| `develop` | Latest development changes | Never commit directly |

### Supporting Branches

| Type | Branch From | Merge To | Example |
|------|-------------|----------|---------|
| Feature | develop | develop | `feature/123-user-auth` |
| Release | develop | main, develop | `release/v1.2.0` |
| Hotfix | main | main, develop | `hotfix/v1.2.1` |

## Commit Message Convention

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, no code change |
| `refactor` | Code refactoring |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `chore` | Maintenance tasks |

### Examples

```bash
feat(auth): add OAuth2 login support
fix(cart): resolve quantity calculation error
feat(api)!: change response format for user endpoint

BREAKING CHANGE: Response now wraps data in 'result' field
```

## Semantic Versioning

```
MAJOR.MINOR.PATCH

1.0.0 → 1.0.1  (PATCH: bug fix)
1.0.1 → 1.1.0  (MINOR: new feature)
1.1.0 → 2.0.0  (MAJOR: breaking changes)
```

## Pull Request Rules

1. All changes must go through Pull Requests
2. Minimum 1 approval required
3. CI checks must pass
4. Branch must be up to date before merging
5. Delete branch after merge
