export default class CommandRegisterException extends Error {

    constructor(name: string) {
        super(`Command '${name}' could not be registered. A command with the same signature may already exist.`);
        this.name = 'CommandRegisterException';
    }

}