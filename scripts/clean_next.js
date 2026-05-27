const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', '.next');
try {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log('.next folder deleted successfully');
  } else {
    console.log('.next folder does not exist');
  }
} catch (err) {
  console.error('Error deleting .next folder:', err);
}
