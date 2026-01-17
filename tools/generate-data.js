#!/usr/bin/env node

/**
 * Generate rules-data.json for the web UI
 * Run: node tools/generate-data.js
 */

const fs = require('fs');
const path = require('path');

const RULES_DIR = path.join(__dirname, '..', 'rules');
const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const WORKFLOWS_DIR = path.join(__dirname, '..', 'workflows');
const OUTPUT_FILE = path.join(__dirname, 'rules-data.json');

/**
 * Parse RULE.md or SKILL.md file
 */
function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  
  let metadata = {};
  let bodyStart = 0;
  
  // Parse YAML frontmatter
  if (lines[0].trim() === '---') {
    let currentKey = null;
    let currentValue = '';
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === '---') {
        // Save last key-value if exists
        if (currentKey) {
          metadata[currentKey] = currentValue.replace(/^["']|["']$/g, '').trim();
        }
        bodyStart = i + 1;
        break;
      }
      
      // Check if this is a new key
      const match = line.match(/^(\w+):\s*(.*)$/);
      if (match) {
        // Save previous key-value
        if (currentKey) {
          metadata[currentKey] = currentValue.replace(/^["']|["']$/g, '').trim();
        }
        currentKey = match[1];
        currentValue = match[2] || '';
      } else if (currentKey && line.startsWith('  ')) {
        // Continuation of previous value
        currentValue += ' ' + line.trim();
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
 * Find workflow .md files (workflows are stored as category/name.md)
 */
function findWorkflows(rootDir, rootName) {
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
      } else if (item.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');
        
        // Extract title from first H1 heading
        let title = item.name.replace('.md', '');
        for (const line of lines) {
          if (line.startsWith('# ')) {
            title = line.substring(2).trim();
            break;
          }
        }
        
        // Workflow name is filename without .md
        const workflowName = item.name.replace('.md', '');
        // Category is the parent folder
        const category = relativePath || 'general';
        
        results.push({
          fullPath: `${rootName}/${itemRelPath}`,
          filename: item.name,
          name: workflowName,
          title: title,
          category: category,
          description: title,
          content: content,
          // Windsurf workflow command name
          command: `/${workflowName}`
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
  
  // Find workflows (they are .md files directly, not WORKFLOW.md)
  const workflows = findWorkflows(WORKFLOWS_DIR, 'workflows');
  console.log(`\nFound ${workflows.length} workflows:`);
  workflows.forEach(w => console.log(`  - ${w.fullPath}`));
  
  // Structure: separate rules, skills, and workflows at top level
  const data = {
    rules: {},
    skills: {},
    workflows: {}
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
  
  // Group workflows by category
  for (const workflow of workflows) {
    if (!data.workflows[workflow.category]) {
      data.workflows[workflow.category] = [];
    }
    data.workflows[workflow.category].push(workflow);
  }
  
  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`\n✅ Generated: ${OUTPUT_FILE}`);
  console.log(`\n📌 Total: ${rules.length} rules + ${skills.length} skills + ${workflows.length} workflows`);
}

main();
