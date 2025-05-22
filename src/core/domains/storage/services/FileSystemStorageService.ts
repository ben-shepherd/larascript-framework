import fs from 'fs';
import path from 'path';

import StorageFile from "../data/StorageFile";
import FileNotFoundException from "../Exceptions/FileNotFoundException";
import { IGenericStorage } from "../interfaces/IGenericStorage";
import { storage } from './StorageService';

/**
 * Service for handling file system storage operations.
 * Implements the IGenericStorage interface to provide file system-based storage functionality.
 */
class FileSystemStorageService implements  IGenericStorage {

    /**
     * Retrieves a file from the storage system.
     * @param file - The StorageFile object containing the file information
     * @returns Promise<StorageFile> - A promise that resolves to the retrieved StorageFile
     * @throws {FileNotFoundException} When the file does not exist in the storage system
     */
    async get(file: StorageFile): Promise<StorageFile> {
        const filePath = this.toAbsolutePath(file.getUrl())

        if(!fs.existsSync(filePath)) {
            throw new FileNotFoundException()
        }

        return new StorageFile({
            url: filePath
        })
    }

    /**
     * Moves a file to a new destination within the storage system.
     * @param file - The StorageFile object to be moved
     * @param destination - The target path where the file should be moved to
     * @returns Promise<StorageFile> - A promise that resolves to the new StorageFile at the destination
     * @throws {FileNotFoundException} When the source file does not exist
     */
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

    /**
     * Deletes a file from the storage system.
     * @param file - The StorageFile object to be deleted
     * @returns Promise<void>
     * @throws {FileNotFoundException} When the file does not exist in the storage system
     */
    async delete(file: StorageFile): Promise<void> {

        if(fs.existsSync(file.getUrl())) {
            fs.unlinkSync(file.getUrl())
            return;
        }

        const filePath = this.toAbsolutePath(file.getUrl())

        if(fs.existsSync(filePath)) {
            throw new FileNotFoundException()
        }

        fs.unlinkSync(filePath)
    }

    /**
     * Converts an absolute path to a relative path within the storage directory.
     * @param path - The absolute path to convert
     * @returns string - The relative path
     * @protected
     */
    protected toRelativePath(path: string): string {
        return path.replace(storage().getStorageDirectory(), '')
    }

    /**
     * Converts a relative path to an absolute path within the storage directory.
     * @param relativePath - The relative path to convert
     * @returns string - The absolute path
     * @protected
     */
    protected toAbsolutePath(relativePath: string): string {
        return path.join(storage().getStorageDirectory(), relativePath)
    }

}

export default FileSystemStorageService;