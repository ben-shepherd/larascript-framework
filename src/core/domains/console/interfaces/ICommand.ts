import { ParsedArgumentsArray } from "@src/core/domains/console/parsers/CommandArgumentParser";

export type ICommandConstructor<Command extends ICommand = ICommand> = new (...args: any[]) => Command

export interface ICommand {
    signature: string;
    description?: string;
    setParsedArguments: (parsedArgumenets: ParsedArgumentsArray) => void;
    execute(...args: any[]): any;
}