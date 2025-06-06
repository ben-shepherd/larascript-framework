/* eslint-disable no-unused-vars */
export interface IStorageFile {
    getKey(): string;
    getSource(): string | undefined;
    toObject(): object;
    getPresignedUrl(): string | undefined;
    getMetaValue<T>(key: string): T | undefined; 
}