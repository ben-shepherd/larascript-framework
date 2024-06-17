import { ICommandConstructor } from "./ICommand";

export type Registered = Map<string, ICommandConstructor>
export type RegisterParams = {key: string, cmdCtor: ICommandConstructor}

export interface ICommandRegister {
    register: (key: string, cmdCtor: ICommandConstructor) => void
    registerAll: (cmds: Array<RegisterParams>) => void
    getRegistered(): Registered
}