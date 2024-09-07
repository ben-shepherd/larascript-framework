import { createHash } from 'crypto';
import { createReadStream } from 'fs';

const checksumFile = async (path: string, algorithm: string = 'sha256'): Promise<string> => {
    return new Promise((resolve, reject) => {
        const hash = createHash(algorithm);
        const stream = createReadStream(path);

        stream.on('error', (error) => {
            reject(error);
        });

        stream.on('data', (chunk) => {
            hash.update(chunk);
        });

        stream.on('end', () => {
            resolve(hash.digest('hex'));
        });
    });
};

export default checksumFile;