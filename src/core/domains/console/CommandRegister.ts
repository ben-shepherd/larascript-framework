import Singleton from "@src/core/base/Singleton";
import CommandRegisterException from "./exceptions/CommandRegisterException";
import { ICommandConstructor } from "./interfaces/ICommand";
import { ICommandRegister, Registered, RegisterParams } from "./interfaces/ICommandRegister";

export default class CommandRegister extends Singleton implements ICommandRegister
{
    /**
     * Registered commands
     */
    protected commands: Registered = new Map();

    /**
     * Register multiple commands
     * @param cmds 
     */
    public registerAll(cmds: Array<RegisterParams>) {
        cmds.forEach(cmd => this.register(cmd.key, cmd.cmdCtor))
    }

    /**
     * Register a new command
     * @param key 
     * @param cmdCtor 
     */
    public register(key: string, cmdCtor: ICommandConstructor) 
    {
        if(this.commands.has(key)) {
            throw new CommandRegisterException(`Command '${key}' already registered`);
        }

        this.commands.set(key, cmdCtor);
    }

    /**
     * Get a particular command by the key
     * @param key 
     * @returns 
     */
    public get<CommandCtor extends ICommandConstructor>(key: string): CommandCtor
    {
        if(!this.commands.has(key)) {
            throw new CommandRegisterException(`Command '${key}' could not be found`);
        }

        return this.commands.get(key) as CommandCtor
    }

    /**
     * Returns all registered commands
     * @returns 
     */
    public getRegistered(): Registered {
        return this.commands
    }

    /**
     * Helper method for building register params from an array of CommandConstructors
     * @param commandCtors 
     * @returns 
     */
    public static buildRegisterParams(commandCtors: ICommandConstructor[]): RegisterParams[] {
        const registerParams: RegisterParams[] = []

        commandCtors.map(cmdCtor => {
            const signature = (new cmdCtor).signature

            registerParams.push({ key: signature, cmdCtor: cmdCtor })
        }) 

        return registerParams
    }
}