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
     * Command configs
     * Key is the signature
     */
    protected commandConfigs: Map<string, object> = new Map();

    /**
     * Register multiple commands
     * @param cmds 
     */
    registerAll(cmds: Array<ICommandConstructor>) {
        cmds.forEach(cmdCtor => this.register(cmdCtor))
    }

    /**
     * Register a new command
     * @param key 
     * @param cmdCtor 
     */
    register(cmdCtor: ICommandConstructor) 
    {
        const signature = (new cmdCtor).signature

        if(this.commands.has(signature)) {
            throw new CommandRegisterException(signature);
        }

        this.commands.set(signature, cmdCtor);
    }

    /**
     * Add command config
     * @param cmdCtor 
     * @param config 
     */
    addCommandConfig(signatures: string[], config: object) 
    {
        signatures.forEach((signature: string) => this.commandConfigs.set(signature, config));
    }

    /**
     * Get command config
     * @param cmdCtor 
     * @returns 
     */
    getCommandConfig<T extends object = object>(signature: string): T | null
    {
        return this.commandConfigs.get(signature) as T ?? null;
    }

    /**
     * Get a particular command by the key
     * @param key 
     * @returns 
     */
    get<CommandCtor extends ICommandConstructor>(key: string): CommandCtor
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
    getRegistered(): Registered {
        return this.commands
    }

    /**
     * @param string 
     * @returns 
     */
    getBySignature(string: string): ICommandConstructor | null {
        return this.commands.get(string) as ICommandConstructor ?? null
    }
}