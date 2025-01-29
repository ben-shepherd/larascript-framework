class SecurityException extends Error {

    constructor(message: string) {
        super(message);
        this.name = 'SecurityException';
    }

}

export default SecurityException;