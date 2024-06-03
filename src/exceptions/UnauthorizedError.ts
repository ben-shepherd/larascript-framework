// Create an Exception/Error class

export default class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnauthorizeError';
    }
}