import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import { app } from "@src/core/services/App";

export default class HelpCommand extends BaseCommand {

    signature: string = 'help';

    description = 'List all available commands';

    public keepProcessAlive = false;

    /**
     * Execute the command
     */
    async execute() {
        const registerService = app('console').registerService();

        this.input.clearScreen();
        this.input.writeLine('--- Available commands ---');
        this.input.writeLine();

        // Order commands by A-Z
        const commandConstructors = Array.from(registerService.getRegistered()).sort(([, a], [, b]) => {
            const aSignature = (new a).signature;
            const bSignature = (new b).signature;
            return aSignature.localeCompare(bSignature)
        });

        // List commands
        commandConstructors.forEach(([, command]) => {
            const signature = (new command).signature
            const description = (new command).description

            this.input.writeLine(`- ${signature}`);
            this.input.writeLine(`  ${description ?? 'No description available'}`);
            this.input.writeLine();
        });
    }

}