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
 * Returns items with full path from project root, including all sibling files
 */
function findFiles(rootDir, rootName) {
  const results = [];
  
  if (!fs.existsSync(rootDir)) {
    return results;
  }
  
  function traverse(dir, relativePath) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const itemRelPath = relativePath ? `${relativePath}/${item.name}` : item.name;
      
      if (item.isDirectory()) {
        traverse(fullPath, itemRelPath);
      } else if (item.name === 'RULE.md' || item.name === 'SKILL.md') {
        const { metadata, body } = parseMarkdownFile(fullPath);
        const pathParts = relativePath.split('/');
        
        // Get all files in this directory (templates, etc.)
        const siblingFiles = items
          .filter(f => !f.isDirectory() && f.name !== item.name)
          .map(f => ({
            name: f.name,
            content: fs.readFileSync(path.join(dir, f.name), 'utf-8')
          }));
        
        results.push({
          // Full path from project root
          fullPath: `${rootName}/${relativePath}`,
          // Original filename found
          filename: item.name,
          // Display name (last folder)
          name: pathParts[pathParts.length - 1],
          // Category for grouping
          category: pathParts[0],
          description: metadata.description || metadata.name || '',
          globs: metadata.globs || '',
          content: body,
          // Additional files in the same folder (templates, etc.)
          files: siblingFiles
        });
      }
    }
  }
  
  traverse(rootDir, '');
  return results;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Scanning for rules and skills...\n');
  
  // Find rules (pass root name for path prefix)
  const rules = findFiles(RULES_DIR, 'rules');
  console.log(`Found ${rules.length} rules:`);
  rules.forEach(r => console.log(`  - ${r.fullPath}`));
  
  // Find skills
  const skills = findFiles(SKILLS_DIR, 'skills');
  console.log(`\nFound ${skills.length} skills:`);
  skills.forEach(s => console.log(`  - ${s.fullPath}`));
  
  // Structure: separate rules and skills at top level
  const data = {
    rules: {},
    skills: {}
  };
  
  // Group rules by category
  for (const rule of rules) {
    if (!data.rules[rule.category]) {
      data.rules[rule.category] = [];
    }
    data.rules[rule.category].push(rule);
  }
  
  // Group skills by category
  for (const skill of skills) {
    if (!data.skills[skill.category]) {
      data.skills[skill.category] = [];
    }
    data.skills[skill.category].push(skill);
  }
  
  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`\n✅ Generated: ${OUTPUT_FILE}`);
  console.log(`\n📌 Total: ${rules.length} rules + ${skills.length} skills`);
}

main();
