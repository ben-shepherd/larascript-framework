/* eslint-disable no-unused-vars */

import { TUploadedFile } from "@src/core/domains/http/interfaces/UploadedFile";
import StorageFile from "@src/core/domains/storage/data/StorageFile";
import AmazonS3StorageService from "@src/core/domains/storage/services/AmazonS3StorageService";
import FileSystemStorageService from "@src/core/domains/storage/services/FileSystemStorageService";
import { IGenericStorage } from "@src/core/domains/storage/interfaces/IGenericStorage";
import { IStorageFile } from "@src/core/domains/storage/interfaces/IStorageFile";
import { FileSystemMeta } from "@src/core/domains/storage/interfaces/meta";

export interface IStorageService extends IGenericStorage {
    driver(key: string): IGenericStorage
    moveUploadedFile(file: TUploadedFile, destination?: string): Promise<IStorageFile>;
    getStorageDirectory(): string;
    getUploadsDirectory(): string;
    toStorageFile(fullPath: string): StorageFile<FileSystemMeta>;
    s3(): AmazonS3StorageService;
    fileSystem(): FileSystemStorageService;
}