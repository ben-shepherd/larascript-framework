import BaseCommand from "@src/core/domains/console/base/BaseCommand";
import { App } from "@src/core/services/App";
import readline from 'node:readline';
import ConsoleInputService from "../service/ConsoleInputService";

export default class HelpCommand extends BaseCommand {

    protected input!: ConsoleInputService;

    rl: readline.Interface;

    /**
     * The signature of the command
     */
    signature: string = 'help';

    description = 'List all available commands';

    /**
     * Whether to keep the process alive after command execution
     */
    public keepProcessAlive = false;


    constructor() {
        super();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.input = new ConsoleInputService(this.rl);
    }

    /**
     * Execute the command
     */
    async execute() {
        const console = App.container('console');
        const register = console.register();

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