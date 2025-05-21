import BaseProvider from "@src/core/base/Provider";
import StorageService from "@src/core/domains/storage/services/StorageService";

import FileSystemStorageService from "../services/FileSystemStorageService";

class StorageProvider extends BaseProvider {

    async register(): Promise<void> {
        
        const storage = new StorageService();
        storage.addAdapterOnce('fs', new FileSystemStorageService());

        this.bind('storage', storage);       
    }

}

export default StorageProvider;
