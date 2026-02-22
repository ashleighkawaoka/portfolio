#!/usr/bin/env node

/**
 * Generate poster images from video files
 * Extracts the first frame from each video and saves as JPG
 * Usage: node scripts/generate-posters.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VIDEO_DIR = path.join(__dirname, '../public/videos');
const IMAGE_DIR = path.join(__dirname, '../public/images');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
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

function extractPosterFrame(videoPath) {
  // Get relative path from public/videos/
  const relativePath = path.relative(VIDEO_DIR, videoPath);
  const projectFolder = path.dirname(relativePath);
  const videoName = path.basename(relativePath, '.mp4');
  
  // Create corresponding poster path in images folder
  const posterDir = path.join(IMAGE_DIR, projectFolder);
  const posterPath = path.join(posterDir, `${videoName}-poster.jpg`);
  
  // Check if poster already exists
  if (fs.existsSync(posterPath)) {
    log(`  ⏭  Poster already exists: ${path.relative(process.cwd(), posterPath)}`, 'yellow');
    return posterPath;
  }
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(posterDir)) {
    fs.mkdirSync(posterDir, { recursive: true });
  }
  
  try {
    // Extract frame at 0.5 seconds (to avoid black frames at start)
    // -q:v 2 = high quality JPG
    execSync(
      `ffmpeg -ss 0.5 -i "${videoPath}" -vframes 1 -q:v 2 "${posterPath}" -y`,
      { stdio: 'pipe' }
    );
    
    log(`  ✓ Created: ${path.relative(process.cwd(), posterPath)}`, 'green');
    return posterPath;
  } catch (error) {
    log(`  ✗ Failed to create poster for: ${videoPath}`, 'red');
    return null;
  }
}

function main() {
  log('\n🎬 Video Poster Generator', 'blue');
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
  
  // Process each video
  let created = 0;
  let skipped = 0;
  let failed = 0;
  
  videoFiles.forEach((videoPath, index) => {
    const relativePath = path.relative(VIDEO_DIR, videoPath);
    log(`\n[${index + 1}/${videoFiles.length}] Processing: ${relativePath}`, 'blue');
    
    const result = extractPosterFrame(videoPath);
    if (result) {
      if (fs.existsSync(result) && fs.statSync(result).mtimeMs > Date.now() - 1000) {
        created++;
      } else {
        skipped++;
      }
    } else {
      failed++;
    }
  });
  
  // Summary
  log('\n═══════════════════════════════════════', 'blue');
  log('📊 Summary:', 'blue');
  log(`  ✓ Created: ${created}`, 'green');
  log(`  ⏭  Skipped: ${skipped}`, 'yellow');
  if (failed > 0) {
    log(`  ✗ Failed: ${failed}`, 'red');
  }
  log('═══════════════════════════════════════\n', 'blue');
  
  if (created > 0) {
    log('💡 Next step: Update your project data files to reference these poster images!', 'yellow');
    log('   Example: poster: "/images/project-name/video-1-poster.jpg"\n', 'yellow');
  }
}

main();
