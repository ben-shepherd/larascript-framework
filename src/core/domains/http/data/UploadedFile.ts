import fs from 'fs';
import { TUploadedFile, TUploadedFileData } from "@src/core/domains/http/interfaces/UploadedFile";

class UploadedFile implements TUploadedFile {

    data: TUploadedFileData;

    constructor(data: TUploadedFileData) {
        this.data = data
    }

    getFilename(): string {
        return this.data?.filename
    }

    getMimeType(): string {
        return this.data?.mimetype
    }

    getFilepath(): string {
        return this.data.file
    }

    getField(): string {
        return this.data.field
    }

    getSizeKb() {
        const stats = fs.statSync(this.getFilepath())
        const fileSizeInBytes = stats.size
        return fileSizeInBytes / 1024
    }

    getData<T>(): T {
        return this.data as T
    }

}

export default UploadedFile