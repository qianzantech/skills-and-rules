#!/usr/bin/env node

/**
 * Rule Converter Tool
 * Converts selected rules to different AI IDE formats (Cursor, Windsurf, etc.)
 * 
 * Usage:
 *   node tools/convert-rules.js [options]
 *   node tools/convert-rules.js --format cursor --rules frontend/typescript,general/clean-code
 *   node tools/convert-rules.js --format windsurf --all
 *   node tools/convert-rules.js --list
 */

const fs = require('fs');
const path = require('path');

const RULES_DIR = path.join(__dirname, '..', 'rules');
const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const WORKFLOWS_DIR = path.join(__dirname, '..', 'workflows');
const OUTPUT_DIR = path.join(__dirname, '..', 'output');

// Supported output formats
const FORMATS = {
  cursor: {
    name: 'Cursor',
    extension: '.cursorrules',
    wrapper: (content, metadata) => content,
    separator: '\n\n---\n\n'
  },
  windsurf: {
    name: 'Windsurf',
    extension: '.windsurfrules', 
    wrapper: (content, metadata) => content,
    separator: '\n\n---\n\n'
  },
  'windsurf-workflow': {
    name: 'Windsurf Workflow',
    extension: '.md',
    wrapper: (content, metadata) => content,
    separator: '\n\n',
    isWorkflow: true
  },
  antigravity: {
    name: 'Antigravity',
    extension: '.md',
    wrapper: (content, metadata) => content,
    separator: '\n\n---\n\n'
  },
  markdown: {
    name: 'Markdown',
    extension: '.md',
    wrapper: (content, metadata) => content,
    separator: '\n\n---\n\n'
  },
  json: {
    name: 'JSON',
    extension: '.json',
    wrapper: (rules) => JSON.stringify({ rules }, null, 2),
    isJson: true
  }
};

/**
 * Recursively find all RULE.md files
 */
function findAllRules(dir, basePath = '') {
  const rules = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
    
    if (item.isDirectory()) {
      rules.push(...findAllRules(fullPath, relativePath));
    } else if (item.name === 'RULE.md') {
      const rulePath = basePath;
      rules.push({
        path: rulePath,
        fullPath: fullPath,
        category: basePath.split('/')[0],
        name: basePath.split('/').pop()
      });
    }
  }
  
  return rules;
}

/**
 * Parse RULE.md file and extract metadata and content
 */
function parseRule(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  let metadata = {};
  let bodyStart = 0;
  
  // Parse YAML frontmatter
  if (lines[0] === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---') {
        bodyStart = i + 1;
        break;
      }
      const match = lines[i].match(/^(\w+):\s*(.+)$/);
      if (match) {
        metadata[match[1]] = match[2].replace(/^["']|["']$/g, '');
      }
    }
  }
  
  const body = lines.slice(bodyStart).join('\n').trim();
  
  return { metadata, body, raw: content };
}

/**
 * Convert rules to specified format
 */
function convertRules(selectedRules, format) {
  const formatConfig = FORMATS[format];
  
  if (!formatConfig) {
    console.error(`Unknown format: ${format}`);
    console.error(`Available formats: ${Object.keys(FORMATS).join(', ')}`);
    process.exit(1);
  }
  
  if (formatConfig.isJson) {
    const rulesData = selectedRules.map(rule => {
      const { metadata, body } = parseRule(rule.fullPath);
      return {
        path: rule.path,
        category: rule.category,
        name: rule.name,
        description: metadata.description || '',
        globs: metadata.globs || '',
        content: body
      };
    });
    return formatConfig.wrapper(rulesData);
  }
  
  // For text-based formats
  const parts = selectedRules.map(rule => {
    const { metadata, body } = parseRule(rule.fullPath);
    const header = `# Rule: ${rule.path}\n# ${metadata.description || ''}\n`;
    return header + '\n' + body;
  });
  
  return parts.join(formatConfig.separator);
}

/**
 * List all available rules
 */
function listRules() {
  const rules = findAllRules(RULES_DIR);
  
  console.log('\n📚 Available Rules:\n');
  
  const byCategory = {};
  for (const rule of rules) {
    if (!byCategory[rule.category]) {
      byCategory[rule.category] = [];
    }
    byCategory[rule.category].push(rule);
  }
  
  for (const [category, categoryRules] of Object.entries(byCategory)) {
    console.log(`📁 ${category}/`);
    for (const rule of categoryRules) {
      const { metadata } = parseRule(rule.fullPath);
      console.log(`   └─ ${rule.name}`);
      if (metadata.description) {
        console.log(`      ${metadata.description.substring(0, 60)}...`);
      }
    }
    console.log('');
  }
  
  console.log(`Total: ${rules.length} rules\n`);
}

/**
 * Interactive rule selection (simple version)
 */
function selectRulesInteractive() {
  const rules = findAllRules(RULES_DIR);
  console.log('\n📚 Available rules (use --rules to select):\n');
  rules.forEach((rule, i) => {
    console.log(`  ${i + 1}. ${rule.path}`);
  });
  return rules;
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  // Parse arguments
  let format = 'cursor';
  let selectedRulePaths = [];
  let selectAll = false;
  let outputFile = null;
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--format':
      case '-f':
        format = args[++i];
        break;
      case '--rules':
      case '-r':
        selectedRulePaths = args[++i].split(',').map(r => r.trim());
        break;
      case '--all':
      case '-a':
        selectAll = true;
        break;
      case '--output':
      case '-o':
        outputFile = args[++i];
        break;
      case '--list':
      case '-l':
        listRules();
        return;
      case '--list-workflows':
      case '-lw':
        listWorkflows();
        return;
      case '--workflows':
      case '-w':
        exportWorkflows(args[++i], format);
        return;
      case '--list-skills':
      case '-ls':
        listSkills();
        return;
      case '--skills':
      case '-s':
        exportSkills(args[++i], format, outputFile);
        return;
      case '--help':
      case '-h':
        printHelp();
        return;
    }
  }
  
  // Find all rules
  const allRules = findAllRules(RULES_DIR);
  
  if (allRules.length === 0) {
    console.error('No rules found in rules directory');
    process.exit(1);
  }
  
  // Select rules
  let selectedRules;
  if (selectAll) {
    selectedRules = allRules;
  } else if (selectedRulePaths.length > 0) {
    selectedRules = allRules.filter(rule => 
      selectedRulePaths.some(p => rule.path.includes(p))
    );
    
    if (selectedRules.length === 0) {
      console.error('No matching rules found for:', selectedRulePaths.join(', '));
      console.log('\nUse --list to see available rules');
      process.exit(1);
    }
  } else {
    // Default: show help
    printHelp();
    console.log('\n📚 Available rules:\n');
    allRules.forEach(rule => console.log(`  - ${rule.path}`));
    return;
  }
  
  // Convert rules
  const output = convertRules(selectedRules, format);
  
  // Output
  if (outputFile) {
    // Ensure output directory exists
    const outputPath = path.isAbsolute(outputFile) 
      ? outputFile 
      : path.join(OUTPUT_DIR, outputFile);
    
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, output);
    console.log(`\n✅ Rules exported to: ${outputPath}`);
  } else {
    // Print to console with copy instruction
    console.log('\n' + '='.repeat(60));
    console.log('📋 COPY THE CONTENT BELOW:');
    console.log('='.repeat(60) + '\n');
    console.log(output);
    console.log('\n' + '='.repeat(60));
    console.log(`✅ ${selectedRules.length} rule(s) converted to ${FORMATS[format].name} format`);
    console.log('='.repeat(60) + '\n');
  }
}

/**
 * Find all workflow .md files
 */
function findAllWorkflows(dir, basePath = '') {
  const workflows = [];
  
  if (!fs.existsSync(dir)) {
    return workflows;
  }
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
    
    if (item.isDirectory()) {
      workflows.push(...findAllWorkflows(fullPath, relativePath));
    } else if (item.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');
      
      // Extract title from first H1
      let title = item.name.replace('.md', '');
      for (const line of lines) {
        if (line.startsWith('# ')) {
          title = line.substring(2).trim();
          break;
        }
      }
      
      workflows.push({
        path: relativePath,
        fullPath: fullPath,
        category: basePath.split('/')[0] || 'general',
        name: item.name.replace('.md', ''),
        title: title,
        content: content
      });
    }
  }
  
  return workflows;
}

/**
 * List all workflows
 */
function listWorkflows() {
  const workflows = findAllWorkflows(WORKFLOWS_DIR);
  
  console.log('\n🔄 Available Workflows:\n');
  
  const byCategory = {};
  for (const wf of workflows) {
    if (!byCategory[wf.category]) {
      byCategory[wf.category] = [];
    }
    byCategory[wf.category].push(wf);
  }
  
  for (const [category, categoryWorkflows] of Object.entries(byCategory)) {
    console.log(`📁 ${category}/`);
    for (const wf of categoryWorkflows) {
      console.log(`   └─ ${wf.name} - ${wf.title}`);
      console.log(`      Command: /${wf.name}`);
    }
    console.log('');
  }
  
  console.log(`Total: ${workflows.length} workflows\n`);
}

/**
 * Export workflows to Windsurf format
 */
function exportWorkflows(workflowPaths, format) {
  const allWorkflows = findAllWorkflows(WORKFLOWS_DIR);
  
  if (allWorkflows.length === 0) {
    console.error('No workflows found in workflows directory');
    process.exit(1);
  }
  
  let selectedWorkflows;
  if (workflowPaths === 'all') {
    selectedWorkflows = allWorkflows;
  } else {
    const paths = workflowPaths.split(',').map(p => p.trim());
    selectedWorkflows = allWorkflows.filter(wf => 
      paths.some(p => wf.path.includes(p) || wf.name.includes(p))
    );
  }
  
  if (selectedWorkflows.length === 0) {
    console.error('No matching workflows found');
    console.log('\nUse --list-workflows to see available workflows');
    process.exit(1);
  }
  
  console.log('\n🔄 Exporting Workflows for Windsurf:\n');
  console.log('Copy each workflow to: .windsurf/workflows/{name}.md\n');
  
  for (const wf of selectedWorkflows) {
    console.log('='.repeat(60));
    console.log(`📄 ${wf.name}.md (/${wf.name})`);
    console.log('='.repeat(60));
    console.log(wf.content);
    console.log('');
  }
  
  console.log(`\n✅ ${selectedWorkflows.length} workflow(s) exported`);
  console.log('\nTo use in Windsurf:');
  console.log('1. Create .windsurf/workflows/ directory in your project');
  console.log('2. Save each workflow as {name}.md');
  console.log('3. Invoke with /{name} command in Cascade');
}

/**
 * Find all SKILL.md files
 */
function findAllSkills(dir, basePath = '') {
  const skills = [];
  
  if (!fs.existsSync(dir)) {
    return skills;
  }
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
    
    if (item.isDirectory()) {
      skills.push(...findAllSkills(fullPath, relativePath));
    } else if (item.name === 'SKILL.md') {
      const parsed = parseRule(fullPath); // Reuse parseRule for SKILL.md
      
      skills.push({
        path: basePath,
        fullPath: fullPath,
        category: basePath.split('/')[0],
        name: basePath.split('/').pop(),
        content: parsed.body,  // Use 'body' not 'content'
        metadata: parsed.metadata
      });
    }
  }
  
  return skills;
}

/**
 * List all skills
 */
function listSkills() {
  const skills = findAllSkills(SKILLS_DIR);
  
  if (skills.length === 0) {
    console.log('No skills found');
    return;
  }
  
  console.log('\n🎯 Available Skills:\n');
  
  // Group by category
  const byCategory = {};
  for (const skill of skills) {
    if (!byCategory[skill.category]) {
      byCategory[skill.category] = [];
    }
    byCategory[skill.category].push(skill);
  }
  
  for (const category of Object.keys(byCategory).sort()) {
    console.log(`📁 ${category}/`);
    for (const skill of byCategory[category]) {
      const desc = skill.metadata.description ? ` - ${skill.metadata.description.substring(0, 50)}...` : '';
      console.log(`   └─ ${skill.name}${desc}`);
    }
    console.log('');
  }
  
  console.log(`Total: ${skills.length} skills`);
}

/**
 * Export skills
 */
function exportSkills(skillPaths, format, outputFile) {
  const allSkills = findAllSkills(SKILLS_DIR);
  
  if (allSkills.length === 0) {
    console.error('No skills found');
    process.exit(1);
  }
  
  let selectedSkills;
  if (skillPaths === 'all') {
    selectedSkills = allSkills;
  } else {
    const paths = skillPaths.split(',').map(p => p.trim());
    selectedSkills = allSkills.filter(skill => 
      paths.some(p => skill.path.includes(p) || skill.name.includes(p))
    );
    
    if (selectedSkills.length === 0) {
      console.error('No matching skills found for:', skillPaths);
      console.log('\nUse --list-skills to see available skills');
      process.exit(1);
    }
  }
  
  // Convert skills using the same format as rules
  const formatConfig = FORMATS[format] || FORMATS.markdown;
  
  let output;
  if (formatConfig.isJson) {
    output = JSON.stringify({ skills: selectedSkills.map(s => ({
      path: s.path,
      name: s.name,
      category: s.category,
      description: s.metadata.description,
      content: s.content
    })) }, null, 2);
  } else {
    output = selectedSkills.map(skill => {
      return `# ${skill.metadata.name || skill.name}\n\n${skill.content}`;
    }).join(formatConfig.separator);
  }
  
  if (outputFile) {
    const outputPath = path.isAbsolute(outputFile) 
      ? outputFile 
      : path.join(OUTPUT_DIR, outputFile);
    
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, output);
    console.log(`\n✅ ${selectedSkills.length} skill(s) exported to: ${outputPath}`);
  } else {
    console.log('\n' + '='.repeat(60));
    console.log('📋 COPY THE CONTENT BELOW:');
    console.log('='.repeat(60) + '\n');
    console.log(output);
    console.log('\n' + '='.repeat(60));
    console.log(`✅ ${selectedSkills.length} skill(s) converted to ${formatConfig.name} format`);
    console.log('='.repeat(60) + '\n');
  }
}

function printHelp() {
  console.log(`
📖 Rule, Skill & Workflow Converter Tool

Convert rules, skills, and workflows to different AI IDE formats.

Usage:
  node tools/convert-rules.js [options]

Options:
  -f, --format <format>   Output format: cursor, windsurf, markdown, json
                          (default: cursor)
  -r, --rules <rules>     Comma-separated rule paths to include
  -a, --all               Include all rules
  -s, --skills <skills>   Export skills (use 'all' for all, or comma-separated paths)
  -w, --workflows <paths> Export workflows (use 'all' for all, or comma-separated names)
  -o, --output <file>     Output to file instead of console
  -l, --list              List all available rules
  -ls, --list-skills      List all available skills
  -lw, --list-workflows   List all available workflows
  -h, --help              Show this help message

Examples:
  # List all available rules/skills/workflows
  node tools/convert-rules.js --list
  node tools/convert-rules.js --list-skills
  node tools/convert-rules.js --list-workflows

  # Export rules
  node tools/convert-rules.js -f windsurf --all -o my-rules.windsurfrules

  # Export skills
  node tools/convert-rules.js --skills all -o all-skills.md
  node tools/convert-rules.js --skills superpowers/brainstorming,superpowers/tdd

  # Export workflows
  node tools/convert-rules.js --workflows all

Supported Formats:
  cursor    - Cursor IDE (.cursorrules)
  windsurf  - Windsurf IDE (.windsurfrules)
  markdown  - Plain Markdown (.md)
  json      - JSON format (.json)
`);
}

main();
