const fs = require('fs');
const path = require('path');
const nextDir = path.resolve(__dirname, '..', '.next');
try {
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('✅ .next folder removed');
  } else {
    console.log('.next folder does not exist');
  }
} catch (err) {
  console.error('Error removing .next:', err);
}
