import { StorageAdapters } from "@src/config/storage.config";
import BaseAdapter from "@src/core/base/BaseAdapter";
import { app } from "@src/core/services/App";
import fileUpload from 'express-fileupload';
import path from "path";
import StorageFile from "@src/core/domains/storage/data/StorageFile";
import { StorageTypes } from "@src/core/domains/storage/enums/StorageTypes";
import { IStorageService } from "@src/core/domains/storage/interfaces/IStorageService";

/**
 * Helper function to get the storage service instance from the application container
 * @returns {StorageService} The storage service instance
 */
export const storage = () => app('storage');

class StorageService extends BaseAdapter<StorageAdapters> implements IStorageService {

    /**
     * Moves an uploaded file to a specified destination
     */
    public async moveUploadedFile(file: fileUpload.UploadedFile, destination?: string) {
        if(!destination) {
            destination = file.name
        }

        const storageDir = path.join('@src/../storage', destination);
        const filePath = path.join(storageDir, file.name);

        file.mv(filePath, (err) => {
            throw new err
        })

        return new StorageFile({
            url: filePath,
            source: StorageTypes.fs,
        })
    }

}

export default StorageService;

