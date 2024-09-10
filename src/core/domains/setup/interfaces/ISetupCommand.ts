import { IConsoleInputService } from '@src/core/domains/console/interfaces/IConsoleInputService';
import { IEnvService } from "@src/core/interfaces/IEnvService";

export interface ISetupCommand {
    env: IEnvService;
    input: IConsoleInputService;
    writeLine(line: string): void;
}