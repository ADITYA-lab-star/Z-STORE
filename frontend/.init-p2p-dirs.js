const fs = require('fs');
const path = require('path');

// Get absolute path to frontend directory
const frontendPath = path.resolve(__dirname, '.');
const p2pPath = path.join(frontendPath, 'src', 'p2p');

// Create directory structure
const dirs = [
  path.join(p2pPath, 'utils'),
  path.join(p2pPath, 'hooks'),
  path.join(p2pPath, 'context')
];

console.log('Creating P2P module structure...');
console.log(`Base path: ${p2pPath}\n`);

dirs.forEach(dir => {
  try {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  } catch (err) {
    console.error(`✗ Failed to create ${dir}:`, err.message);
  }
});

console.log('\n✓ Directory structure created successfully');
process.exit(0);
