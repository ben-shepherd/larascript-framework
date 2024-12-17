import ICommandService from "@src/core/domains/console/interfaces/ICommandService";
import CommandReader from "@src/core/domains/console/service/CommandReader";
import CommandRegister from "@src/core/domains/console/service/CommandRegister";
import { app } from "@src/core/services/App";

/**
 * Short hand for `app('console')`
 */
export const console = () => app('console');

/**
 * ConsoleService class that implements the ICommandService interface.
 * This class provides methods for creating command readers and registering commands.
 */
export default class ConsoleService implements ICommandService {

    public reader(argv: string[]): CommandReader {
        return new CommandReader(argv);
    }

    public register(): CommandRegister {
        return CommandRegister.getInstance();
    }

}