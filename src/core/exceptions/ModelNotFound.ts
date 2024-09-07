export default class ModelNotFound extends Error {

    constructor(message: string = 'Model not found') {
        super(message);
        this.name = 'ModelNotFound';
    }

}