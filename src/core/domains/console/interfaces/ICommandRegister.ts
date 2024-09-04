import { ICommandConstructor } from "@src/core/domains/console/interfaces/ICommand";

export type Registered = Map<string, ICommandConstructor>

export interface ICommandRegister {
    register: (cmdCtor: ICommandConstructor)  => void;
    registerAll: (cmds: Array<ICommandConstructor>) => void;
    addCommandConfig(signatures: string[], config: object): void;
    getCommandConfig<T extends object = object>(signature: string): T | null;
    getRegistered(): Registered;
    getBySignature: (string: string) => void;
}