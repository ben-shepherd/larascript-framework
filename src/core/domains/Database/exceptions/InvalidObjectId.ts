
export default class InvalidObjectId extends Error {
    constructor(message: string = 'Invalid ObjectId') {
        super(message);
        this.name = 'InvalidObjectId';
    }
}