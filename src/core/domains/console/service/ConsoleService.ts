import ICommandService from "../interfaces/ICommandService";
import CommandReader from "./CommandReader";
import CommandRegister from "./CommandRegister";

export default class ConsoleService implements ICommandService
{
    public reader(argv: string[]): CommandReader {
        return new CommandReader(argv);
    }

    public register(): CommandRegister {
        return CommandRegister.getInstance();
    }
}