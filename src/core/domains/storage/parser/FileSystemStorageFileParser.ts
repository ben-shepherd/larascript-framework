
import fs from 'fs';

import StorageFile from "../data/StorageFile";
import FileNotFoundException from "../Exceptions/FileNotFoundException";
import InvalidStorageFileException from "../Exceptions/InvalidStorageFileException";
import { FileSystemMeta, S3Meta } from '../interfaces/meta';
import { storage } from '../services/StorageService';
import { createFileSystemStorageFile, toAbsolutePath } from "../utils/StorageUtils";

class FileSystemStorageFileParser {

    public parseStorageFileOrStringS3(file: StorageFile | string): StorageFile<S3Meta> {
        
        if (typeof file === 'object') {
            return file as StorageFile<S3Meta>
        }

        if (typeof file === 'string') {
            return storage().s3().createStorageFile(file, {})
        }

        throw new InvalidStorageFileException('Unable to determine type of StorageFile from parameter. Expected string or object. Got: ' + typeof file)
    }

    /**
     * Parses the input and returns a StorageFile instance.
     * If the input is already a StorageFile, it is returned as-is.
     * If the input is a string, attempts to resolve it to a StorageFile.
     */
    public parseStorageFileOrString(file: StorageFile | string): StorageFile<FileSystemMeta> {
        
        if (typeof file === 'object') {
            return file as StorageFile<FileSystemMeta>
        }

        if (typeof file === 'string') {
            return this.getStorageFileFromString(file)
        }

        throw new InvalidStorageFileException('Unable to determine type of StorageFile from parameter. Expected string or object. Got: ' + typeof file)
    }

    /**
     * Retrieves a StorageFile instance from a given file path string.
     * Attempts to resolve the file path as-is, and if not found, tries to resolve it as a relative path within the storage directory.
     * @param {string} file - The file path or key to resolve.
     * @returns {StorageFile<FileSystemMeta>} The corresponding StorageFile instance.
     * @throws {FileNotFoundException} If the file cannot be found at either path.
     * @protected
     */
    protected getStorageFileFromString(file: string) {
        
        if (fs.existsSync(file)) {
            return createFileSystemStorageFile(file)
        }

        const fullPath = toAbsolutePath(file)

        if (fs.existsSync(fullPath)) {
            return createFileSystemStorageFile(fullPath)
        }

        throw new FileNotFoundException('Unable to determine the correct file path for: ' + file)
    }


}

export default FileSystemStorageFileParser