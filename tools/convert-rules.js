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

function printHelp() {
  console.log(`
📖 Rule Converter Tool

Convert rules to different AI IDE formats for easy copy-paste.

Usage:
  node tools/convert-rules.js [options]

Options:
  -f, --format <format>   Output format: cursor, windsurf, markdown, json
                          (default: cursor)
  -r, --rules <rules>     Comma-separated rule paths to include
                          Example: frontend/typescript,general/clean-code
  -a, --all               Include all rules
  -o, --output <file>     Output to file instead of console
  -l, --list              List all available rules
  -h, --help              Show this help message

Examples:
  # List all available rules
  node tools/convert-rules.js --list

  # Convert specific rules to Cursor format (print to console)
  node tools/convert-rules.js -f cursor -r frontend/typescript,testing/vitest

  # Convert all rules to Windsurf format and save to file
  node tools/convert-rules.js -f windsurf --all -o my-rules.windsurfrules

  # Convert all rules to JSON format
  node tools/convert-rules.js -f json --all -o rules.json

Supported Formats:
  cursor    - Cursor IDE (.cursorrules)
  windsurf  - Windsurf IDE (.windsurfrules)
  markdown  - Plain Markdown (.md)
  json      - JSON format (.json)
`);
}

main();
