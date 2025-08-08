import { BaseAdapterTypes } from "@ben-shepherd/larascript-core-bundle";

export interface StorageAdapters extends BaseAdapterTypes {
    fileSystem: unknown;
    s3: unknown;
}