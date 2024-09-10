import readline from 'node:readline';

export interface IConsoleInputService {
    rl: readline.Interface;
    waitForEnter(text?: string): Promise<void>;
    writeLine(text?: string): void;
    normalizeAnswer(value, defaultValue): string;
    askQuestion(question: string): Promise<string>;
    clearScreen(): void;
}