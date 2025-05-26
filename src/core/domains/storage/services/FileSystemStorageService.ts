import fileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';

import StorageFile from "../data/StorageFile";
import FileNotFoundException from "../Exceptions/FileNotFoundException";
import InvalidStorageFileException from '../Exceptions/InvalidStorageFileException';
import { IGenericStorage } from "../interfaces/IGenericStorage";
import { FileSystemMeta } from '../interfaces/meta';
import FileSystemStorageFileParser from '../parser/FileSystemStorageFileParser';
import { createFileSystemStorageFile } from '../utils/StorageUtils';
import { storage } from './StorageService';

/**
 * Service for handling file system storage operations.
 * Implements the IGenericStorage interface to provide file system-based storage functionality.
 */
class FileSystemStorageService implements IGenericStorage {

    /**
     * Helper to determine the StorageFile from an object or string parameter
     */
    parser = new FileSystemStorageFileParser()

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

        return createFileSystemStorageFile(targetPath)
    }


    /**
     * Retrieves a file from the storage system.
     * @param file - The StorageFile object containing the file information
     * @returns Promise<StorageFile> - A promise that resolves to the retrieved StorageFile
     * @throws {FileNotFoundException} When the file does not exist in the storage system
     */
    async get(file: StorageFile | string): Promise<StorageFile<FileSystemMeta>> {

        file = this.parser.parseStorageFileOrString(file)

        const filePath = file.getMetaValue<string>('fullPath')

        if (!filePath) {
            throw new InvalidStorageFileException('fullPath not configured')
        }

        if (!fs.existsSync(filePath)) {
            throw new FileNotFoundException()
        }

        return createFileSystemStorageFile(filePath)
    }

    /**
     * Moves a file to a new destination within the storage system.
     * @param file - The StorageFile object to be moved
     * @param destination - The target path where the file should be moved to
     * @returns Promise<StorageFile> - A promise that resolves to the new StorageFile at the destination
     * @throws {FileNotFoundException} When the source file does not exist
     */
    async put(file: StorageFile<FileSystemMeta> | string, destination: string): Promise<StorageFile<FileSystemMeta>> {

        file = this.parser.parseStorageFileOrString(file) as StorageFile<FileSystemMeta>

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

        return createFileSystemStorageFile(targetPath)
    }

    /**
     * Deletes a file from the storage system.
     * @param file - The StorageFile object to be deleted
     * @returns Promise<void>
     * @throws {FileNotFoundException} When the file does not exist in the storage system
     */
    async delete(file: StorageFile | string): Promise<void> {

        file = this.parser.parseStorageFileOrString(file)

        const filePath = file.getMetaValue<string>('fullPath')

        if (!filePath) {
            throw new InvalidStorageFileException('fullPath not configured')
        }

        if (fs.existsSync(filePath)) {
            throw new FileNotFoundException()
        }

        fs.unlinkSync(filePath)
    }

}

export default FileSystemStorageService;