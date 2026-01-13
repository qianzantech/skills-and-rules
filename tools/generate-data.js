#!/usr/bin/env node

/**
 * Generate rules-data.json for the web UI
 * Run: node tools/generate-data.js
 */

const fs = require('fs');
const path = require('path');

const RULES_DIR = path.join(__dirname, '..', 'rules');
const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const OUTPUT_FILE = path.join(__dirname, 'rules-data.json');

/**
 * Parse RULE.md or SKILL.md file
 */
function parseMarkdownFile(filePath) {
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
  
  return { metadata, body };
}

/**
 * Recursively find all RULE.md or SKILL.md files
 */
function findFiles(dir, filename, basePath = '') {
  const results = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
    
    if (item.isDirectory()) {
      results.push(...findFiles(fullPath, filename, relativePath));
    } else if (item.name === filename) {
      const { metadata, body } = parseMarkdownFile(fullPath);
      results.push({
        path: basePath,
        name: basePath.split('/').pop(),
        category: basePath.split('/')[0],
        description: metadata.description || metadata.name || '',
        globs: metadata.globs || '',
        content: body
      });
    }
  }
  
  return results;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Scanning for rules and skills...\n');
  
  // Find rules
  const rules = findFiles(RULES_DIR, 'RULE.md');
  console.log(`Found ${rules.length} rules:`);
  rules.forEach(r => console.log(`  - ${r.path}`));
  
  // Find skills
  const skills = findFiles(SKILLS_DIR, 'SKILL.md');
  console.log(`\nFound ${skills.length} skills:`);
  skills.forEach(s => console.log(`  - ${s.path}`));
  
  // Group by category
  const data = {};
  
  // Group rules
  for (const rule of rules) {
    const category = rule.category;
    if (!data[category]) {
      data[category] = [];
    }
    data[category].push(rule);
  }
  
  // Add skills as a separate category
  if (skills.length > 0) {
    data['skills'] = skills.map(s => ({
      ...s,
      path: `skills/${s.path}`
    }));
  }
  
  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`\n✅ Generated: ${OUTPUT_FILE}`);
  console.log(`\n📌 Total: ${rules.length} rules + ${skills.length} skills`);
}

main();
