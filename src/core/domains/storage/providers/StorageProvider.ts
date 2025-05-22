import { config } from '@src/config/storage.config';
import BaseProvider from "@src/core/base/Provider";
import StorageService from "@src/core/domains/storage/services/StorageService";

import { StorageTypes } from "../enums/StorageTypes";
import AmazonS3StorageService from "../services/AmazonS3StorageService";
import FileSystemStorageService from "../services/FileSystemStorageService";

class StorageProvider extends BaseProvider {

    async register(): Promise<void> {
        
        const storage = new StorageService(config);
        storage.addAdapterOnce(StorageTypes.fs, new FileSystemStorageService());
        storage.addAdapterOnce(StorageTypes.s3, new AmazonS3StorageService());
        this.bind('storage', storage);       
    }

}

export default StorageProvider;
