import BaseConfig from "@src/core/base/BaseConfig";
import CommandExecutionException from "@src/core/domains/console/exceptions/CommandExecutionException";
import { ICommand } from "@src/core/domains/console/interfaces/ICommand";
import { KeyPair, KeyPairArguementType, ParsedArguement, ParsedArgumentsArray, ValueOnly } from "@src/core/domains/console/parsers/CommandArgumentParser";
import ConsoleInputService from "@src/core/domains/console/service/ConsoleInputService";
import { App } from "@src/core/services/App";

/**
 * Base command class
 *
 * @abstract
 */
export default abstract class BaseCommand extends BaseConfig implements ICommand {

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
    protected config: { keepProcessAlive?: boolean } = {};

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
        super()
        this.config = config;
        this.input = new ConsoleInputService();
    }

    /**
     * Declare HasConfig
     */
    declare getConfig: <T = unknown>() => T;

    // eslint-disable-next-line no-unused-vars
    declare setConfig: (config: object) => void

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

        const foundAsOnlyArguement = this.parsedArgumenets.find((arguement) => {
            if(arguement.type !== ValueOnly) {
                return false;
            }

            if(arguement.value.includes(key)) {
                return true;
            }

            return false;
        })

        if(foundAsOnlyArguement) {
            return {
                ...foundAsOnlyArguement,
                value: ''
            }
        }

        const foundParsedArguement = this.parsedArgumenets.find((arguement) => {

            if(arguement.type === ValueOnly) {
                return false
            }

            return arguement.key === key
        }) as KeyPairArguementType ?? null

        return foundParsedArguement
    }

    /**
     */
    setOverwriteArg(key: string, value: string) {
        this.overwriteArgs[key] = value
    }

    /**
     * End the process
     */
    end(success: boolean = true): void {
        // Close the readline
        App.container('readline').close();

        // End the process
        if(!this.config.keepProcessAlive) {
            process.exit(success ? 0 : 1);
        }
    }

}
