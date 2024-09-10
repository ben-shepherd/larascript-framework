import readline from 'readline';
import CommandExecutionException from "../exceptions/CommandExecutionException";
import { ICommand } from "../interfaces/ICommand";
import { KeyPair, KeyPairArguementType, OnlyArguement, ParsedArguement, ParsedArgumentsArray } from "../parsers/CommandArgumentParser";
import ConsoleInputService from "../service/ConsoleInputService";

/**
 * Base command class
 *
 * @abstract
 */
export default abstract class BaseCommand implements ICommand {

    /**
     * Command signature
     */
    public signature!: string;

    /**
     * Command description
     */
    public description?: string;

    /**
     * Whether to keep the process alive after execution
     */
    public keepProcessAlive?: boolean = false;

    /**
     * Parsed arguements
     */
    protected parsedArgumenets: ParsedArgumentsArray = [];

    /**
     * Overwrite arguements
     */
    protected overwriteArgs: Record<string, string> = {};

    /**
     * Config
     */
    protected config: object = {};

    /**
     * Input service
     */
    protected input!: ConsoleInputService;

    /**
     * Readline interface
     */
    protected rl: readline.Interface;

    /**
     * Constructor
     *
     * @param config
     */
    constructor(config: object = {}) {
        this.config = config;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.input = new ConsoleInputService(this.rl);
    }

    /**
     * Execute the command
     *
     * @param args
     * @returns
     */
    abstract execute(...args: any[]): any;

    /**
     * Set the parsed arguements
     *
     * @param parsedArgumenets
     */
    setParsedArguments = (parsedArgumenets: ParsedArgumentsArray) => {
        this.parsedArgumenets = parsedArgumenets;
    }

    /**
     * Find a ParsedArguement at a given position (starts at 1)
     *
     * @param nth
     * @returns
     */
    getArguementAtPos = (nth: number): ParsedArguement | null => {
        if(nth === 0) {
            throw new CommandExecutionException('Unexpected 0 value. Did you mean 1?')
        }

        const arguementAtPos = this.parsedArgumenets[nth - 1] ?? null;

        if(!arguementAtPos) {
            return null;
        }

        return arguementAtPos
    }

    /**
     * Get an arguemenet by a given key
     */
    getArguementByKey = (key: string): ParsedArguement | null => {
        if(this.overwriteArgs[key]) {
            return {
                type: KeyPair,
                key,
                value: this.overwriteArgs[key]
            }
        }
        
        return this.parsedArgumenets.find((arguement) => {

            // We can ignore any arguements that are missing a key.
            if(arguement.type === OnlyArguement) {
                return {
                    type: OnlyArguement,
                    value: true
                }
            }

            return arguement.key === key
        }) as KeyPairArguementType ?? null
    }

    /**
     */
    setOverwriteArg(key: string, value: string) {
        this.overwriteArgs[key] = value
    }

    /**
     * End the process
     */
    end(): void {
        if(!this.keepProcessAlive) {
            process.exit();
        }
    }

}
