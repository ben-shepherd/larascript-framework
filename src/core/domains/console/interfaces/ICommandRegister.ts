import { ICommandConstructor } from "./ICommand";

export type Registered = Map<string, ICommandConstructor>

export interface ICommandRegister {
    register: (cmdCtor: ICommandConstructor)  => void;
    registerAll: (cmds: Array<ICommandConstructor>) => void;
    getRegistered(): Registered;
    getBySignature: (string: string) => void;
}