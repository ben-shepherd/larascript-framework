export interface IStorageFile {
    getUrl(): string;
    getSource(): string | undefined;
    toObject(): object;
}