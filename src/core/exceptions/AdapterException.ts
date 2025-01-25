export default class AdapterException extends Error {

    constructor(message: string = 'Adapter Exception') {
        super(message);
        this.name = 'AdapterException';
    }

}