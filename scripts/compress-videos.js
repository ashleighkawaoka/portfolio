#!/usr/bin/env node

/**
 * Compress video files using FFmpeg
 * Reduces file sizes by 50-70% while maintaining visual quality
 * Usage: node scripts/compress-videos.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VIDEO_DIR = path.join(__dirname, '../public/videos');
const BACKUP_DIR = path.join(__dirname, '../public/videos-backup');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFFmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function getAllVideoFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllVideoFiles(filePath, fileList);
    } else if (file.endsWith('.mp4')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function compressVideo(videoPath) {
  const stat = fs.statSync(videoPath);
  const originalSize = stat.size;
  
  // Create backup directory structure
  const relativePath = path.relative(VIDEO_DIR, videoPath);
  const backupPath = path.join(BACKUP_DIR, relativePath);
  const backupDir = path.dirname(backupPath);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Backup original if not already backed up
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(videoPath, backupPath);
    log(`  📦 Backed up original to: ${path.relative(process.cwd(), backupPath)}`, 'cyan');
  }
  
  // Create temp output path
  const tempPath = videoPath.replace('.mp4', '.temp.mp4');
  
  try {
    // Compress using H.264 with CRF 23 (good quality, smaller size)
    // -crf 23: Constant Rate Factor (lower = better quality, 18-28 is good range)
    // -preset medium: Encoding speed (slower = smaller file)
    // -movflags +faststart: Enable streaming (metadata at start)
    execSync(
      `ffmpeg -i "${videoPath}" -vcodec libx264 -crf 23 -preset medium -movflags +faststart -an "${tempPath}" -y`,
      { stdio: 'pipe' }
    );
    
    // Replace original with compressed version
    fs.unlinkSync(videoPath);
    fs.renameSync(tempPath, videoPath);
    
    const newStat = fs.statSync(videoPath);
    const newSize = newStat.size;
    const savings = originalSize - newSize;
    const percent = Math.round((savings / originalSize) * 100);
    
    log(`  ✓ Compressed: ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${percent}% smaller)`, 'green');
    
    return { originalSize, newSize, savings };
  } catch (error) {
    log(`  ✗ Failed to compress: ${videoPath}`, 'red');
    // Clean up temp file if it exists
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    return null;
  }
}

function main() {
  log('\n🎬 Video Compression Tool', 'blue');
  log('═══════════════════════════════════════\n', 'blue');
  
  // Check if ffmpeg is installed
  if (!checkFFmpeg()) {
    log('❌ Error: FFmpeg is not installed!', 'red');
    log('\nInstall it with:', 'yellow');
    log('  macOS: brew install ffmpeg', 'yellow');
    log('  Linux: apt-get install ffmpeg', 'yellow');
    log('  Windows: choco install ffmpeg\n', 'yellow');
    process.exit(1);
  }
  
  log('✓ FFmpeg found\n', 'green');
  
  // Check if video directory exists
  if (!fs.existsSync(VIDEO_DIR)) {
    log(`❌ Video directory not found: ${VIDEO_DIR}`, 'red');
    process.exit(1);
  }
  
  // Get all video files
  const videoFiles = getAllVideoFiles(VIDEO_DIR);
  
  if (videoFiles.length === 0) {
    log('No video files found!', 'yellow');
    process.exit(0);
  }
  
  log(`Found ${videoFiles.length} video file(s)\n`, 'blue');
  log('⚠️  Original videos will be backed up to public/videos-backup/', 'yellow');
  log('⏱️  This may take a few minutes...\n', 'yellow');
  
  // Process each video
  let totalOriginal = 0;
  let totalNew = 0;
  let compressed = 0;
  let failed = 0;
  
  videoFiles.forEach((videoPath, index) => {
    const relativePath = path.relative(VIDEO_DIR, videoPath);
    log(`\n[${index + 1}/${videoFiles.length}] Processing: ${relativePath}`, 'blue');
    
    const result = compressVideo(videoPath);
    if (result) {
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      compressed++;
    } else {
      failed++;
    }
  });
  
  // Summary
  const totalSavings = totalOriginal - totalNew;
  const totalPercent = totalOriginal > 0 ? Math.round((totalSavings / totalOriginal) * 100) : 0;
  
  log('\n═══════════════════════════════════════', 'blue');
  log('📊 Summary:', 'blue');
  log(`  ✓ Compressed: ${compressed}`, 'green');
  if (failed > 0) {
    log(`  ✗ Failed: ${failed}`, 'red');
  }
  log(`\n  Original size: ${formatBytes(totalOriginal)}`, 'cyan');
  log(`  New size: ${formatBytes(totalNew)}`, 'cyan');
  log(`  Total savings: ${formatBytes(totalSavings)} (${totalPercent}% reduction)`, 'green');
  log('═══════════════════════════════════════\n', 'blue');
  
  if (compressed > 0) {
    log('✅ Compression complete! Your videos are now optimized.', 'green');
    log('💡 Original files are saved in public/videos-backup/', 'yellow');
    log('🔄 Refresh your browser to see the improvements!\n', 'yellow');
  }
}

main();
