
export default class InvalidDatabaseDriver extends Error {

    constructor(message: string = 'Invalid Database Driver') {
        super(message);
        this.name = 'InvalidDatabaseDriver';
    }

}