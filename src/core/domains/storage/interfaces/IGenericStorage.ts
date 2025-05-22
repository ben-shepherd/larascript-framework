import StorageFile from "../data/StorageFile";

/* eslint-disable no-unused-vars */
export interface IGenericStorage {
    put(file: StorageFile, destination: string): Promise<StorageFile>;
    get(...args: unknown[]): Promise<unknown>;
    delete(...args: unknown[]): Promise<unknown>;
}