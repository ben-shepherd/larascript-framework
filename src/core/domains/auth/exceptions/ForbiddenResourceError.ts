export default class ForbiddenResourceError extends Error {

    constructor(message: string = 'You do not have permission to access this resource') {
        super(message);
        this.name = 'ForbiddenResourceError';
    }

}