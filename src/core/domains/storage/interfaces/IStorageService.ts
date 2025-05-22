/* eslint-disable no-unused-vars */
import fileUpload from "express-fileupload";

import { IGenericStorage } from "./IGenericStorage";
import { IStorageFile } from "./IStorageFile";

export interface IStorageService extends IGenericStorage {
    moveUploadedFile(file: fileUpload.UploadedFile, destination?: string): Promise<IStorageFile>;
    getStorageDirectory(): string;
    getUploadsDirectory(): string;
}