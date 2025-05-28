/* eslint-disable no-unused-vars */

import { TUploadedFile } from "../../http/interfaces/UploadedFile";
import StorageFile from "../data/StorageFile";
import AmazonS3StorageService from "../services/AmazonS3StorageService";
import FileSystemStorageService from "../services/FileSystemStorageService";
import { IGenericStorage } from "./IGenericStorage";
import { IStorageFile } from "./IStorageFile";
import { FileSystemMeta } from "./meta";

export interface IStorageService extends IGenericStorage {
    driver(key: string): IGenericStorage
    moveUploadedFile(file: TUploadedFile, destination?: string): Promise<IStorageFile>;
    getStorageDirectory(): string;
    getUploadsDirectory(): string;
    toStorageFile(fullPath: string): StorageFile<FileSystemMeta>;
    s3(): AmazonS3StorageService;
    fileSystem(): FileSystemStorageService;
}