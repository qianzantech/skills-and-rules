#!/usr/bin/env node

/**
 * HTTP server with export API for the rules exporter UI
 * Run: node tools/serve.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const TOOLS_DIR = __dirname;
const PROJECT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(PROJECT_DIR, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const FORMAT_CONFIG = {
  cursor: { 
    ext: '.mdc',
    rulesFolder: '.cursor/rules',
    skillsFolder: '.cursor/skills'
  },
  windsurf: { 
    ext: '.md',
    rulesFolder: '.windsurf/rules',
    skillsFolder: '.windsurf/skills'
  },
  markdown: { 
    ext: '.md',
    rulesFolder: 'rules',
    skillsFolder: 'skills'
  }
};

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

function exportItems(items, format) {
  const config = FORMAT_CONFIG[format] || FORMAT_CONFIG.markdown;
  const exportedFiles = [];
  
  for (const item of items) {
    // Determine if this is a rule or skill based on fullPath
    const isSkill = item.fullPath.startsWith('skills/');
    const baseFolder = isSkill ? config.skillsFolder : config.rulesFolder;
    
    // Flatten: use only the last folder name (item name)
    const itemName = item.name;
    const itemDir = path.join(DIST_DIR, baseFolder, itemName);
    
    fs.mkdirSync(itemDir, { recursive: true });
    
    // Export main file (SKILL.md or RULE.md)
    const origFilename = item.filename || (isSkill ? 'SKILL.md' : 'RULE.md');
    const newFilename = origFilename.replace('.md', config.ext);
    const filePath = path.join(itemDir, newFilename);
    
    let content = '';
    if (format === 'cursor') {
      content = `---\ndescription: ${item.description || ''}\nglobs: ${item.globs || ''}\n---\n\n${item.content}`;
    } else {
      content = item.content;
    }
    
    fs.writeFileSync(filePath, content);
    exportedFiles.push(path.relative(PROJECT_DIR, filePath));
    
    // Export additional files (templates, etc.)
    if (item.files && item.files.length > 0) {
      for (const file of item.files) {
        const templatePath = path.join(itemDir, file.name);
        fs.writeFileSync(templatePath, file.content);
        exportedFiles.push(path.relative(PROJECT_DIR, templatePath));
      }
    }
  }
  
  return exportedFiles;
}

function handleExportAPI(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const { rules, skills, format } = JSON.parse(body);
      
      cleanDir(DIST_DIR);
      
      const files = [];
      if (rules && rules.length > 0) {
        files.push(...exportItems(rules, format));
      }
      if (skills && skills.length > 0) {
        files.push(...exportItems(skills, format));
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, files }));
      
      console.log(`✅ Exported ${files.length} files to dist/`);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/export') {
    return handleExportAPI(req, res);
  }
  
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(TOOLS_DIR, filePath);
  
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'text/plain';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      res.end(err.code === 'ENOENT' ? 'Not found' : 'Server error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`
🚀 Rules Exporter UI is running!

   Open in browser: http://localhost:${PORT}
   
   Export destination: ${DIST_DIR}

   Press Ctrl+C to stop the server.
`);
});
