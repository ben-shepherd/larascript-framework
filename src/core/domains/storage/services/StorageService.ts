import BaseAdapter from "@src/core/base/BaseAdapter";
import StorageFile from "@src/core/domains/storage/data/StorageFile";
import { StorageTypes } from "@src/core/domains/storage/enums/StorageTypes";
import { IStorageService } from "@src/core/domains/storage/interfaces/IStorageService";
import { app } from "@src/core/services/App";
import fileUpload from 'express-fileupload';
import path from "path";

import { IGenericStorage } from "../interfaces/IGenericStorage";
import { IStorageFile } from "../interfaces/IStorageFile";
import { StorageAdapters } from "../interfaces/StorageAdapters";
import { StorageConfig } from "../interfaces/StorageConfig";
import FileSystemStorageService from "./FileSystemStorageService";

/**
 * Helper function to get the storage service instance from the application container
 * @returns {StorageService} The storage service instance
 */
export const storage = () => app('storage');

/**
 * Service class for handling file storage operations
 * Implements various storage adapters and provides methods for file management
 */
class StorageService extends BaseAdapter<StorageAdapters> implements IStorageService {

    /** Configuration for the storage service */
    config!: StorageConfig;

    /**
     * Creates a new instance of StorageService
     * @param {StorageConfig} config - The storage configuration object
     */
    constructor(config: StorageConfig) {
        super()
        this.config = config
    }

    /**
     * Gets the default storage adapter based on the configured driver
     * @returns {IGenericStorage} The configured storage adapter instance
     */
    public getDefaultAdapter(): IGenericStorage {
        return this.getAdapter(this.config.driver) as IGenericStorage
    }

    /**
     * Gets the specified storage driver
     * @param key 
     * @returns 
     */
    public driver(key: string): IGenericStorage {
        if(!this.adapters[key]) {
            throw new Error('Invalid driver: '+key)
        }

        return this.adapters[key] as IGenericStorage
    }

    /**
     * Stores a file in the storage system
     * @param {StorageFile} file - The file to store
     * @param {string} destination - The destination path where the file should be stored
     * @returns {Promise<StorageFile>} The stored file information
     */
    public async put(file: StorageFile, destination: string): Promise<IStorageFile> {
        return await this.getDefaultAdapter().put(file, destination)
    }

    /**
     * Retrieves a file from the storage system
     * @param {StorageFile} file - The file to retrieve
     * @returns {Promise<StorageFile>} The retrieved file information
     */
    public async get(file: StorageFile): Promise<IStorageFile> {
        return await this.getDefaultAdapter().get(file)
    }

    /**
     * Deletes a file from the storage system
     * @param {StorageFile} file - The file to delete
     * @returns {Promise<void>}
     */
    public async delete(file: StorageFile): Promise<void> {
        await this.getDefaultAdapter().delete(file)
    }

    /**
     * Moves an uploaded file to a specified destination
     * @param {fileUpload.UploadedFile} file - The uploaded file to move
     * @param {string} [destination] - Optional destination path. If not provided, uses the original filename
     * @returns {Promise<StorageFile>} Information about the moved file
     * @throws {Error} If there is an error moving the file
     */
    public async moveUploadedFile(file: fileUpload.UploadedFile, destination?: string) {
        const fileStorage =  this.driver(StorageTypes.fs) as FileSystemStorageService
        return fileStorage.moveUploadedFile(file, destination)
    }

    /**
     * Gets the base storage directory path
     * @returns {string} The absolute path to the storage directory
     */
    public getStorageDirectory(): string {
        return path.join(process.cwd(), this.config.storageDir)
    }

    /**
     * Gets the uploads directory path
     * @returns {string} The absolute path to the uploads directory
     */
    public getUploadsDirectory(): string {
        return path.join(process.cwd(), this.config.uploadsDir)
    }

}

export default StorageService;

