const fs = require('fs');
const path = require('path');

const dirs = [
  'src/p2p/utils',
  'src/p2p/hooks',
  'src/p2p/context'
];

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created: ${fullPath}`);
  }
});

console.log('P2P directory structure created successfully');
