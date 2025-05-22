/* eslint-disable no-unused-vars */
import StorageFile from "@src/core/domains/storage/data/StorageFile";
import fileUpload from "express-fileupload";

import { IGenericStorage } from "./IGenericStorage";

export interface IStorageService extends IGenericStorage {
    moveUploadedFile(file: fileUpload.UploadedFile, destination?: string): Promise<StorageFile>;
    getStorageDirectory(): string;
    getUploadsDirectory(): string;
}