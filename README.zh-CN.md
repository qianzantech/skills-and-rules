[English](README.md) | [中文](README.zh-CN.md)

# AI 代理技能与规则仓库

集中管理日常开发任务中使用的 AI 编程助手规则和技能。灵感来源于 [Anthropic Skills](https://github.com/anthropics/skills)。

## 概述

本仓库包含：
- **Skills（技能）** - 针对特定框架的代码生成模板和模式
- **Rules（规则）** - AI 代理遵循的编码标准和最佳实践
- **Workflows（工作流）** - 常见开发任务的可复用分步流程（Windsurf）

## 技术栈覆盖

| 类别 | 技术 |
|------|------|
| 后端 | ABP Framework, .NET Core, Entity Framework |
| 前端 | Vue 3, Vben Admin, TypeScript |
| 移动端 | UniApp（微信/支付宝小程序、H5、App） |
| 测试 | Vitest, Playwright, Vue Test Utils |

## 目录结构

```
skills/
├── skills/                    # 代码生成模板
│   ├── abp-framework/        # ABP 框架技能
│   │   ├── abp-entity/       # 实体与聚合根模板
│   │   ├── abp-application-service/  # 应用服务模式
│   │   ├── abp-domain-service/       # 领域服务模式
│   │   ├── abp-repository/           # 仓储模式
│   │   ├── abp-event-handler/        # 事件处理器模板
│   │   ├── abp-cache-service/        # 缓存服务模式
│   │   ├── abp-background-worker/    # 后台作业模板
│   │   └── abp-folder-structure/     # 项目结构模式
│   │
│   └── superpowers/          # AI 代理超能力（来自 Anthropic）
│       ├── brainstorming/            # 头脑风暴技术
│       ├── dispatching-parallel-agents/  # 并行任务执行
│       ├── executing-plans/          # 计划执行模式
│       ├── finishing-a-development-branch/  # 分支完成
│       ├── receiving-code-review/    # 处理评审反馈
│       ├── requesting-code-review/   # 创建评审请求
│       ├── subagent-driven-development/  # 多代理模式
│       ├── systematic-debugging/     # 调试方法论
│       ├── test-driven-development/  # TDD 模式
│       ├── using-git-worktrees/      # Git worktree 用法
│       ├── using-superpowers/        # 超能力使用指南
│       ├── verification-before-completion/  # 验证模式
│       ├── writing-plans/            # 计划编写技术
│       └── writing-skills/           # 技能创建指南
│
├── rules/                     # AI 代理编码规则
│   ├── frontend/             # 前端开发规则
│   │   ├── uniapp/          # UniApp 跨平台开发
│   │   └── typescript/      # TypeScript 标准
│   │
│   ├── general/              # 通用编码规则
│   │   ├── clean-code/      # 整洁代码原则
│   │   ├── coding-standards/ # 编码标准
│   │   ├── git-workflow/    # Git 工作流规范
│   │   └── superpowers/     # AI 代理超能力规则
│   │
│   └── testing/              # 测试规则
│       ├── vitest/          # Vitest 单元测试
│       ├── playwright/      # Playwright E2E 测试
│       └── vue-test-utils/  # Vue 组件测试
│
├── workflows/                 # Windsurf Cascade 工作流
│   ├── brainstorm.md        # 头脑风暴工作流
│   ├── execute-plan.md      # 计划执行工作流
│   └── write-plan.md        # 计划编写工作流
│
└── README.md
```

## 使用方法

### 🌐 网页界面（推荐）

最简单的导出方式 - 可视化界面浏览和选择规则：

```bash
# 生成数据文件（首次运行或规则变更后执行）
node tools/generate-data.js

# 启动网页服务器
node tools/serve.js

# 在浏览器中打开 http://localhost:3000
```

功能特点：
- 按分类浏览所有规则和技能
- 选择单个项目或整个分类
- 导出为 Cursor、Windsurf、Markdown 或 JSON 格式
- 一键复制到剪贴板

### 💻 命令行工具

命令行使用方式：

```bash
# 列出所有可用规则
node tools/convert-rules.js --list

# 转换指定规则为 Cursor 格式
node tools/convert-rules.js -f cursor -r frontend/typescript,testing/vitest

# 转换所有规则为 Windsurf 格式并保存到文件
node tools/convert-rules.js -f windsurf --all -o my-rules.windsurfrules
```

**支持的格式：**
- `cursor` - Cursor IDE (.cursorrules)
- `windsurf` - Windsurf IDE (.windsurfrules)
- `windsurf-workflow` - Windsurf 工作流 (.md)
- `markdown` - 纯 Markdown (.md)
- `json` - JSON 格式 (.json)

### 手动使用 - Cursor IDE

1. 将本仓库克隆到本地
2. 在 Cursor 设置中，将 rules 文件夹路径添加到 "Rules for AI"
3. 使用 `@rules/frontend/typescript` 语法引用特定规则

### 在其他 AI 工具中使用

将相关规则内容复制到 AI 助手的系统提示词或上下文中。

### 技能格式

每个技能遵循以下结构：

```
skill-name/
├── SKILL.md           # 技能描述和使用指南
├── *-template.cs      # 带占位符的代码模板
└── examples/          # （可选）使用示例
```

### 规则格式

每个规则遵循以下结构：

```
rule-name/
└── RULE.md            # 规则描述，包含：
                       # - YAML 前置元数据（description, globs）
                       # - 指南和模式
                       # - 代码示例
                       # - 检查清单
```

## 贡献指南

### 添加新技能

1. 在 `skills/{framework}/{skill-name}/` 下创建新文件夹
2. 添加 `SKILL.md`：
   ```markdown
   ---
   name: skill-name
   description: 简要描述何时使用此技能
   ---
   
   # 技能标题
   
   ## 使用场景
   - 场景 1
   - 场景 2
   
   ## 必需步骤
   1. 步骤一
   2. 步骤二
   
   ## 模板文件
   - `template-name.cs` - 描述
   
   ## 验证清单
   - [ ] 检查项 1
   - [ ] 检查项 2
   ```
3. 添加模板文件，使用 `{EntityName}`、`{ServiceName}` 等占位符

### 添加新规则

1. 在 `rules/{category}/{rule-name}/` 下创建新文件夹
2. 添加 `RULE.md`：
   ```markdown
   ---
   description: 此规则适用的场景
   globs: "**/*.ts, **/*.vue"
   ---
   
   # 规则标题
   
   ## 指南
   - 指南 1
   - 指南 2
   
   ## 代码示例
   ```typescript
   // 正确示例
   ```
   
   ## 检查清单
   - [ ] 检查项 1
   ```

### 贡献规范

1. **保持规则简洁** - AI 代理在聚焦、可操作的规则下工作更好
2. **包含代码示例** - 展示正确和错误的模式
3. **添加检查清单** - 帮助验证规则合规性
4. **使用正确的 globs** - 指定规则适用的文件类型
5. **用 AI 测试** - 验证规则产生预期结果

## 许可证

MIT 许可证 - 可自由使用、修改和分发。

## 致谢

- [Anthropic Skills](https://github.com/anthropics/skills) - 技能格式灵感来源
- [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) - 社区 cursor 规则
- [ABP Framework](https://abp.io/) - 后端框架文档
- [Vben Admin](https://doc.vben.pro/) - 管理后台模板文档
- [UniApp](https://uniapp.dcloud.io/) - 跨平台框架文档
