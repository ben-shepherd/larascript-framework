import fs from 'fs';
import path from 'path';
import { TUploadedFile } from '@src/core/domains/http/interfaces/UploadedFile';
import StorageFile from "@src/core/domains/storage/data/StorageFile";
import FileNotFoundException from "@src/core/domains/storage/Exceptions/FileNotFoundException";
import InvalidStorageFileException from '@src/core/domains/storage/Exceptions/InvalidStorageFileException';
import { IGenericStorage } from "@src/core/domains/storage/interfaces/IGenericStorage";
import { FileSystemMeta } from '@src/core/domains/storage/interfaces/meta';
import FileSystemStorageFileParser from '@src/core/domains/storage/parser/FileSystemStorageFileParser';
import { createFileSystemStorageFile } from '@src/core/domains/storage/utils/StorageUtils';
import { storage } from '@src/core/domains/storage/services/StorageService';

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
     */
    public async moveUploadedFile(file: TUploadedFile, destination?: string) {

        if (!destination) {
            destination = file.getFilename()
        }

        const timestamp = (new Date()).getTime()
        const uploadsDir = storage().getUploadsDirectory()
        const targetDir = path.join(uploadsDir, timestamp.toString())
        const targetPath = path.join(targetDir, file.getFilename())

        if(!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir)
        }

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir)
        }

        fs.copyFileSync(file.getFilepath(), targetPath)
        fs.unlinkSync(file.getFilepath())

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

        if (!fs.existsSync(filePath)) {
            throw new FileNotFoundException()
        }

        fs.unlinkSync(filePath)
    }

}

export default FileSystemStorageService;