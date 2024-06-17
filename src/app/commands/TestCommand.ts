import { ICommand } from "@src/core/domains/console/interfaces/ICommand";

export default class TestCommand implements ICommand {

    signature: string = 'test:command';

    async execute() {
        console.log('TestCommand')
    }
}