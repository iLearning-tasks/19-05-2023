const fs = require('fs');
const crypto = require('crypto');

const folderPath = `${__dirname}/data`;
const myEmail = 'kolibri1108j@gmail.com'.toLowerCase();

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  const fileHashes = [];

  files.forEach(file => {
    const filePath = `${folderPath}/${file}`;

    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(`Error reading file ${filePath}:`, err);
        return;
      }

      const hash = crypto.createHash('sha3-256');
      hash.update(data);

      const fileHash = hash.digest('hex').toLowerCase();
      fileHashes.push(fileHash);

      // Check if all required files have been processed
      if (fileHashes.length === 256) {
        fileHashes.sort();

        const joinedHashes = fileHashes.join('');
        const concatenatedString = joinedHashes + myEmail;

        const finalHash = crypto.createHash('sha3-256').update(concatenatedString).digest('hex');
        console.log(`SHA3-256 hash of concatenated string: ${finalHash}`);
      }
    });
  });
});