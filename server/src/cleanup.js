
const fs = require('fs');
const path = require('path');

const FILE_TTL = 24 * 60 * 60 * 1000;

const CLEANUP_INTERVAL = 60 * 60 * 1000;

const directories = [
  path.join(__dirname, '../uploads'),
  path.join(__dirname, '../processed'),
];

async function cleanupDirectory(directory) {
  try {
    const files = await fs.promises.readdir(directory, {
      withFileTypes: true,
    });

    for (const file of files) {
      if (!file.isFile()) continue;

      const filePath = path.join(directory, file.name);
      const stats = await fs.promises.stat(filePath);

      const fileAge = Date.now() - stats.mtimeMs;

      if (fileAge > FILE_TTL) {
        await fs.promises.unlink(filePath);

        console.log(`Deleted expired file: ${file.name}`);
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Cleanup error:', error.message);
    }
  }
}

async function cleanupTemporaryFiles() {
  for (const directory of directories) {
    await cleanupDirectory(directory);
  }
}

function startCleanup() {
  cleanupTemporaryFiles();

  setInterval(cleanupTemporaryFiles, CLEANUP_INTERVAL);

  console.log('Temporary file cleanup is enabled.');
}

module.exports = { startCleanup };
