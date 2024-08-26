import { ISetupCommand } from './ISetupCommand';

export type ActionCtor<T extends IAction = IAction> = new (...args: any[]) => T;

export interface IAction {
    handle: (ref: ISetupCommand, ...args: any[]) => Promise<any>;
}