/* eslint-disable no-unused-vars */
import fileUpload from "express-fileupload";

import StorageFile from "../data/StorageFile";
import { IGenericStorage } from "./IGenericStorage";
import { IStorageFile } from "./IStorageFile";
import { FileSystemMeta } from "./meta";

export interface IStorageService extends IGenericStorage {
    driver(key: string): IGenericStorage
    moveUploadedFile(file: fileUpload.UploadedFile, destination?: string): Promise<IStorageFile>;
    getStorageDirectory(): string;
    getUploadsDirectory(): string;
    toStorageFile(fullPath: string): StorageFile<FileSystemMeta>;
}