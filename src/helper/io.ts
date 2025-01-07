import https from 'https';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const downloadFileToTemp = async (url: string, filename?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const tempDir = os.tmpdir();
    const tempFileName = filename || path.basename(url);
    const tempFilePath = path.join(tempDir, tempFileName);

    const file = fs.createWriteStream(tempFilePath);
    https
      .get(url, response => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to get file: ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on('finish', () => {
          file.close(() => resolve(tempFilePath)); // Close and resolve the path
        });
      })
      .on('error', err => {
        fs.unlink(tempFilePath, () => reject(err)); // Delete the file on error
      });

    file.on('error', err => {
      fs.unlink(tempFilePath, () => reject(err)); // Delete the file on error
    });
  });
};
