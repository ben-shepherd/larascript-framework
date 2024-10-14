export default class UnexpectedAttributeError extends Error {

    constructor(message: string = 'Unexpected attribute') {
        super(message);
        this.name = 'UnexpectedAttributeError';
    }

}