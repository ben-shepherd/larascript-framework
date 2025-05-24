import { IStorageFile } from "./IStorageFile";

/* eslint-disable no-unused-vars */
export interface IGenericStorage {
    put(file: IStorageFile | string, destination?: string): Promise<IStorageFile>;
    get(file: IStorageFile | string): Promise<IStorageFile>;
    delete(file: IStorageFile | string): Promise<void>;
}