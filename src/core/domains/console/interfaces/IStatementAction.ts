import SetupCommand from '../commands/SetupCommand';

export type StatementActionCtor<T extends IStatementAction = IStatementAction> = new (...args: any[]) => T;

export interface IStatementAction {
    handle: (ref: SetupCommand, ...args: any[]) => Promise<any>;
}