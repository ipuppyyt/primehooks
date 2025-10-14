import fs from 'fs';
import path from 'path';

const src = path.resolve('dist/esm/index.d.ts');
const dest = path.resolve('dist/index.d.ts');

try {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('✅ Copied index.d.ts to dist/index.d.ts');
  } else {
    console.warn('⚠️ Type file not found at', src);
  }
} catch (err) {
  console.error('❌ Failed to copy types:', err);
  process.exit(1);
}