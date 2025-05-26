import { StorageConfig } from "@src/core/domains/storage/interfaces/StorageConfig";

/**
 * Storage configuration object
 * @typedef {Object} StorageConfig
 * @property {('fs'|'s3')} driver - The storage driver to use. Available options:
 *   - 'fs': File system storage driver
 *   - 's3': Amazon S3 storage driver
 */
export const config: StorageConfig = {
    driver: process.env.STORAGE_DRIVER ?? 'fs',
    storageDir: 'storage',
    uploadsDir: 'storage/uploads',
    s3: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
        bucket: process.env.S3_BUCKET ?? '',
        region: process.env.S3_REGION ?? ''
    }
} as  const

