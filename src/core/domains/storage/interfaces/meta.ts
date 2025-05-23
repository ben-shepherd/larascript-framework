export type S3UploadMeta = {
    Bucket: string
    ETag: string
    Key: string
    Location: string
    ServerSideEncryption: string
}

export type FileSystemMeta = {
    fullPath: string
}