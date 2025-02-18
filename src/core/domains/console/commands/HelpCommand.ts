import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import { App } from "@src/core/services/App";

export default class HelpCommand extends BaseCommand {

    signature: string = 'help';

    description = 'List all available commands';

    public keepProcessAlive = false;

    /**
     * Execute the command
     */
    async execute() {
        const console = App.container('console');
        const register = console.registerService();

        this.input.clearScreen();
        this.input.writeLine('--- Available commands ---');
        this.input.writeLine();

        // Order commands by A-Z
        const commadnConstructors = Array.from(register.getRegistered()).sort(([, a], [, b]) => {
            const aSignature = (new a).signature;
            const bSignature = (new b).signature;
            return aSignature.localeCompare(bSignature)
        });

        // List commands
        commadnConstructors.forEach(([, command]) => {
            const signature = (new command).signature
            const description = (new command).description

            this.input.writeLine(`- ${signature}`);
            this.input.writeLine(`  ${description ?? 'No description available'}`);
            this.input.writeLine();
        });
    }

}