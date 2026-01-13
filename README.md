[English](README.md) | [中文](README.zh-CN.md)

# AI Agent Skills & Rules Repository

A centralized repository for AI coding assistant rules and skills used in daily development tasks. Inspired by [Anthropic Skills](https://github.com/anthropics/skills).

## Overview

This repository contains:
- **Skills** - Code generation templates and patterns for specific frameworks
- **Rules** - Coding standards and best practices for AI agents to follow

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
└── README.md
```

## Usage

### Quick Start with Converter Tool

Use the built-in converter tool to export rules for your AI IDE:

```bash
# List all available rules
node tools/convert-rules.js --list

# Convert specific rules to Cursor format (copy from console)
node tools/convert-rules.js -f cursor -r frontend/typescript,testing/vitest

# Convert all rules to Windsurf format and save to file
node tools/convert-rules.js -f windsurf --all -o my-rules.windsurfrules

# Convert to JSON format
node tools/convert-rules.js -f json --all -o rules.json
```

**Supported Formats:**
- `cursor` - Cursor IDE (.cursorrules)
- `windsurf` - Windsurf IDE (.windsurfrules)
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
