export default class MockException extends Error {

    constructor(message: string = 'Mock Exception') {
        super(message);
        this.name = 'MockException';
    }

}