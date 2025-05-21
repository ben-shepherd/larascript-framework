/* eslint-disable no-unused-vars */
import fileUpload from "express-fileupload";
import StorageFile from "@src/core/domains/storage/data/StorageFile";

export interface IStorageService {
    moveUploadedFile(file: fileUpload.UploadedFile, destination?: string): Promise<StorageFile>;
}