
function generateRandomFileName(extension) {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${timestamp}_${randomString}${extension}`;
  }

module.exports = generateRandomFileName;