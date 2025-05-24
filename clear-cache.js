const fs = require('fs');
const path = require('path');

function deleteDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
        console.log(`Deleted: ${dirPath}`);
    } else {
        console.log(`Directory not found: ${dirPath}`);
    }
}

console.log('Clearing Next.js cache...');

// Delete .next directory
deleteDirectory('.next');

// Delete node_modules/.cache if it exists
deleteDirectory('node_modules/.cache');

console.log('Cache cleared! Now run: pnpm run build');
