import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';

import StorageFile from "../data/StorageFile";
import { StorageTypes } from '../enums/StorageTypes';
import FileNotFoundException from "../Exceptions/FileNotFoundException";
import InvalidStorageFileException from '../Exceptions/InvalidStorageFileException';
import { IGenericStorage } from "../interfaces/IGenericStorage";
import { FileSystemMeta } from '../interfaces/meta';
import { storage } from './StorageService';

/**
 * Service for handling file system storage operations.
 * Implements the IGenericStorage interface to provide file system-based storage functionality.
 */
class FileSystemStorageService implements IGenericStorage {

    /**
     * Moves an uploaded file to a specified destination
     * @param {fileUpload.UploadedFile} file - The uploaded file to move
     * @param {string} [destination] - Optional destination path. If not provided, uses the original filename
     * @returns {Promise<StorageFile>} Information about the moved file
     * @throws {Error} If there is an error moving the file
     */
    public async moveUploadedFile(file: fileUpload.UploadedFile, destination?: string) {

        if (!destination) {
            destination = file.name
        }

        const timestamp = (new Date()).getTime()
        const targetDir = path.join(storage().getUploadsDirectory(), timestamp.toString())
        const targetPath = path.join(targetDir, file.name)

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir)
        }

        file.mv(targetPath, (err) => {
            if (err) {
                throw new Error('File move error')
            }
        })

        return this.createStorageFile(targetPath)
    }


    /**
     * Retrieves a file from the storage system.
     * @param file - The StorageFile object containing the file information
     * @returns Promise<StorageFile> - A promise that resolves to the retrieved StorageFile
     * @throws {FileNotFoundException} When the file does not exist in the storage system
     */
    async get(file: StorageFile | string): Promise<StorageFile<FileSystemMeta>> {

        file = this.parseStorageFile(file)

        const filePath = file.getMetaValue<string>('fullPath')

        if (!filePath) {
            throw new InvalidStorageFileException('fullPath not configured')
        }

        if (!fs.existsSync(filePath)) {
            throw new FileNotFoundException()
        }

        return this.createStorageFile(filePath)
    }

    /**
     * Moves a file to a new destination within the storage system.
     * @param file - The StorageFile object to be moved
     * @param destination - The target path where the file should be moved to
     * @returns Promise<StorageFile> - A promise that resolves to the new StorageFile at the destination
     * @throws {FileNotFoundException} When the source file does not exist
     */
    async put(file: StorageFile<FileSystemMeta>, destination: string): Promise<StorageFile<FileSystemMeta>> {

        // Get the full target path
        const targetPath = path.join(storage().getStorageDirectory(), destination)

        // Get the project root directory
        const currentFile = file.getMetaValue<string>('fullPath')

        if (!currentFile) {
            throw new InvalidStorageFileException('fullPath not configured')
        }

        if (!fs.existsSync(currentFile)) {
            throw new FileNotFoundException()
        }

        fs.copyFileSync(currentFile, targetPath)
        fs.unlinkSync(currentFile)

        return this.createStorageFile(targetPath)
    }

    /**
     * Deletes a file from the storage system.
     * @param file - The StorageFile object to be deleted
     * @returns Promise<void>
     * @throws {FileNotFoundException} When the file does not exist in the storage system
     */
    async delete(file: StorageFile | string): Promise<void> {

        file = this.parseStorageFile(file)

        const filePath = file.getMetaValue<string>('fullPath')

        if (!filePath) {
            throw new InvalidStorageFileException('fullPath not configured')
        }

        if (fs.existsSync(filePath)) {
            throw new FileNotFoundException()
        }

        fs.unlinkSync(filePath)
    }

    /**
     * Parses the input and returns a StorageFile instance.
     * If the input is already a StorageFile, it is returned as-is.
     * If the input is a string, attempts to resolve it to a StorageFile.
     * @param {StorageFile | string} file - The file to parse, either as a StorageFile instance or a string path/key.
     * @returns {StorageFile} The resolved StorageFile instance.
     * @throws {InvalidStorageFileException} If the input type is not supported.
     */
    protected parseStorageFile(file: StorageFile | string): StorageFile {
        if(typeof file === 'object') {
            return file as StorageFile
        }

        if(typeof file === 'string') {
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
        if(fs.existsSync(file)) {
            return this.createStorageFile(file)
        }

        const fullPath = this.toAbsolutePath(file)

        if(fs.existsSync(fullPath)) {
            return this.createStorageFile(fullPath)
        }

        throw new FileNotFoundException('Unable to determine the correct file path for: ' + file)
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

    /**
     * Creates a storage file object
     * @param options 
     * @returns 
     */
    protected createStorageFile(fullPath: string): StorageFile<FileSystemMeta> {
        const key = this.toRelativePath(fullPath)

        return new StorageFile({
            key,
            meta: {
                fullPath,
            },
            source: StorageTypes.fs
        })
    }

}

export default FileSystemStorageService;