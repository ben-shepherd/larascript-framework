
import fs from 'fs';

import StorageFile from "../data/StorageFile";
import FileNotFoundException from "../Exceptions/FileNotFoundException";
import InvalidStorageFileException from "../Exceptions/InvalidStorageFileException";
import { FileSystemMeta } from '../interfaces/meta';
import { createFileSystemStorageFile, toAbsolutePath } from "../utils/StorageUtils";

class FileSystemStorageFileParser {

    /**
     * Parses the input and returns a StorageFile instance.
     * If the input is already a StorageFile, it is returned as-is.
     * If the input is a string, attempts to resolve it to a StorageFile.
     * @param {StorageFile | string} file - The file to parse, either as a StorageFile instance or a string path/key.
     * @returns {StorageFile} The resolved StorageFile instance.
     * @throws {InvalidStorageFileException} If the input type is not supported.
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