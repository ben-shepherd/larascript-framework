import { IStorageFile } from "@src/core/domains/storage/interfaces/IStorageFile";

/* eslint-disable no-unused-vars */
export interface IGenericStorage {
    put(file: IStorageFile | string, destination?: string): Promise<IStorageFile>;
    get(file: IStorageFile | string, ...args: unknown[]): Promise<IStorageFile>;
    delete(file: IStorageFile | string): Promise<void>;
}