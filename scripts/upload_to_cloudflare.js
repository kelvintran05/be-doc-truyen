const fs = require('fs');
const path = require('path');

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const BUCKET_NAME = 'be-doc-truyen';

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error('Error: Please set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN environment variables.');
  process.exit(1);
}

const CDN_DIR = path.resolve(__dirname, '../backend/public/cdn');

function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    // Skip hidden files
    if (file.startsWith('._') || file.startsWith('.')) return;
    
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

// Map extensions to content types
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.webp': return 'image/webp';
    case '.svg': return 'image/svg+xml';
    case '.mp3': return 'audio/mpeg';
    case '.wav': return 'audio/wav';
    case '.ogg': return 'audio/ogg';
    case '.json': return 'application/json';
    default: return 'application/octet-stream';
  }
}

async function uploadFile(filePath) {
  const relativePath = path.relative(CDN_DIR, filePath);
  // Ensure forward slashes for Cloudflare object key
  const objectKey = relativePath.split(path.sep).join('/');
  
  const fileContent = fs.readFileSync(filePath);
  const contentType = getContentType(filePath);
  
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET_NAME}/objects/${encodeURIComponent(objectKey)}`;
  
  let attempts = 5;
  let delay = 1000;
  while (attempts > 0) {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': contentType,
        },
        body: fileContent
      });
      
      if (response.ok) {
        console.log(`[SUCCESS] Uploaded: ${objectKey}`);
        // Small throttle to avoid hitting the Cloudflare API rate limit too quickly
        await new Promise(resolve => setTimeout(resolve, 300));
        return true;
      } else if (response.status === 429) {
        console.warn(`[RATE LIMIT] Rate limited on ${objectKey}. Status 429. Sleeping for 6 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 6000));
      } else {
        const errText = await response.text();
        console.error(`[ERROR] Failed to upload ${objectKey}: Status ${response.status} - ${errText}`);
        if (response.status === 401 || response.status === 403) {
          // Authentication/permission issues: fail immediately
          return false;
        }
      }
    } catch (error) {
      console.error(`[ERROR] Network error uploading ${objectKey}:`, error.message);
    }
    attempts--;
    if (attempts > 0) {
      console.log(`[RETRY] Retrying upload for ${objectKey}... (${attempts} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 1.5;
    }
  }
  return false;
}

async function main() {
  if (!fs.existsSync(CDN_DIR)) {
    console.error(`Error: Local CDN directory not found at ${CDN_DIR}`);
    process.exit(1);
  }
  
  console.log(`Scanning directory: ${CDN_DIR}...`);
  const files = getFilesRecursively(CDN_DIR);
  console.log(`Found ${files.length} files to upload.`);
  
  let successCount = 0;
  let failureCount = 0;
  
  // Use a lower concurrency limit (2 instead of 5) to respect API rate limits
  const concurrencyLimit = 2;
  const queue = [...files];
  
  async function worker() {
    while (queue.length > 0) {
      const filePath = queue.shift();
      if (!filePath) continue;
      const success = await uploadFile(filePath);
      if (success) successCount++;
      else failureCount++;
    }
  }
  
  const workers = Array.from({ length: concurrencyLimit }, () => worker());
  await Promise.all(workers);
  
  console.log('\n--- Upload Completed ---');
  console.log(`Total files found: ${files.length}`);
  console.log(`Successfully uploaded: ${successCount}`);
  console.log(`Failed: ${failureCount}`);
  
  if (failureCount > 0) {
    process.exit(1);
  }
}

main();
