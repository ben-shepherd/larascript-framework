/* eslint-disable no-unused-vars */
import { ICommandReader } from "@src/core/domains/console/interfaces/ICommandReader";
import { ICommandRegister } from "@src/core/domains/console/interfaces/ICommandRegister";

import { ICommandConstructor } from "./ICommand";

/**
 * Service that provides methods for registering and executing console commands
 *
 * @interface ICommandService
 */
export default interface ICommandService {

    /**
     * Creates a new ICommandReader instance with given argv
     *
     * @param argv
     * @returns ICommandReader
     */
    readerService: (argv: string[]) => ICommandReader;

    /**
     * Creates a new ICommandRegister instance
     *
     * @returns ICommandRegister
     */
    registerService: () => ICommandRegister;

    /**
     * Registers a new command.
     * @param cmdCtor The command to register.
     * @param config The configuration for the commands.
     */
    register: (cmdCtor: ICommandConstructor, config?: object)  => void;


}

