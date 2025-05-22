import { IStorageFile } from "./IStorageFile";

/* eslint-disable no-unused-vars */
export interface IGenericStorage {
    put(file: IStorageFile, destination: string): Promise<IStorageFile>;
    get(...args: unknown[]): Promise<IStorageFile>;
    delete(...args: unknown[]): Promise<void>;
}