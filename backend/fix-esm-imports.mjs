import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

function walk(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

function resolveSpecifier(specifier, currentFilePath) {
  if (!specifier.startsWith('.')) return specifier;
  if (specifier.endsWith('.js') || specifier.endsWith('.mjs') || specifier.endsWith('.json')) {
    return specifier;
  }

  const currentDir = path.dirname(currentFilePath);
  const target = path.resolve(currentDir, specifier);

  if (fs.existsSync(target + '.js')) {
    return specifier + '.js';
  }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    if (fs.existsSync(path.join(target, 'index.js'))) {
      return specifier + '/index.js';
    }
  }
  return specifier + '.js';
}

function fixFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Regex for static import/export and dynamic imports
  // Matches: from "..." or from '...' or import("...") or import('...')
  const fixed = content.replace(
    /((?:from\s+|import\s*\(\s*)["'])([^"']+)(["']\s*\)?)/g,
    (match, prefix, specifier, suffix) => {
      const resolved = resolveSpecifier(specifier, filePath);
      return prefix + resolved + suffix;
    }
  );

  if (fixed !== content) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`Patched: ${path.relative(distDir, filePath)}`);
  }
}

const files = walk(distDir);
files.forEach(fixFile);
console.log(`Checked ${files.length} compiled files.`);
