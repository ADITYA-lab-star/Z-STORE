const fs = require('fs');
const path = require('path');

const baseDir = './frontend/src/p2p';
const dirs = ['utils', 'hooks', 'context'];

// Create base directory structure
dirs.forEach(dir => {
  const fullPath = path.join(baseDir, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`✓ Created: ${fullPath}`);
});

// Create placeholder files
const typesDef = `// Types placeholder
export {};`;

const placeholders = [
  { path: path.join(baseDir, 'utils/types.ts'), content: typesDef },
  { path: path.join(baseDir, 'utils/constants.ts'), content: typesDef },
  { path: path.join(baseDir, 'utils/logger.ts'), content: typesDef },
  { path: path.join(baseDir, 'hooks/.gitkeep'), content: '' },
  { path: path.join(baseDir, 'context/.gitkeep'), content: '' }
];

placeholders.forEach(({ path: filePath, content }) => {
  fs.writeFileSync(filePath, content);
  console.log(`✓ Created: ${filePath}`);
});

console.log('\n✓ P2P module structure created successfully');
