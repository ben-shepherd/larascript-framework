export default class ValidationError extends Error {
    constructor(message: string = 'Validation failed') {
        super(message);
        this.name = 'ValidationError';
    }
}