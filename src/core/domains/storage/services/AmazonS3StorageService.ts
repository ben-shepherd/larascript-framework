import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

import StorageFile from "../data/StorageFile";
import { StorageTypes } from '../enums/StorageTypes';
import FileNotFoundException from "../Exceptions/FileNotFoundException";
import InvalidStorageFileException from '../Exceptions/InvalidStorageFileException';
import { IGenericStorage } from "../interfaces/IGenericStorage";
import { FileSystemMeta, S3Meta } from '../interfaces/meta';

/**
 * Configuration interface for Amazon S3 storage service
 */
type Config = {

    /** AWS access key ID */
    accessKeyId: string

    /** AWS secret access key */
    secretAccessKey: string

    /** S3 bucket name */
    bucket: string;

    /** AWS region */
    region: string;
}

/**
 * Service class for handling file storage operations with Amazon S3
 * Implements the IGenericStorage interface for consistent storage operations
 * 
 * @ref https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
 */
class AmazonS3StorageService implements IGenericStorage {

    /** Configuration object for AWS S3 */
    config!: Config;

    /**
     * Creates an instance of AmazonS3StorageService
     * @param config - Configuration object containing AWS credentials and bucket information
     */
    constructor(config: Config) {
        this.config = config
    }

    /**
     * Initializes and returns an AWS S3 client instance with configured credentials
     * @returns {AWS.S3} Configured AWS S3 client instance
     */
    protected getS3(): AWS.S3 {
        AWS.config.update({
            accessKeyId: this.config.accessKeyId,
            secretAccessKey: this.config.secretAccessKey,
            region: this.config.region
        })
        return new AWS.S3()
    }

    /**
     * Retrieves a file from S3 storage
     * @param file - StorageFile object containing file information
     * @returns Promise resolving to the retrieved StorageFile with presigned URL
     */
    async get(file: StorageFile | string): Promise<StorageFile<S3Meta>> {

        file = this.parseStorageFile(file)

        return new Promise((resolve, reject) => {
            const Key = file.getKey()
            const s3 = this.getS3()
            const params = {
                Bucket: this.config.bucket,
                Key
            }

            s3.getSignedUrl('getObject', params, (err, presignedUrl) => {
                if(err) {
                    reject(err)
                    return
                }
                
                resolve(
                    this.createStorageFile(Key, {
                        meta: { presignedUrl }
                    })
                )
            })
        })
    }

    /**
     * Uploads a file to S3 storage
     * @param file - StorageFile object containing the file to upload
     * @param destination - Optional custom destination path in S3 bucket. If not provided, generates a timestamp-based path
     * @returns Promise resolving to the uploaded StorageFile with S3 metadata
     * @throws {FileNotFoundException} When the source file does not exist
     */
    async put(file: StorageFile<FileSystemMeta>, destination?: string): Promise<StorageFile<S3Meta>> {

        if(!destination) {
            destination = `${(new Date().getTime().toString())}/${path.basename(file.getKey())}`
        }

        return new Promise((resolve, reject) => {

            const filePath = file.getMetaValue<string>('fullPath')

            if(!filePath) {
                throw new InvalidStorageFileException('fullPath not configured')
            }

            if (!fs.existsSync(filePath)) {
                throw new FileNotFoundException()
            }

            const s3 = this.getS3()
            const fileStream = fs.createReadStream(filePath)

            fileStream.on('error', (err) => {
                reject(err)
            })

            const params = {
                Bucket: this.config.bucket,
                Body: fs.createReadStream(filePath),
                Key: destination
            }

            s3.upload(params, (err, data) => {
                if (err) {
                    reject(err)
                    return;
                }
                if (data) {
                    const meta = data as S3Meta

                    if(!meta.Key) {
                        throw new InvalidStorageFileException('Expected meta.Key to be set')
                    }

                    resolve(
                        this.createStorageFile(meta.Key as string, {
                            meta
                        })
                    )
                }
            })
        })
    }

    /**
     * Deletes a file from S3 storage
     * @param file - StorageFile object containing the file to delete
     * @returns Promise that resolves when deletion is complete
     */
    async delete(file: StorageFile): Promise<void> {

        file = this.parseStorageFile(file)

        return new Promise((resolve, reject) => {
            const Key = file.getKey()
            const s3 = this.getS3()
            const params = {
                Bucket: this.config.bucket,
                Key
            }

            s3.deleteObject(params, (err) => {
                if(err) {
                    reject(err)
                    return
                }

                resolve()
            })
        })
    }

    /**
     * Parses the input and returns a StorageFile instance.
     * If the input is already a StorageFile, it is returned as-is.
     * If the input is a string, creates a new StorageFile instance with the given key.
     * @param {StorageFile | string} file - The file to parse, either as a StorageFile instance or a string key.
     * @returns {StorageFile} The resolved StorageFile instance.
     * @throws {InvalidStorageFileException} If the input type is not supported.
     */
    protected parseStorageFile(file: StorageFile | string): StorageFile {
        if(typeof file === 'object') {
            return file as StorageFile
        }

        if(typeof file === 'string') {
            return this.createStorageFile(file, {})
        }

        throw new InvalidStorageFileException('Unable to determine StorageFile from parameter. Expected object or string. Got: ' + typeof file)
    }

    /**
     * Creates a StorageFile instance with S3-specific metadata
     * @param options - Object containing file URL and metadata
     * @returns New StorageFile instance configured for S3 storage
     */
    protected createStorageFile(key: string, options) {
        return new StorageFile({
            ...options,
            key,
            source: StorageTypes.s3
        })
    }

}

export default AmazonS3StorageService;