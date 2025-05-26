export default class FileNotFoundException extends Error {

    constructor(message = 'File not found') {
        super(message)
        this.name = 'FileNotFoundException'
    }

}