import CommandExecutionException from "@src/core/domains/console/exceptions/CommandExecutionException";
import { ICommand } from "@src/core/domains/console/interfaces/ICommand";
import { KeyPair, KeyPairArguementType, OnlyArguement, ParsedArguement, ParsedArgumentsArray } from "@src/core/domains/console/parsers/CommandArgumentParser";
import ConsoleInputService from "@src/core/domains/console/service/ConsoleInputService";
import { App } from "@src/core/services/App";

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
     * Constructor
     *
     * @param config
     */
    constructor(config: object = {}) {
        this.config = config;
        this.input = new ConsoleInputService();
    }

    /**
     * Execute the command
     *
     * @param args
     * @returns
     */
    // eslint-disable-next-line no-unused-vars
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
        // Close the readline
        App.container('readline').close();

        // End the process
        if(!this.keepProcessAlive) {
            process.exit();
        }
    }

}
