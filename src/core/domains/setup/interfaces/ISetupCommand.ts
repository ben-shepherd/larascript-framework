import readline from 'node:readline';
import { IEnvService } from "../../../interfaces/IEnvService";
import { IConsoleInputService } from '../../console/interfaces/IConsoleInputService';

export interface ISetupCommand {
    env: IEnvService;
    input: IConsoleInputService;
    rl: readline.Interface;
    writeLine(line: string): void;
}