import path from 'path';

import StorageFile from '../data/StorageFile';
import { StorageTypes } from '../enums/StorageTypes';
import { FileSystemMeta } from '../interfaces/meta';
import { storage } from '../services/StorageService';

/**
 * Converts an absolute path to a relative path within the storage directory.
 * @param path - The absolute path to convert
 * @returns string - The relative path
 * @protected
 */
export const toRelativePath = (path: string): string => {
    return path.replace(storage().getStorageDirectory(), '')
}

/**
 * Converts a relative path to an absolute path within the storage directory.
 * @param relativePath - The relative path to convert
 * @returns string - The absolute path
 * @protected
 */
export const toAbsolutePath = (relativePath: string): string => {
    return path.join(storage().getStorageDirectory(), relativePath)
}


/**
 * Creates a storage file object
 * @param options 
 * @returns 
 */
export const createFileSystemStorageFile = (fullPath: string): StorageFile<FileSystemMeta> => {
    const key = toRelativePath(fullPath)

    return new StorageFile({
        key,
        meta: {
            fullPath,
        },
        source: StorageTypes.fs
    })
}