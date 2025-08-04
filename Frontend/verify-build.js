#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying build output...');

const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

// Check if dist directory exists
if (!fs.existsSync(distPath)) {
  console.error('❌ dist directory not found');
  process.exit(1);
}

// Check if index.html exists
if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found in dist directory');
  console.log('📁 Contents of dist directory:');
  try {
    const files = fs.readdirSync(distPath);
    files.forEach(file => {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      console.log(`  ${file} (${stats.isDirectory() ? 'dir' : 'file'})`);
    });
  } catch (error) {
    console.error('Error reading dist directory:', error.message);
  }
  process.exit(1);
}

// Check if index.html has content
const indexContent = fs.readFileSync(indexPath, 'utf8');
if (!indexContent.includes('<!DOCTYPE html>')) {
  console.error('❌ index.html does not contain valid HTML');
  process.exit(1);
}

// Check for assets directory
const assetsPath = path.join(distPath, 'assets');
if (!fs.existsSync(assetsPath)) {
  console.warn('⚠️ assets directory not found - this might be normal for some builds');
}

console.log('✅ Build verification successful');
console.log('📄 index.html found and contains valid HTML');
console.log('🎉 Build is ready for deployment'); 