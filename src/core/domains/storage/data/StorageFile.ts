import { IStorageFile } from "../interfaces/IStorageFile";

/**
 * Configuration options for creating a StorageFile instance
 */
type Options = {

    /** The URL where the file can be accessed */
    url: string;

    /** Optional source identifier or path of the file */
    source?: string;
}

/**
 * Represents a file stored in the storage system with its URL and source information.
 */
class StorageFile implements IStorageFile {

    /** The URL where the file can be accessed */
    url: string;

    /** The source identifier or path of the file */
    source!: string | undefined;

    /**
     * Creates a new StorageFile instance
     * @param options - Configuration options for the storage file
     */
    constructor(options: Options) {
        this.url = options?.url
        this.source = options?.source
    }

    /**
     * Sets the URL for the storage file
     * @param url - The URL where the file can be accessed
     * @returns The current StorageFile instance for method chaining
     */
    setUrl(url: string) {
        this.url = url;
        return this
    }

    /**
     * Gets the URL of the storage file
     * @returns The URL where the file can be accessed
     */
    getUrl(): string {
        return this.url
    }

    /**
     * Sets the source identifier for the storage file
     * @param source - The source identifier or path of the file
     * @returns The current StorageFile instance for method chaining
     */
    setSource(source: string) {
        this.source = source
        return this
    }

    /**
     * Gets the source identifier of the storage file
     * @returns The source identifier or path of the file, or undefined if not set
     */
    getSource(): string | undefined {
        return this.source
    }

    /**
     * Converts the StorageFile instance to a plain object representation.
     * @returns An object containing the url and source of the storage file.
     */
    toObject(): Options {
        return {
            url: this.url,
            source: this.source
        }
    }

}

export default StorageFile