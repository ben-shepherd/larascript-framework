/* eslint-disable no-unused-vars */
import { ISetupCommand } from '@src/core/domains/setup/interfaces/ISetupCommand';

export type ActionCtor<T extends IAction = IAction> = new (...args: any[]) => T;

export interface IAction {
    handle: (ref: ISetupCommand, ...args: any[]) => Promise<any>;
}