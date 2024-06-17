import CommandRegister from "../CommandRegister";
import ICommandService from "../interfaces/ICommandService";

export default class CommandService implements ICommandService
{
    public register(): CommandRegister {
        return CommandRegister.getInstance();
    }
}