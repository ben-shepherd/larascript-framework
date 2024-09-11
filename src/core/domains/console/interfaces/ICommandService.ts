/* eslint-disable no-unused-vars */
import { ICommandReader } from "@src/core/domains/console/interfaces/ICommandReader";
import { ICommandRegister } from "@src/core/domains/console/interfaces/ICommandRegister";

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
    reader: (argv: string[]) => ICommandReader;

    /**
     * Creates a new ICommandRegister instance
     *
     * @returns ICommandRegister
     */
    register: () => ICommandRegister;
}

