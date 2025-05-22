import BaseAdapter from "@src/core/base/BaseAdapter";
import StorageFile from "@src/core/domains/storage/data/StorageFile";
import { StorageTypes } from "@src/core/domains/storage/enums/StorageTypes";
import { IStorageService } from "@src/core/domains/storage/interfaces/IStorageService";
import { app } from "@src/core/services/App";
import fileUpload from 'express-fileupload';
import path from "path";

import { IGenericStorage } from "../interfaces/IGenericStorage";
import { StorageAdapters } from "../interfaces/StorageAdapters";
import { StorageConfig } from "../interfaces/StorageConfig";

/**
 * Helper function to get the storage service instance from the application container
 * @returns {StorageService} The storage service instance
 */
export const storage = () => app('storage');

class StorageService extends BaseAdapter<StorageAdapters> implements IStorageService {

    config!: StorageConfig;

    constructor(config: StorageConfig) {
        super()
        this.config = config
    }

    public getDefaultAdapter(): IGenericStorage {
        return this.getAdapter(this.config.driver) as IGenericStorage
    }

    public async put(file: StorageFile, destination: string): Promise<StorageFile> {
        return await this.getDefaultAdapter().put(file, destination)
    }

    public async get(file: StorageFile): Promise<StorageFile> {
        return undefined as unknown as StorageFile
    }

    public async delete(file: StorageFile): Promise<StorageFile> {
        return undefined as unknown as StorageFile
    }

    /**
     * Moves an uploaded file to a specified destination
     */
    public async moveUploadedFile(file: fileUpload.UploadedFile, destination?: string) {
        if(!destination) {
            destination = file.name
        }

        const filePath = path.join(this.getUploadsDirectory(), file.name);

        file.mv(filePath, (err) => {
            if(err) {
                throw new Error('File move error')
            }
        })

        const relativePath = filePath.replace(this.getStorageDirectory(), '')

        return new StorageFile({
            url: relativePath,
            source: StorageTypes.fs,
        })
    }

    public getStorageDirectory(): string {
        return path.join(process.cwd(), 'storage')
    }

    public getUploadsDirectory(): string {
        return path.join(this.getStorageDirectory(), 'uploads')
    }

}

export default StorageService;

