
export default class MissingTable extends Error {
    constructor(message: string = 'Table name was not specified') {
        super(message);
        this.name = 'MissingTable';
    }
}