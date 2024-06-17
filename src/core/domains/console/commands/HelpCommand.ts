import { ICommand } from "@src/core/domains/console/interfaces/ICommand";

export default class HelpCommand implements ICommand {

    signature: string = 'help';

    async execute() {
        console.log('HelpCommand')
    }
}