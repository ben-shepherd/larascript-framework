/* eslint-disable no-unused-vars */
import { ParsedArgumentsArray } from "@src/core/domains/console/parsers/CommandArgumentParser";

export type ICommandConstructor<T extends ICommand = ICommand> = new (...args: any[]) => T

/**
 * ICommand is an interface for defining commands
 *
 * @interface ICommand
 */
export interface ICommand {

    /**
     * The signature of the command
     *
     * @type {string}
     */
    signature: string;

    /**
     * The description of the command
     *
     * @type {string}
     */
    description?: string;

    /**
     * Whether or not the command keeps the process alive after execution
     *
     * @type {boolean}
     */
    keepProcessAlive?: boolean;

    /**
     * Sets the parsed arguments of the command
     *
     * @param {ParsedArgumentsArray} parsedArgumenets
     */
    setParsedArguments: (parsedArgumenets: ParsedArgumentsArray) => void;

    /**
     * Executes the command
     *
     * @param {...any[]} args
     * @returns {Promise<any>}
     */
    execute(...args: any[]): Promise<any>;

    /**
     * Cleanup after the command has finished executing
     *
     * @returns {Promise<void>}
     */
    end(): void;
}

