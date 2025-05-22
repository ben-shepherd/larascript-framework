import StorageFile from "../data/StorageFile";
import { IGenericStorage } from "../interfaces/IGenericStorage";

class AmazonS3StorageService implements IGenericStorage {

    async get(file: StorageFile): Promise<StorageFile> {
        return undefined as unknown as StorageFile
    }

    async put(file: StorageFile, destination: string): Promise<StorageFile> {
        return undefined as unknown as StorageFile
    }

    async delete(file: StorageFile): Promise<StorageFile> {
        return undefined as unknown as StorageFile
    }
    
}

export default AmazonS3StorageService;