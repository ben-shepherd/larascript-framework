import fs from 'fs';
import path from 'path';

import StorageFile from "../data/StorageFile";
import FileNotFoundException from "../Exceptions/FileNotFoundException";
import { IGenericStorage } from "../interfaces/IGenericStorage";
import { storage } from './StorageService';

class FileSystemStorageService implements  IGenericStorage {

    async get(file: StorageFile): Promise<StorageFile> {
        return undefined as unknown as StorageFile
    }

    async put(file: StorageFile, destination: string): Promise<StorageFile> {

        // Get the full target path
        const targetPath = path.join(storage().getStorageDirectory(), destination)

        // Get the project root directory
        const currentFile = this.toAbsolutePath(file.getUrl())

        if(!fs.existsSync(currentFile)) {
            throw new FileNotFoundException()
        }

        fs.copyFileSync(currentFile, targetPath)
        fs.unlinkSync(currentFile)

        return new StorageFile({
            url: this.toRelativePath(targetPath)
        })
    }

    async delete(file: StorageFile): Promise<StorageFile> {
        return undefined as unknown as StorageFile
    }

    protected toRelativePath(path: string): string {
        return path.replace(storage().getStorageDirectory(), '')
    }

    protected toAbsolutePath(relativePath: string): string {
        return path.join(storage().getStorageDirectory(), relativePath)
    }

}

export default FileSystemStorageService;