import ICommandService from "@src/core/domains/console/interfaces/ICommandService";
import CommandReader from "@src/core/domains/console/service/CommandReader";
import CommandRegister from "@src/core/domains/console/service/CommandRegister";

export default class ConsoleService implements ICommandService {

    public reader(argv: string[]): CommandReader {
        return new CommandReader(argv);
    }

    public register(): CommandRegister {
        return CommandRegister.getInstance();
    }

}