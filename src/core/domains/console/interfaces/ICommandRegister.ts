import { ICommandConstructor } from "@src/core/domains/Console/interfaces/ICommand";

export type Registered = Map<string, ICommandConstructor>

export interface ICommandRegister {
    register: (cmdCtor: ICommandConstructor)  => void;
    registerAll: (cmds: Array<ICommandConstructor>) => void;
    getRegistered(): Registered;
    getBySignature: (string: string) => void;
}