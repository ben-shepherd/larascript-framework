import readline from 'node:readline';
import { IEnvService } from "@src/core/interfaces/IEnvService";
import { IConsoleInputService } from '@src/core/domains/console/interfaces/IConsoleInputService';

export interface ISetupCommand {
    env: IEnvService;
    input: IConsoleInputService;
    rl: readline.Interface;
    writeLine(line: string): void;
}