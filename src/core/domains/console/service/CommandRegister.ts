import Singleton from "@src/core/base/Singleton";
import CommandRegisterException from "@src/core/domains/console/exceptions/CommandRegisterException";
import { ICommandConstructor } from "@src/core/domains/console/interfaces/ICommand";
import { ICommandRegister, Registered } from "@src/core/domains/console/interfaces/ICommandRegister";

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
    public registerAll(cmds: Array<ICommandConstructor>) {
        cmds.forEach(cmdCtor => this.register(cmdCtor))
    }

    /**
     * Register a new command
     * @param key 
     * @param cmdCtor 
     */
    public register(cmdCtor: ICommandConstructor) 
    {
        const signature = (new cmdCtor).signature

        if(this.commands.has(signature)) {
            throw new CommandRegisterException(signature);
        }

        this.commands.set(signature, cmdCtor);
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
     * @param string 
     * @returns 
     */
    public getBySignature(string: string): ICommandConstructor | null {
        return this.commands.get(string) as ICommandConstructor ?? null
    }
}