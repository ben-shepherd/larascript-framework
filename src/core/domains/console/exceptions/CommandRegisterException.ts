export default class CommandRegisterException extends Error {
    constructor(name: string) {
        super(`Command '${name}' could not be registered`);
        this.name = 'CommandRegisterException';
    }
}