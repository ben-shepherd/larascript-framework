
/**
 * Storage configuration object
 * @typedef {Object} StorageConfig
 * @property {('fs'|'s3')} driver - The storage driver to use. Available options:
 *   - 'fs': File system storage driver
 *   - 's3': Amazon S3 storage driver
 */
export const config = {
    driver: process.env.STORAGE_DRIVER ?? 'fs',

    // todo
    // tempDir: path.join(process.cwd(), '../storage/tmp')
}

