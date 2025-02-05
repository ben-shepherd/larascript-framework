export default class RateLimitedExceededError extends Error {

    constructor(message: string = 'Too many requests. Try again later.') {
        super(message);
        this.name = 'RateLimitedExceededError';
    }

}