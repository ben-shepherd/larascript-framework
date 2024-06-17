export type ICommandConstructor<Command extends ICommand = ICommand> = new (...args: any[]) => Command

export interface ICommand {
    signature: string;
    description?: string;
    execute(...args: any[]): Promise<any>
}