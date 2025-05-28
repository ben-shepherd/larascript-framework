class BadResponseException extends Error {

    constructor(message: string) {
        super(message);
        this.name = 'BadResponseException';
    }

}

export default BadResponseException;