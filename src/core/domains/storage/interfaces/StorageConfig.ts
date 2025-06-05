
export interface StorageConfig {
    driver: string;
    storageDir: string;
    uploadsDir: string;
    s3: {
        accessKeyId: string
        secretAccessKey: string
        bucket: string
        region: string
    }
}