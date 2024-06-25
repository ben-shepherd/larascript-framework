import CommandExecutionException from "../exceptions/CommandExecutionException";
import { ICommand } from "../interfaces/ICommand";
import { KeyPair, KeyPairArguementType, OnlyArguement, ParsedArguement, ParsedArgumentsArray } from "../parsers/CommandArgumentParser";

export default class BaseCommand implements ICommand {
    public signature!: string;
    public description?: string;
    public execute!: (...args: any[]) => any;
    protected parsedArgumenets: ParsedArgumentsArray = [];
    protected overwriteArgs: Record<string, string> = {};

    /**
     * Set the parsed arguements
     * @param parsedArgumenets 
     */
    setParsedArguments = (parsedArgumenets: ParsedArgumentsArray) => {
        this.parsedArgumenets = parsedArgumenets;
    }

    /**
     * Find a ParsedArguement at a given position (starts at 1)
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
     * @param key 
     * @returns 
     */
    getArguementByKey = (key: string): KeyPairArguementType | null => {
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
                return false;
            }

            return arguement.key === key
        }) as KeyPairArguementType ?? null
    }

    /**
     * 
     * @param key 
     * @param value 
     */
    setOverwriteArg(key: string, value: string) {
        this.overwriteArgs[key] = value
    }
}