export default class CommandExecutionException extends Error {
    constructor(message: string = 'Command failed to execute') {
        super(message);
        this.name = 'CommandNotFound';
    }
}