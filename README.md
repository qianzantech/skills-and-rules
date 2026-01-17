[English](README.md) | [中文](README.zh-CN.md)

# AI Agent Skills & Rules Repository

A centralized repository for AI coding assistant rules and skills used in daily development tasks. Inspired by [Anthropic Skills](https://github.com/anthropics/skills).

## Overview

This repository contains:
- **Skills** - Code generation templates and patterns for specific frameworks
- **Rules** - Coding standards and best practices for AI agents to follow
- **Workflows** - Reusable step-by-step processes for common development tasks (Windsurf)

## Tech Stack Coverage

| Category | Technologies |
|----------|-------------|
| Backend | ABP Framework, .NET Core, Entity Framework |
| Frontend | Vue 3, Vben Admin, TypeScript |
| Mobile | UniApp (WeChat/Alipay Mini Programs, H5, App) |
| Testing | Vitest, Playwright, Vue Test Utils |

## Directory Structure

```
skills/
├── skills/                    # Code generation templates
│   └── abp-framework/        # ABP Framework skills
│       ├── abp-entity/       # Entity & aggregate root templates
│       ├── abp-application-service/  # AppService patterns
│       ├── abp-domain-service/       # Domain service patterns
│       ├── abp-repository/           # Repository patterns
│       ├── abp-event-handler/        # Event handler templates
│       ├── abp-cache-service/        # Cache service patterns
│       └── abp-background-worker/    # Background job templates
│
├── rules/                     # AI agent coding rules
│   ├── frontend/             # Frontend development rules
│   │   ├── uniapp/          # UniApp cross-platform
│   │   └── typescript/      # TypeScript standards
│   │
│   ├── general/              # General coding rules
│   │   ├── clean-code/      # Clean code principles
│   │   ├── coding-standards/ # General standards
│   │   └── git-workflow/    # Git conventions
│   │
│   └── testing/              # Testing rules
│       ├── vitest/          # Vitest unit testing
│       ├── playwright/      # Playwright E2E testing
│       └── vue-test-utils/  # Vue component testing
│
├── workflows/                 # Windsurf Cascade workflows
│   ├── abp/                  # ABP Framework workflows
│   │   └── create-entity.md # Entity creation workflow
│   ├── git/                  # Git workflows
│   │   ├── pr-review.md     # Address PR comments
│   │   └── commit-and-pr.md # Commit and create PR
│   ├── testing/             # Testing workflows
│   │   └── run-and-fix.md   # Run tests and fix failures
│   ├── frontend/            # Frontend workflows
│   │   └── vue-component.md # Create Vue component
│   └── debugging/           # Debugging workflows
│       └── systematic-debug.md
│
└── README.md
```

## Usage

### 🌐 Web UI (Recommended)

The easiest way to export rules - a visual interface to browse and select rules:

```bash
# Generate data file (run once or when rules change)
node tools/generate-data.js

# Start the web server
node tools/serve.js

# Open http://localhost:3000 in your browser
```

Features:
- Browse all rules and skills by category
- Select individual items or entire categories
- Export to Cursor, Windsurf, Markdown, or JSON format
- One-click copy to clipboard

### 💻 CLI Tool

For command-line usage:

```bash
# List all available rules
node tools/convert-rules.js --list

# List all available workflows
node tools/convert-rules.js --list-workflows

# Convert specific rules to Cursor format
node tools/convert-rules.js -f cursor -r frontend/typescript,testing/vitest

# Convert all rules to Windsurf format and save to file
node tools/convert-rules.js -f windsurf --all -o my-rules.windsurfrules

# Export all workflows for Windsurf
node tools/convert-rules.js --workflows all

# Export specific workflows
node tools/convert-rules.js --workflows pr-review,run-and-fix
```

**Supported Formats:**
- `cursor` - Cursor IDE (.cursorrules)
- `windsurf` - Windsurf IDE (.windsurfrules)
- `windsurf-workflow` - Windsurf Workflows (.md)
- `markdown` - Plain Markdown (.md)
- `json` - JSON format (.json)

### Manual Usage with Cursor IDE

1. Clone this repository to your local machine
2. In Cursor settings, add the rules folder path to "Rules for AI"
3. Reference specific rules using `@rules/frontend/typescript` syntax

### With Other AI Tools

Copy the relevant rule content into your AI assistant's system prompt or context.

### Skill Format

Each skill follows this structure:

```
skill-name/
├── SKILL.md           # Skill description and usage guide
├── *-template.cs      # Code templates with placeholders
└── examples/          # (Optional) Usage examples
```

### Rule Format

Each rule follows this structure:

```
rule-name/
└── RULE.md            # Rule description with:
                       # - YAML frontmatter (description, globs)
                       # - Guidelines and patterns
                       # - Code examples
                       # - Checklist
```

### Workflow Format (Windsurf)

Workflows are markdown files that guide Cascade through step-by-step processes:

```
workflow-name.md       # Workflow with:
                       # - Title (# heading)
                       # - Prerequisites (optional)
                       # - Numbered steps
                       # - Commands and code blocks
                       # - Verification checklist
```

**Usage in Windsurf:**
1. Copy workflow to `.windsurf/workflows/` in your project
2. Invoke with `/{workflow-name}` command in Cascade
3. Cascade will follow the steps sequentially

## Contributing

### Adding a New Skill

1. Create a new folder under `skills/{framework}/{skill-name}/`
2. Add `SKILL.md` with:
   ```markdown
   ---
   name: skill-name
   description: Brief description of when to use this skill
   ---
   
   # Skill Title
   
   ## When to Use
   - Use case 1
   - Use case 2
   
   ## Required Steps
   1. Step one
   2. Step two
   
   ## Template Files
   - `template-name.cs` - Description
   
   ## Validation Checklist
   - [ ] Check item 1
   - [ ] Check item 2
   ```
3. Add template files with placeholders like `{EntityName}`, `{ServiceName}`

### Adding a New Rule

1. Create a new folder under `rules/{category}/{rule-name}/`
2. Add `RULE.md` with:
   ```markdown
   ---
   description: When this rule applies
   globs: "**/*.ts, **/*.vue"
   ---
   
   # Rule Title
   
   ## Guidelines
   - Guideline 1
   - Guideline 2
   
   ## Code Examples
   ```typescript
   // Good example
   ```
   
   ## Checklist
   - [ ] Check item 1
   ```

### Contribution Guidelines

1. **Keep rules concise** - AI agents work better with focused, actionable rules
2. **Include code examples** - Show both good and bad patterns
3. **Add checklists** - Help verify rule compliance
4. **Use proper globs** - Specify which files the rule applies to
5. **Test with AI** - Verify the rule produces expected results

## License

MIT License - Feel free to use, modify, and distribute.

## Acknowledgments

- [Anthropic Skills](https://github.com/anthropics/skills) - Inspiration for skill format
- [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) - Community cursor rules
- [ABP Framework](https://abp.io/) - Backend framework documentation
- [Vben Admin](https://doc.vben.pro/) - Admin template documentation
- [UniApp](https://uniapp.dcloud.io/) - Cross-platform framework documentation
