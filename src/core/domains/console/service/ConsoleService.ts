import ICommandService from "@src/core/domains/console/interfaces/ICommandService";
import CommandReader from "@src/core/domains/console/service/CommandReader";
import CommandRegister from "@src/core/domains/console/service/CommandRegister";
import { app } from "@src/core/services/App";

import { ICommandConstructor } from "../interfaces/ICommand";

/**
 * Short hand for `app('console')`
 */
export const console = () => app('console');

/**
 * ConsoleService class that implements the ICommandService interface.
 * This class provides methods for creating command readers and registering commands.
 */
export default class ConsoleService implements ICommandService {

    /**
     * Returns a singleton instance of the CommandReader class.
     * @param argv The arguments to pass to the command reader.
     * @returns CommandReader
     */
    public readerService(argv: string[]): CommandReader {
        return new CommandReader(argv);
    }

    /**
     * Returns a singleton instance of the CommandRegister class.
     * @returns CommandRegister
     */
    public registerService(): CommandRegister {
        return CommandRegister.getInstance();
    }

    /**
     * Registers a new command.
     * @param cmdCtor The command to register.
     * @param config The configuration for the commands.
     */
    public register(cmdCtor: ICommandConstructor, config?: object) {
        return this.registerService().register(cmdCtor, config);
    }

}