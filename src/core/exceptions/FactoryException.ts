export default class FactoryException extends Error {

    constructor(message: string = 'Factory Exception') {
        super(message);
        this.name = 'FactoryException';
    }

}