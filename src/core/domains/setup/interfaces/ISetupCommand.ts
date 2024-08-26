import readline from 'node:readline';
import { IConsoleInputService } from '../../console/interfaces/IConsoleInputService';
import { IEnvService } from "../../console/interfaces/IEnvService";

export interface ISetupCommand {
    env: IEnvService;
    input: IConsoleInputService;
    rl: readline.Interface;
    writeLine(line: string): void;
}