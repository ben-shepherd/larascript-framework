import { ParsedArgumentsArray } from "@src/core/domains/console/parsers/CommandArgumentParser";

export type ICommandConstructor<T extends ICommand = ICommand> = new (...args: any[]) => T

export interface ICommand {
    signature: string;
    description?: string;
    keepProcessAlive?: boolean;
    setParsedArguments: (parsedArgumenets: ParsedArgumentsArray) => void;
    execute(...args: any[]): Promise<any>;
    end(): void;
}