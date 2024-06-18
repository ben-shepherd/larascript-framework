export default class CommandArguementParserException extends Error {
    constructor(message: string = 'Command Arguement Parser failed') {
        super(message);
        this.name = 'CommandArguementParserException';
    }
}