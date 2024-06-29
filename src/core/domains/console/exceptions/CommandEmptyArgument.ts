export default class CommandEmptyArgument extends Error {
    constructor(message: string = 'Command cannot contain empty arguments') {
        super(message);
        this.name = 'CommandEmptyArgument';
    }
}